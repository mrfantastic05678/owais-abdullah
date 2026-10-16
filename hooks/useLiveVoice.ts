"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { LiveAudioPlayer } from "@/lib/voice/audio-player";

export type LiveVoiceStatus =
  | "idle"
  | "requesting-mic"
  | "connecting"
  | "listening"
  | "speaking"
  | "ended"
  | "error";

export interface LiveVoiceHookOptions {
  onSessionEnd?: (transcriptHistory: Array<{ role: "user" | "assistant"; text: string }>) => void;
  onOpenLeadDrawer?: () => void;
  onExecuteTool?: (name: string, args: Record<string, unknown>) => Promise<Record<string, unknown>> | Record<string, unknown>;
}

import { AGENT_FUNCTION_DECLARATIONS } from "@/lib/agent-tools";
import { getVoicePersonaPrompt } from "@/lib/canonical-context";

export function useLiveVoice(options: LiveVoiceHookOptions = {}) {
  const [status, setStatus] = useState<LiveVoiceStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantTranscript, setAssistantTranscript] = useState("");
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const userVolumeRef = useRef(0);
  const hasSpokenRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Transcript accumulator refs (avoids stale closures during turns and teardown)
  const transcriptHistoryRef = useRef<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const currentUserTranscriptRef = useRef<string>("");
  const currentAssistantTranscriptRef = useRef<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecognitionRef = useRef<any>(null);
  const sessionResumptionHandleRef = useRef<string | null>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Helper: Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Stop session and release audio hardware
  const stopSession = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.close();
      audioPlayerRef.current = null;
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
      speechRecognitionRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close(1000, "User ended voice session");
      } catch {
        // Ignore close error
      }
      wsRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    hasSpokenRef.current = false;

    // Flush any pending speech turn before finalizing
    const pendingUser = currentUserTranscriptRef.current.trim();
    const pendingAssistant = currentAssistantTranscriptRef.current.trim();
    if (pendingUser) {
      transcriptHistoryRef.current.push({ role: "user", text: pendingUser });
      currentUserTranscriptRef.current = "";
    }
    if (pendingAssistant) {
      transcriptHistoryRef.current.push({ role: "assistant", text: pendingAssistant });
      currentAssistantTranscriptRef.current = "";
    }

    const fullHistory = [...transcriptHistoryRef.current];
    setTranscriptHistory(fullHistory);

    setStatus("ended");
    setVolumeLevel(0);
    setIsUserSpeaking(false);
    userVolumeRef.current = 0;
    setAssistantTranscript("");
    setUserTranscript("");

    if (optionsRef.current.onSessionEnd && fullHistory.length > 0) {
      optionsRef.current.onSessionEnd(fullHistory);
    }
  }, []);

  // Client Tool Execution (Agent capabilities)
  const executeClientTool = useCallback((name: string, args: Record<string, unknown>) => {
    if (name === "navigate_to_section") {
      const section = (args.section as string) || "work";
      const elem = document.getElementById(section) || document.querySelector(`[data-section="${section}"]`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
      return { status: "navigated", section };
    }

    if (name === "open_lead_drawer") {
      if (optionsRef.current.onOpenLeadDrawer) {
        optionsRef.current.onOpenLeadDrawer();
      }
      return { status: "lead_drawer_opened" };
    }

    return { status: "unsupported_tool" };
  }, []);

  // Start Voice Session
  const startSession = useCallback(async () => {
    try {
      setErrorMessage(null);
      setStatus("requesting-mic");
      setUserTranscript("");
      setAssistantTranscript("");
      transcriptHistoryRef.current = [];
      currentUserTranscriptRef.current = "";
      currentAssistantTranscriptRef.current = "";

      // 1. Initialize Player and resume audio pipeline
      const player = new LiveAudioPlayer(24000);
      await player.ensureAudioContext();
      audioPlayerRef.current = player;

      // 2. Request user microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: { ideal: 16000 },
        },
      });
      mediaStreamRef.current = stream;

      // 3. Optional local browser speech recognition fallback for zero-latency user captions
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const sr = new SpeechRecognition();
          sr.continuous = true;
          sr.interimResults = true;
          sr.lang = "en-US";
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sr.onresult = (evt: any) => {
            let chunk = "";
            for (let i = evt.resultIndex; i < evt.results.length; ++i) {
              if (evt.results[i].isFinal) {
                chunk += evt.results[i][0].transcript;
              }
            }
            if (chunk.trim()) {
              currentUserTranscriptRef.current = (
                currentUserTranscriptRef.current ? `${currentUserTranscriptRef.current} ` : ""
              ) + chunk.trim();
              setUserTranscript(currentUserTranscriptRef.current);
            }
          };
          sr.onerror = () => {};
          sr.start();
          speechRecognitionRef.current = sr;
        }
      } catch {
        // browser recognition optional
      }

      // 4. Request short-lived ephemeral token from Next.js backend
      setStatus("connecting");
      const tokenRes = await fetch("/api/live-token", { method: "POST" });
      if (!tokenRes.ok) {
        const errorData = await tokenRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initialize voice session.");
      }

      const { token, model, systemInstruction: remoteInstruction } = await tokenRes.json();
      if (!token) throw new Error("No authorization token received.");

      // 5. Connect to Live WebSocket directly from browser
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(
        token
      )}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        // Send initial Session Setup configuration with native transcription enabled
        const setupMessage: Record<string, unknown> = {
          setup: {
            model: model || "models/gemini-3.1-flash-live-preview",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Kore",
                  },
                },
              },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: {
              parts: [{ text: remoteInstruction || getVoicePersonaPrompt() }],
            },
            tools: [
              {
                functionDeclarations: AGENT_FUNCTION_DECLARATIONS,
              },
            ],
            sessionResumption: sessionResumptionHandleRef.current
              ? { handle: sessionResumptionHandleRef.current }
              : {},
          },
        };

        ws.send(JSON.stringify(setupMessage));

        // 6. Initialize AudioWorklet for 16kHz mono streaming
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const micAudioCtx = new AudioContextClass();
        audioContextRef.current = micAudioCtx;

        await micAudioCtx.audioWorklet.addModule("/worklets/pcm-processor.js");

        const micSource = micAudioCtx.createMediaStreamSource(stream);
        const workletNode = new AudioWorkletNode(micAudioCtx, "pcm-processor");
        workletNodeRef.current = workletNode;

        workletNode.port.onmessage = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const pcmInt16Buffer = e.data as ArrayBuffer;
            const base64Data = arrayBufferToBase64(pcmInt16Buffer);

            // Compute mic amplitude for acoustic visualizer & VAD
            const int16Array = new Int16Array(pcmInt16Buffer);
            let sumSq = 0;
            for (let i = 0; i < int16Array.length; i++) {
              sumSq += int16Array[i] * int16Array[i];
            }
            const rms = Math.sqrt(sumSq / int16Array.length);
            const normMic = Math.min(rms / 12000, 1);
            userVolumeRef.current = normMic;

            // User speech detection & Turn completion trigger
            if (normMic > 0.055) {
              setIsUserSpeaking(true);
              hasSpokenRef.current = true;
              if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
              }
            } else if (hasSpokenRef.current) {
              // User finished speaking, trigger turn inference after 650ms of silence
              if (!silenceTimerRef.current) {
                silenceTimerRef.current = setTimeout(() => {
                  if (hasSpokenRef.current && ws.readyState === WebSocket.OPEN) {
                    ws.send(
                      JSON.stringify({
                        clientContent: {
                          turnComplete: true,
                        },
                      })
                    );
                    hasSpokenRef.current = false;
                    silenceTimerRef.current = null;
                    setIsUserSpeaking(false);
                  }
                }, 650);
              }
            }

            // Stream real-time audio chunk using standard audio field
            ws.send(
              JSON.stringify({
                realtimeInput: {
                  audio: {
                    mimeType: "audio/pcm;rate=16000",
                    data: base64Data,
                  },
                },
              })
            );
          }
        };

        micSource.connect(workletNode);
        setStatus("listening");

        // 7. Start UI audio animation loop reacting to BOTH user and assistant speech
        const freqData = new Uint8Array(32);
        let currentSmoothed = 0;

        const updateWaveform = () => {
          let targetVol = 0;

          if (audioPlayerRef.current && audioPlayerRef.current.isSpeaking) {
            audioPlayerRef.current.getFrequencyData(freqData);
            let sum = 0;
            for (let i = 0; i < freqData.length; i++) {
              sum += freqData[i];
            }
            targetVol = sum / (freqData.length * 255);
          } else {
            // When assistant isn't speaking, react to user mic input
            targetVol = userVolumeRef.current;
          }

          // Smooth interpolation for fluid organic feel
          currentSmoothed += (targetVol - currentSmoothed) * 0.28;
          setVolumeLevel(currentSmoothed);

          animFrameRef.current = requestAnimationFrame(updateWaveform);
        };
        updateWaveform();
      };

      // Robust message parsing supporting both string and Blob types
      ws.onmessage = async (event) => {
        try {
          let rawText = "";
          if (typeof event.data === "string") {
            rawText = event.data;
          } else if (event.data instanceof Blob) {
            rawText = await event.data.text();
          } else if (event.data instanceof ArrayBuffer) {
            rawText = new TextDecoder().decode(event.data);
          }

          if (!rawText) return;
          const data = JSON.parse(rawText);

          // Handle Barge-in (interrupted)
          if (data.serverContent?.interrupted) {
            if (audioPlayerRef.current) {
              audioPlayerRef.current.interrupt();
            }
            setStatus("listening");
            return;
          }

          // 1. Capture model spoken transcript from native outputAudioTranscription
          if (data.serverContent?.outputTranscription?.text) {
            const chunk = data.serverContent.outputTranscription.text;
            currentAssistantTranscriptRef.current += chunk;
            setAssistantTranscript((prev) => prev + chunk);
          }

          // 2. Capture user spoken transcript from native inputAudioTranscription
          if (data.serverContent?.inputTranscription?.text) {
            const userChunk = data.serverContent.inputTranscription.text.trim();
            if (userChunk) {
              currentUserTranscriptRef.current = userChunk;
              setUserTranscript(userChunk);
            }
          }

          // 3. Handle incoming audio & parts fallback
          if (data.serverContent?.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
              // Play incoming 24kHz audio chunk
              if (part.inlineData?.data && audioPlayerRef.current) {
                audioPlayerRef.current.playChunk(part.inlineData.data);
                setStatus("speaking");
              }

              // Text caption parts fallback
              if (part.text && !currentAssistantTranscriptRef.current.includes(part.text)) {
                currentAssistantTranscriptRef.current += part.text;
                setAssistantTranscript((prev) => prev + part.text);
              }
            }
          }

          // 4. Handle turn complete: commit dialogue turn to session history
          if (data.serverContent?.turnComplete) {
            setStatus("listening");
            const userSpeech = currentUserTranscriptRef.current.trim();
            const assistantSpeech = currentAssistantTranscriptRef.current.trim();

            if (userSpeech) {
              transcriptHistoryRef.current.push({ role: "user", text: userSpeech });
            }
            if (assistantSpeech) {
              transcriptHistoryRef.current.push({ role: "assistant", text: assistantSpeech });
            }

            currentUserTranscriptRef.current = "";
            currentAssistantTranscriptRef.current = "";
            setTranscriptHistory([...transcriptHistoryRef.current]);
            setAssistantTranscript("");
            setUserTranscript("");
          }

          // 5. Handle session resumption update
          if (data.sessionResumptionUpdate?.newHandle) {
            sessionResumptionHandleRef.current = data.sessionResumptionUpdate.newHandle;
          }

          // 6. Handle tool calls
          if (data.toolCall?.functionCalls) {
            const functionResponses = [];
            for (const fc of data.toolCall.functionCalls) {
              let output: Record<string, unknown> = { status: "completed" };
              if (optionsRef.current.onExecuteTool) {
                try {
                  output = (await optionsRef.current.onExecuteTool(
                    fc.name,
                    fc.args || {}
                  )) as Record<string, unknown>;
                } catch (toolErr) {
                  output = { status: "error", error: String(toolErr) };
                }
              } else {
                output = executeClientTool(fc.name, fc.args || {});
              }

              functionResponses.push({
                response: { output },
                id: fc.id,
              });
            }

            // Return tool response back to Gemini Live
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  toolResponse: {
                    functionResponses,
                  },
                })
              );
            }
          }
        } catch (err) {
          console.error("[useLiveVoice] Error parsing message:", err);
        }
      };

      ws.onerror = (e) => {
        console.error("[useLiveVoice] WebSocket connection issue:", e);
        setErrorMessage("Live voice connection encountered an issue.");
        setStatus("error");
      };

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          console.warn("[useLiveVoice] WebSocket closed:", event.code, event.reason);
          if (status !== "ended") {
            setErrorMessage("Voice session disconnected.");
            setStatus("error");
          }
        }
      };
    } catch (err: unknown) {
      console.error("[useLiveVoice] Initialization failed:", err);
      const message = err instanceof Error ? err.message : "Could not connect to microphone or voice service.";
      setErrorMessage(message);
      setStatus("error");
    }
  }, [executeClientTool, status]);

  // Toggle mic mute
  const toggleMute = useCallback(() => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return {
    status,
    errorMessage,
    isMuted,
    userTranscript,
    assistantTranscript,
    transcriptHistory,
    volumeLevel,
    isUserSpeaking,
    startSession,
    stopSession,
    toggleMute,
  };
}
