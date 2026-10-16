---
name: gemini-live-voice-agent
description: >-
  Build and integrate ultra-low-latency real-time bidirectional multimodal voice agents using
  Google Gemini Live API (gemini-2.0-flash / gemini-2.5-flash / gemini-3.1-flash-live-preview)
  via WebSockets and WebRTC. Includes ephemeral session token minting, AudioWorklet 16kHz PCM downsampling,
  gapless 24kHz audio playback with interruption barge-in, Voice Activity Detection (VAD), and live visualizers.
---

# Gemini Live Voice Agent Architecture & Integration

This skill documents the complete production pattern for building real-time, bidirectional voice agents powered by the **Google Gemini Multimodal Live API** in modern Next.js and React applications.

Visitors speak naturally into their microphone and receive instant, human-like voice responses with sub-second latency, natural turn-taking, real-time audio visualization, live speech-to-text transcripts, and tool calling capabilities.

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
               │──────────────────────────────────────────────────────────────────────────────▶│
               │                                                                               │
               │  8. Model Audio Stream: 24kHz PCM16 chunks -> Gapless AudioContext playback   │
               │◀──────────────────────────────────────────────────────────────────────────────│
               │                                                                               │
               │  9. Interruption Signal: `serverContent.interrupted === true`                 │
               │     Client stops audio buffer instantly (Barge-In)                            │
               │◀──────────────────────────────────────────────────────────────────────────────│
               │                                                                               │
               │  10. Client Tool Call (e.g. `open_lead_drawer`, `navigate_to_section`)        │
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
5. **Emergency Kill-Switch**: Check `LIVE_VOICE_ENABLED !== "false"` to immediately toggle feature availability without redeploying.

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
  model: "models/gemini-2.5-flash", // or models/gemini-2.0-flash-exp
  voice: "Kore", // Voices: Puck, Charon, Kore, Fenrir, Aoede
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
registerProcessor("audio-processor", AudioProcessor);
```

2. **WebSocket Transmission**:
   Convert the buffer to base64 and send via `realtimeInput`:
   ```typescript
   ws.send(JSON.stringify({
     realtimeInput: {
       mediaChunks: [{
         mimeType: "audio/pcm;rate=16000",
         data: arrayBufferToBase64(pcmBuffer),
       }],
     },
   }));
   ```

---

## 4. Gapless 24kHz Audio Playback & Barge-In Interruption

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
   When the user begins speaking while the model is responding, Gemini automatically detects user speech and sends an interrupt message:
   ```json
   { "serverContent": { "interrupted": true } }
   ```
   The client must **immediately stop all scheduled source nodes** and reset `nextStartTime = audioCtx.currentTime`. This creates the natural sensation of interrupting someone mid-sentence.

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

## 5. Tool Calling / Function Calling Over Voice

Gemini Live supports executing client-side actions during voice conversations. When the user asks to see a project or submit a form, Gemini issues a `toolCall` message.

### Protocol Flow:
1. Include tool definitions in the initial `setup` payload:
   ```typescript
   tools: [{
     functionDeclarations: [
       {
         name: "navigate_to_section",
         description: "Smoothly scrolls the visitor's screen to a specific section.",
         parameters: {
           type: "OBJECT",
           properties: {
             sectionId: { type: "STRING", enum: ["work", "services", "contact", "about"] },
           },
           required: ["sectionId"],
         },
       },
       {
         name: "open_lead_drawer",
         description: "Opens the interactive project inquiry drawer on the visitor's screen.",
         parameters: { type: "OBJECT", properties: {} },
       },
     ],
   }]
   ```
2. Handle `toolCall` from server:
   ```typescript
   if (message.toolCall) {
     for (const call of message.toolCall.functionCalls) {
       let result = { status: "success" };
       if (call.name === "open_lead_drawer") {
         options.onOpenLeadDrawer?.();
       } else if (call.name === "navigate_to_section") {
         document.getElementById(call.args.sectionId)?.scrollIntoView({ behavior: "smooth" });
       }

       // Send tool response back to Gemini
       ws.send(JSON.stringify({
         toolResponse: {
           functionResponses: [{
             response: { output: result },
             id: call.id,
           }],
         },
       }));
     }
   }
   ```

---

## 6. Mobile & Browser Compatibility Best Practices

- **User Gesture Requirement (iOS Safari)**:
  `AudioContext` must be created or resumed **inside a direct user gesture handler** (`onClick` or `onTouchStart`). Creating it asynchronously causes audio to remain permanently muted on iOS.
- **Background Tab Handling**:
  When a user switches browser tabs on mobile, the browser suspends the microphone and pauses WebSockets. Listen to `document.addEventListener("visibilitychange", ...)` and cleanly tear down or pause the session.
- **Voice Activity Level Metering**:
  Calculate Root-Mean-Square (RMS) amplitude on the audio stream to drive fluid 60FPS waveform animations (`VoiceVisualizer`).

---

## 7. File Directory Reference

When integrating into a codebase, organize files as follows:

| Path | Purpose |
| :--- | :--- |
| `app/api/live-token/route.ts` | Server route handler minting short-lived session tokens |
| `hooks/useLiveVoice.ts` | React custom hook managing WebSocket, mic stream, and state |
| `lib/voice/audio-player.ts` | Gapless 24kHz PCM audio queue and barge-in flusher |
| `public/worklets/pcm-processor.js` | AudioWorklet downsampler (native -> 16kHz PCM16) |
| `components/ui/VoiceVisualizer.tsx` | Frequency waveform or circular audio pulse UI component |
| `components/ui/ChatBot.tsx` | UI wrapper with Text/Live Voice mode switcher |
