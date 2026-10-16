---
name: gemini-live-voice-agent
description: >-
  Build and integrate ultra-low-latency real-time bidirectional multimodal voice agents using
  Google Gemini Live API (gemini-2.0-flash / gemini-2.5-flash / gemini-3.1-flash-live-preview)
  via WebSockets and WebRTC. Includes ephemeral session token minting, AudioWorklet 16kHz PCM downsampling,
  gapless 24kHz audio playback with interruption barge-in, Voice Activity Detection (VAD), acoustic echo gating,
  session resumption, and live visualizers.
---

# Gemini Live Voice Agent Architecture & Integration

This skill documents the complete production pattern for building real-time, bidirectional voice agents powered by the **Google Gemini Multimodal Live API** (`BidiGenerateContentConstrained`) in modern Next.js and React applications.

Visitors speak naturally into their microphone and receive instant, human-like voice responses with sub-second latency, natural turn-taking, real-time audio visualization, acoustic echo suppression, zero-reload cross-page navigation, and tool execution.

---

## 1. System Architecture

The architecture uses direct client-to-Google WebSocket streaming secured by short-lived server-minted ephemeral tokens. The browser streams raw audio directly to Google's edge, ensuring minimum latency and zero server audio bandwidth.

```
┌────────────────────────────────┐         ┌───────────────────────────┐         ┌───────────────────────────┐
│     Client Browser (Next.js)   │         │    Next.js API Server     │         │   Google Gemini Live API  │
└────────────────────────────────┘         └───────────────────────────┘         └───────────────────────────┘
               │                                         │                                     │
               │  1. Request Voice Session Token         │                                     │
               │  POST /api/live-token                   │                                     │
               │────────────────────────────────────────▶│                                     │
               │                                         │  2. Mint 1-Time Ephemeral Token     │
               │                                         │  POST /v1beta/auth_tokens           │
               │                                         │  x-goog-api-key: SERVER_SECRET      │
               │                                         │────────────────────────────────────▶│
               │                                         │                                     │
               │                                         │  3. Return auth_tokens/xxxx         │
               │                                         │◀────────────────────────────────────│
               │  4. Return Token { token, model, voice }│                                     │
               │◀────────────────────────────────────────│                                     │
               │                                                                               │
               │  5. Direct WSS Handshake (wss://generativelanguage.googleapis.com/ws/...)     │
               │     Bearer Token = auth_tokens/xxxx                                           │
               │══════════════════════════════════════════════════════════════════════════════▶│
               │                                                                               │
               │  6. Bidi Setup Message (Persona, Voice: "Kore", Tool Definitions)             │
               │──────────────────────────────────────────────────────────────────────────────▶│
               │                                                                               │
               │  7. Mic Audio Stream: AudioWorklet 16kHz Mono PCM16 chunks (base64)           │
               │     (Protected by Acoustic Echo Gate to prevent self-interruption)            │
               │──────────────────────────────────────────────────────────────────────────────▶│
               │                                                                               │
               │  8. Model Audio Stream: 24kHz PCM16 chunks -> Gapless AudioContext playback   │
               │◀──────────────────────────────────────────────────────────────────────────────│
               │                                                                               │
               │  9. Interruption Signal: `serverContent.interrupted === true`                 │
               │     Client stops audio buffer instantly (Barge-In)                            │
               │◀──────────────────────────────────────────────────────────────────────────────│
               │                                                                               │
               │  10. Client Tool Call (e.g. `open_lead_drawer`, `navigate`)                   │
               │◀──────────────────────────────────────────────────────────────────────────────│
               │  11. Return Tool Response                                                     │
               │──────────────────────────────────────────────────────────────────────────────▶│
```

---

## 2. Server-Side Token Minting (`POST /api/live-token`)

Never expose the master `GEMINI_API_KEY` to the client. The server generates a single-use ephemeral token constrained to short expiration windows.

