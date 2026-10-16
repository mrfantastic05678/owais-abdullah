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

  const currentUserTranscriptRef = useRef("");
  const currentAssistantTranscriptRef = useRef("");
  const transcriptHistoryRef = useRef<Array<{ role: "user" | "assistant"; text: string }>>([]);
  const hasUserSpokenRef = useRef(false);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const userVolumeRef = useRef(0);
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
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

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

    if (wsRef.current) {
      try {
        wsRef.current.close(1000, "User ended voice session");
      } catch {
        // Ignore close error
      }
      wsRef.current = null;
    }

    // Flush any pending uncommitted speech
    const pendingUser = currentUserTranscriptRef.current.trim();
    const pendingAssistant = currentAssistantTranscriptRef.current.trim();
    const finalHistory = [...transcriptHistoryRef.current];
    if (pendingUser) {
      finalHistory.push({ role: "user", text: pendingUser });
    }
    if (pendingAssistant) {
      finalHistory.push({ role: "assistant", text: pendingAssistant });
    }

    currentUserTranscriptRef.current = "";
    currentAssistantTranscriptRef.current = "";
    transcriptHistoryRef.current = [];
    hasUserSpokenRef.current = false;

    setStatus("ended");
    setVolumeLevel(0);
    setIsUserSpeaking(false);
    userVolumeRef.current = 0;
    setAssistantTranscript("");
    setUserTranscript("");

    if (optionsRef.current.onSessionEnd && finalHistory.length > 0) {
      optionsRef.current.onSessionEnd(finalHistory);
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
      currentUserTranscriptRef.current = "";
      currentAssistantTranscriptRef.current = "";
      transcriptHistoryRef.current = [];
      hasUserSpokenRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

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

      // 3. Request short-lived ephemeral token from Next.js backend
      setStatus("connecting");
      const tokenRes = await fetch("/api/live-token", { method: "POST" });
      if (!tokenRes.ok) {
        const errorData = await tokenRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to initialize voice session.");
      }

      const { token, model, systemInstruction: remoteInstruction } = await tokenRes.json();
      if (!token) throw new Error("No authorization token received.");

      // 4. Connect to Live WebSocket directly from browser
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

        // 5. Initialize AudioWorklet for 16kHz mono streaming
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

            // Compute mic amplitude for visualizer and echo-gate
            const int16Array = new Int16Array(pcmInt16Buffer);
            let sumSq = 0;
            for (let i = 0; i < int16Array.length; i++) {
              sumSq += int16Array[i] * int16Array[i];
            }
            const rms = Math.sqrt(sumSq / int16Array.length);
            // Scaled for high sensitivity so calm / slower speaking is immediately recognized
            const normMic = Math.min(rms / 2500, 1);
            userVolumeRef.current = normMic;

            // Acoustic Echo Gate:
            // If the assistant is actively talking through the device speakers,
            // suppress speaker bleed unless user speaks with intentional volume (barge-in >= 0.22)
            const isAssistantSpeaking = audioPlayerRef.current?.isSpeaking ?? false;
            if (isAssistantSpeaking && normMic < 0.22) {
              setIsUserSpeaking(false);
              return;
            }

            const speakingNow = normMic > 0.030;
            setIsUserSpeaking(speakingNow);

            // Speech cadence and turn completion handler for slower speakers
            if (speakingNow && !isAssistantSpeaking) {
              hasUserSpokenRef.current = true;
              if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
                silenceTimerRef.current = null;
              }
            } else if (hasUserSpokenRef.current && !isAssistantSpeaking) {
              // User was speaking and paused.
              // 900ms allows calm/slow speakers breathing room between words,
              // and prompts Gemini once they have finished their sentence.
              if (!silenceTimerRef.current) {
                silenceTimerRef.current = setTimeout(() => {
                  if (ws.readyState === WebSocket.OPEN && hasUserSpokenRef.current) {
                    ws.send(
                      JSON.stringify({
                        clientContent: {
                          turnComplete: true,
                        },
                      })
                    );
                    hasUserSpokenRef.current = false;
                    silenceTimerRef.current = null;
                    setIsUserSpeaking(false);
                  }
                }, 900);
              }
            }

            // Stream real-time audio chunk to Gemini Live
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

          // 1. Capture user spoken transcript from native inputAudioTranscription
          if (data.serverContent?.inputTranscription?.text) {
            const userChunk = data.serverContent.inputTranscription.text;
            currentUserTranscriptRef.current += userChunk;
            setUserTranscript((prev) => prev + userChunk);
          }

          // 2. Capture assistant spoken transcript from native outputAudioTranscription
          if (data.serverContent?.outputTranscription?.text) {
            const assistantChunk = data.serverContent.outputTranscription.text;
            currentAssistantTranscriptRef.current += assistantChunk;
            setAssistantTranscript((prev) => prev + assistantChunk);
          }

          // 3. Handle incoming 24kHz audio playback & fallback caption parts
          if (data.serverContent?.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
              if (part.inlineData?.data && audioPlayerRef.current) {
                audioPlayerRef.current.playChunk(part.inlineData.data);
                setStatus("speaking");
              }

              // Text caption fallback
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
