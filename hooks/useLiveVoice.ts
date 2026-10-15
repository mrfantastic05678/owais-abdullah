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
}

const VOICE_PERSONA = `
You are Otto AI, the real-time AI Voice Assistant on Owais Abdullah's portfolio site (owaisabdullah.dev). Your initials O.A. mirror Owais Abdullah.
You speak with natural warmth, clarity, confidence, and conversational brevity. You are having a real-time phone-like voice conversation with a visitor.

Key Guidelines:
- Keep answers concise (1-3 conversational sentences). Avoid long monologues.
- You know Owais's full background: Full-Stack Engineer, AI Agents Architect, builder of Digital FTEs, Next.js SaaS platforms, and high-performance Astro web systems.
- When someone asks what Owais builds, mention:
  "Owais builds autonomous AI agents, Digital FTEs that automate company operations 24/7, and high-scale Next.js SaaS platforms. What kind of project are you looking to launch?"
- If they want to see his work, call the tool 'navigate_to_section' with 'work' or 'services'.
- If they are ready to discuss hiring, getting an estimate, or building a project, call 'open_lead_drawer' and tell them:
  "I've opened the project intake form right on your screen. You can pop your details in there, or reach Owais directly on WhatsApp."
- Languages: English default, but you understand and can speak Urdu or other languages fluently if the visitor speaks them.
`;

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

    setStatus("ended");
    setVolumeLevel(0);
    setIsUserSpeaking(false);
    userVolumeRef.current = 0;

    if (optionsRef.current.onSessionEnd && transcriptHistory.length > 0) {
      optionsRef.current.onSessionEnd(transcriptHistory);
    }
  }, [transcriptHistory]);

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

      const { token, model } = await tokenRes.json();
      if (!token) throw new Error("No authorization token received.");

      // 4. Connect to Live WebSocket directly from browser
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(
        token
      )}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        // Send initial Session Setup configuration
        const setupMessage = {
          setup: {
            model: model || "models/gemini-3.8-live",
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
            systemInstruction: {
              parts: [{ text: VOICE_PERSONA }],
            },
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "navigate_to_section",
                    description: "Smoothly navigate the portfolio page to a section (e.g. 'work', 'services', 'contact', 'hero').",
                    parameters: {
                      type: "OBJECT",
                      properties: {
                        section: {
                          type: "STRING",
                          description: "The section identifier: 'work', 'services', 'contact', or 'hero'",
                        },
                      },
                      required: ["section"],
                    },
                  },
                  {
                    name: "open_lead_drawer",
                    description: "Open the interactive project spec intake drawer in the chat interface.",
                    parameters: {
                      type: "OBJECT",
                      properties: {},
                    },
                  },
                ],
              },
            ],
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
            const pcmBuffer = e.data as ArrayBuffer;
            const base64Data = arrayBufferToBase64(pcmBuffer);

            // Calculate user voice amplitude for real-time visual feedback
            const int16Array = new Int16Array(pcmBuffer);
            let sum = 0;
            const step = 4;
            for (let i = 0; i < int16Array.length; i += step) {
              sum += Math.abs(int16Array[i]);
            }
            const avgAmp = int16Array.length > 0 ? sum / (int16Array.length / step) : 0;
            // Background room noise threshold ~180; speech range 600 - 8000
            const normMic = Math.min(1, Math.max(0, (avgAmp - 180) / 3800));
            userVolumeRef.current = normMic;
            const isSpeakingNow = normMic > 0.055;
            setIsUserSpeaking(isSpeakingNow);

            // Turn Detection & Speech Bracketing
            if (isSpeakingNow) {
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

        // 6. Start UI audio animation loop reacting to BOTH user and assistant speech
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

          // Handle incoming audio & transcripts
          if (data.serverContent?.modelTurn?.parts) {
            for (const part of data.serverContent.modelTurn.parts) {
              // Play incoming 24kHz audio chunk
              if (part.inlineData?.data && audioPlayerRef.current) {
                audioPlayerRef.current.playChunk(part.inlineData.data);
                setStatus("speaking");
              }

              // Text caption parts
              if (part.text) {
                setAssistantTranscript((prev) => prev + part.text);
              }
            }
          }

          // Handle turn complete
          if (data.serverContent?.turnComplete) {
            setStatus("listening");
            setAssistantTranscript((finalText) => {
              if (finalText.trim()) {
                setTranscriptHistory((hist) => [...hist, { role: "assistant", text: finalText.trim() }]);
              }
              return "";
            });
          }

          // Handle tool calls
          if (data.toolCall?.functionCalls) {
            const functionResponses = [];
            for (const fc of data.toolCall.functionCalls) {
              const result = executeClientTool(fc.name, fc.args || {});
              functionResponses.push({
                response: { output: result },
                id: fc.id,
              });
            }

            // Return tool response
            ws.send(
              JSON.stringify({
                toolResponse: {
                  functionResponses,
                },
              })
            );
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