### Security Guarantees:
1. **Single Use**: `uses: 1` ensures the token cannot be reused across connections.
2. **Connect Window**: `newSessionExpireTime = now + 2 minutes`. If connection isn't established within 2 minutes, the token self-destructs.
3. **Session Ceiling**: `expireTime = now + 30 minutes` prevents indefinite connection hijacking.
4. **Sliding-Window Rate Limiting**: Limit IP mint requests (e.g. max 6 sessions per 10 minutes per IP).
5. **Turnstile Bot Gating**: Validate Cloudflare Turnstile token when `TURNSTILE_SECRET_KEY` is configured.
6. **Emergency Kill-Switch**: Check `LIVE_VOICE_ENABLED !== "false"` to immediately toggle feature availability without redeploying.

```typescript
// app/api/live-token/route.ts
const now = Date.now();
const expireTime = new Date(now + 30 * 60 * 1000).toISOString();
const newSessionExpireTime = new Date(now + 2 * 60 * 1000).toISOString();

const res = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
  method: "POST",
  headers: {
    "x-goog-api-key": process.env.GEMINI_API_KEY!,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    uses: 1,
    expireTime,
    newSessionExpireTime,
  }),
});

const data = await res.json();
return Response.json({
  token: data.name, // "auth_tokens/xxxx..."
  model: "models/gemini-3.1-flash-live-preview", // or models/gemini-2.5-flash
  voice: "Kore", // Voices: Puck, Charon, Kore, Fenrir, Aoede
  systemInstruction: getVoicePersonaPrompt(),
});
```

---

## 3. Client Audio Pipeline: High-Performance Capture

Gemini Multimodal Live API expects audio in **16kHz mono 16-bit linear PCM**. Standard browser microphones record at 44.1kHz or 48kHz.

### The AudioWorklet Pattern (Off-Main-Thread Resampling)
Never use `ScriptProcessorNode` — it runs on the main browser thread, causes audio glitches during DOM rendering, and is deprecated.

1. **AudioWorkletProcessor** runs in a dedicated audio thread:
   - Captures raw float32 samples from microphone.
   - Calculates downsample ratio: `ratio = sampleRate / 16000`.
   - Linear interpolation downsamples from native rate to 16,000 Hz.
   - Quantizes float32 (-1.0 to 1.0) into signed 16-bit integers (`Int16Array`).
   - Buffers into 512-sample (32ms) chunks and posts to main thread via `port.postMessage`.

```javascript
// public/worklets/pcm-processor.js
class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Int16Array(512);
    this.bufferIndex = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channelData = input[0];
    const downsampleRatio = sampleRate / 16000;

    for (let i = 0; i < channelData.length; i += downsampleRatio) {
      const sample = Math.max(-1, Math.min(1, channelData[Math.floor(i)]));
      this.buffer[this.bufferIndex++] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;

      if (this.bufferIndex >= this.buffer.length) {
        this.port.postMessage(this.buffer.slice().buffer, [this.buffer.slice().buffer]);
        this.bufferIndex = 0;
      }
    }
    return true;
  }
}
registerProcessor("pcm-processor", AudioProcessor);
```

---

## 4. Preventing Acoustic Feedback & Self-Interruption Loops

When visitors use device speakers (laptops or phones without headphones), the microphone captures the assistant's own voice coming from the speakers. Without suppression, Gemini hears its own voice, thinks the user is speaking, and interrupts itself repeatedly.

### The Acoustic Echo Gate Solution
In `hooks/useLiveVoice.ts`:
1. Track whether the assistant is currently playing audio (`audioPlayerRef.current?.isSpeaking`).
2. Compute real-time Root-Mean-Square (RMS) amplitude on captured microphone chunks.
3. If the assistant is speaking and mic amplitude is below intentional barge-in volume (`normMic < 0.16`), **suppress the audio packet**:
   ```typescript
   const isAssistantSpeaking = audioPlayerRef.current?.isSpeaking ?? false;
   if (isAssistantSpeaking && normMic < 0.16) {
     setIsUserSpeaking(false);
     return; // Echo gate: suppress speaker bleed
   }
   ```
4. **Never send artificial client `turnComplete: true` on timers** when streaming live PCM audio. Gemini Live has built-in server-side Voice Activity Detection (VAD) that naturally detects conversational turn completion.

---

## 5. Gapless 24kHz Audio Playback & Barge-In Interruption

Gemini streams audio chunks back as **24kHz signed 16-bit linear PCM**. Playing chunks naively causes audible clicks and gaps between packets.

### The `LiveAudioPlayer` Solution:
1. **Time-Aligned Cursor Scheduling**:
   Maintain a `nextStartTime` cursor in `AudioContext`. For each received audio chunk:
   ```typescript
   const startTime = Math.max(audioCtx.currentTime, this.nextStartTime);
   sourceNode.start(startTime);
   this.nextStartTime = startTime + audioBuffer.duration;
   ```
2. **Instant Interruption (Barge-In)**:
   When the user interrupts the assistant, Gemini automatically sends an interrupt message:
   ```json
   { "serverContent": { "interrupted": true } }
   ```
   The client **immediately stops all active source nodes** and resets `nextStartTime = audioCtx.currentTime`.

```typescript
// lib/voice/audio-player.ts
public interrupt(): void {
  for (const node of this.activeSourceNodes) {
    try {
      node.stop();
      node.disconnect();
    } catch {}
  }
  this.activeSourceNodes = [];
  if (this.audioCtx) {
    this.nextStartTime = this.audioCtx.currentTime;
  }
}
```

---

## 6. Zero-Reload SPA Navigation & Persistent Voice Sessions

If the voice bot navigates the visitor to another page or section, the voice connection **must not drop**.

### Seamless Multi-Page Persistence:
1. Mount the voice agent in the Root Layout Shell (`components/ConditionalUI.tsx`), not inside route page components.
2. When executing the `navigate` tool, use Next.js client-side router (`router.push(path)`):
   ```typescript
   if (name === "navigate") {
     const res = handlePortfolioNavigation(args.target, pathname, router);
     return res;
   }
   ```
3. Because client-side routing changes only the page DOM without reloading the root layout shell, the active WebSocket connection, `AudioContext`, and `AudioWorklet` remain 100% active and speaking continuously across route transitions.

---

## 7. Session Resumption (`sessionResumption`)

Mobile connections and WiFi handoffs can cause brief packet drops. Gemini Live provides session resumption handles:

1. When receiving a resumption handle from the server:
   ```typescript
   if (data.sessionResumptionUpdate?.newHandle) {
     sessionResumptionHandleRef.current = data.sessionResumptionUpdate.newHandle;
   }
   ```
2. Upon reconnecting, supply the cached handle in the setup message:
   ```typescript
   sessionResumption: sessionResumptionHandleRef.current
     ? { handle: sessionResumptionHandleRef.current }
     : {}
   ```
   Handles remain valid for up to 2 hours, allowing the assistant to pick up the conversation context immediately.

---

## 8. File Directory Reference

When integrating into a codebase, organize files as follows:

| Path | Purpose |
| :--- | :--- |
| `app/api/live-token/route.ts` | Server route handler minting short-lived session tokens with Turnstile gating |
| `hooks/useLiveVoice.ts` | React custom hook managing WebSocket, mic stream, echo gate, and tool execution |
| `lib/voice/audio-player.ts` | Gapless 24kHz PCM audio queue and barge-in flusher |
| `public/worklets/pcm-processor.js` | AudioWorklet downsampler (native -> 16kHz PCM16) |
| `components/ui/VoiceVisualizer.tsx` | Frequency waveform or circular audio pulse UI component |
| `lib/client-navigation.ts` | Client SPA cross-page navigation handler |
| `lib/agent-tools.ts` | Unified tool declarations shared across text and voice |
