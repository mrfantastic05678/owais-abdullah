# Portfolio Live Voice Assistant — Implementation Spec (draft v0.1)

**Status:** draft, 2026-10-12 · research complete · no code yet
**For:** owaisabdullah.dev (Next.js + TypeScript) · **Decisions locked:** separate Google account + API key for portfolio; hero-section button + live toggle inside the existing chatbot widget

---

## 1. Goal

A visitor clicks "Talk to my AI" (or flips the Live toggle in the chat widget) and has a real-time voice conversation with an AI assistant that pitches Owais — services, stack, proof of work, contact — running on the Gemini Live API free tier. It doubles as a live demo of his AI-agent building skill.

## 2. Placement

- **Hero section:** a "Talk to my AI" button (mic icon). Click → opens the chat widget (if closed) and immediately starts a live voice session (after mic permission).
- **Chatbot widget:** a Live/Text toggle in the widget header. Text mode = existing chatbot behavior. Live mode = voice session UI (waveform state, live captions, end button).
- One widget, two modes. Live mode suspends the text input; ending the session returns to text mode with the transcript optionally inserted as chat history.

## 3. Architecture

```
Browser                                    Next.js server                          Google
------                                     --------------                          ------
[Hero btn / widget toggle]
        │ POST /api/live-token {turnstileToken}
        │─────────────────────────────────▶│  1. Verify Turnstile
        │                                   │  2. Rate-limit check (per IP)
        │                                   │  3. POST /v1beta/auth_tokens
        │                                   │     x-goog-api-key: PORTFOLIO_KEY (server env only)
        │                                   │     { uses: 1, expireTime: +30m,
        │                                   │       newSessionExpireTime: +1m,
        │                                   │       liveConnectConstraints: { model, config } }
        │◀──────────────────────────────────│  4. Return { token: token.name }
        │
[ai.live.connect, apiKey = token]  ═════════ WSS ═══════════════════════════════▶│
        │  mic → AudioWorklet → 16kHz PCM16 → sendRealtimeInput                   │
        │◀ model audio 24kHz PCM16 ← onmessage ──────────────────────────────────│
```

**Why this shape:** the browser talks directly to Google (lowest latency, zero audio bandwidth on his server). The API key never leaves the server. System instructions stay server-side, locked into the token.

## 4. Server — `POST /api/live-token`

1. Verify Cloudflare Turnstile token (`POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with secret + token + remote IP). On success, set a short-lived signed clearance cookie so the challenge isn't per-request.
2. Rate limit: per-IP sliding window (e.g., a few mints/hour) + per-IP daily mint quota. Upstash Redis or in-memory (single instance) — pick per deploy target.
3. Mint the ephemeral token via REST:
   - `uses: 1`, `newSessionExpireTime`: now + 1 min (connect window), `expireTime`: now + 30 min (session ceiling)
   - `liveConnectConstraints.model`: `gemini-3.8-live` (configurable; see §13)
   - `liveConnectConstraints.config`: full session config (§5) — this locks the model, voice, system instruction, and modalities so a stolen token can't be repurposed
4. Return `{ token }`. Never log the token. Kill switch: `LIVE_VOICE_ENABLED=false` → route returns 503.

## 5. Session config (locked server-side)

```ts
{
  responseModalities: ['AUDIO'],
  systemInstruction: { parts: [{ text: PORTFOLIO_PERSONA }] }, // §6
  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
  inputAudioTranscription: {},   // live captions of the visitor
  outputAudioTranscription: {},  // live captions of the assistant
  realtimeInputConfig: {
    automaticActivityDetection: { silenceDurationMs: 600, prefixPaddingMs: 200 },
    activityHandling: 'START_OF_ACTIVITY_INTERRUPTS', // barge-in
    turnCoverage: 'TURN_INCLUDES_ONLY_ACTIVITY',
  },
  contextWindowCompression: { slidingWindow: {} },
  sessionResumption: {},
}
```

## 6. Persona (system instruction)

Draft guidance — final copy is Owais's call:

- Identity: "You are Otto Voice, the AI assistant on Owais Abdullah's portfolio site." Friendly, concise, spoken style (short sentences — it's voice, not an essay).
- Knowledge: wire in his canonical profile (`owaisabdullah.dev/api/profile`) at token-mint time — services (web dev, AI agents/chatbots, automation, SEO), stack, selected proof points, contact (hello@owaisabdullah.dev, WhatsApp). Refresh the snapshot on deploy, not per request.
- Behavior: answer questions about Owais, his services, and his work; offer to share contact info; if asked something out of scope, say so briefly and steer back. Never invent rates, availability, or client names — say "you'd need to ask Owais" and point to contact.
- Languages: English default; handle Urdu if the visitor speaks it (model auto-detects).

## 7. Client — audio pipeline

**Capture (mic → Gemini):**
- `getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } })`, then verify `track.getSettings()`.
- `MediaStreamAudioSourceNode` → **AudioWorklet** (never ScriptProcessorNode — deprecated, main-thread, janky under sustained streaming) → downsample to **16 kHz mono 16-bit PCM**, post 20–40 ms chunks (640–1280 bytes) immediately; don't buffer past ~100 ms.
- Send via `session.sendRealtimeInput({ audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } })`.
- Don't use the legacy `media` key. For text injection use `sendRealtimeInput({ text })`; reserve `sendClientContent` for seeding initial history only.

**Playback (Gemini → speakers):**
- Separate `AudioContext` at 24 kHz. Convert Int16 → Float32 (`sample / 32768`).
- Schedule each chunk with a `nextStartTime` cursor (cursor += chunk duration) — gapless, no overlap.
- On `serverContent.interrupted === true` (barge-in): stop scheduled sources immediately, flush the queue.

**Captions:** `serverContent.inputTranscription.text` / `outputTranscription.text` stream in via `onmessage` — render as live captions under the waveform.

## 8. Widget UX states

`idle → requesting-mic → connecting → listening ⇄ speaking → ended | error`

- Mic permission is requested inside the button-click gesture (Safari requires it; also create/resume the AudioContext there and play a short silence buffer or first playback is silent).
- Show a live region for screen readers; full keyboard operability; transcript fallback for visitors without a mic.
- Mobile: handle `visibilitychange` — backgrounded tabs may kill the mic/socket; rebuild the session on foreground.
- HTTPS is required for mic access.

## 9. Guardrails (anti-abuse)

- Separate Google **account** for the portfolio (Owais's decision — stronger than a separate project; quota and billing fully isolated from ContentFTE).
- Token: `uses: 1`, 1-min connect window, ≤30-min session ceiling, locked model + config.
- Turnstile on first activation per visitor (clearance cookie after).
- Per-IP mint rate limits + daily quotas on `/api/live-token`.
- Client + server session caps: max session minutes, idle-timeout disconnect (an open mic streams ambient audio continuously — this is the quota killer).
- Kill switch env flag + AI Studio usage alerts.
- Disclosure line in the widget: conversations are processed by Google and free-tier inputs may be used to improve Google's models.

## 10. Quota & cost

- Free tier on Live models: effectively unlimited RPM/RPD, **TPM-capped** (his AI Studio project showed 65K TPM on 3 Flash Live-class models). Voice is token-hungry — the TPM cap, not RPM/RPD, is the binding constraint.
- Billing is per token (audio in/out separately), not per minute. $0 while inside free tier.
- 429s: honor `RetryInfo.retryDelay` with backoff; never busy-retry a daily-quota exhaustion — show a graceful "voice is resting, try text chat" state.

## 11. Resilience

- Token expiry (30 min) ends the session → `goAway` → fetch a fresh token → new session.
- Mandatory reconnects roughly every ~10 min: use `sessionResumption` handles (`sessionResumptionUpdate.newHandle`); stale handle → close code 1008 → start fresh, optionally replaying the transcript as context.
- Network drop: attempt resume with the handle; if invalid, fresh session.

## 12. Best practices (checklist)

- AudioWorklet for capture, never ScriptProcessorNode.
- 20–40 ms chunks, send immediately; never buffer >100 ms client-side.
- Explicit `echoCancellation` / `noiseSuppression` / `autoGainControl`; verify track settings (Chrome desktop has neural AEC; Safari/Firefox AEC is older — headphones fix most loops).
- Safari: create/resume AudioContext inside the user gesture; play silence to unlock.
- Barge-in: flush the playback queue the moment `interrupted` arrives.
- Never the legacy `media` key; `sendRealtimeInput` for audio/text; `sendClientContent` only for initial history seeding.
- Lock system instructions + model server-side in `liveConnectConstraints`.
- API key only in server env (never `NEXT_PUBLIC_*`); browser holds only the ephemeral token.
- Session caps + idle timeouts; kill switch; per-IP mint quotas.
- Training-data disclosure in the widget UI.
- Keep the persona snapshot refreshed from the profile API on deploy.

## 13. Open questions / test items

- **MIME type:** official docs use `audio/pcm;rate=16000`; one third-party report says a 3.1-preview model silently breaks VAD with the suffix. Test VAD triggering on the exact model shipped; default to the documented suffix.
- **Resume-handle lifetime:** sources conflict (10 min vs 2 hours) — design reconnects for the 10-minute figure.
- **Model choice:** docs example uses `gemini-3.8-live`; his project also lists 3 Flash Live-class models. Make it a config constant; A/B on quality vs TPM burn.
- Max session duration: treat the legacy 10-minute figure as unconfirmed; the token's 30-min `expireTime` is the documented ceiling.

## 14. Reference implementations to study

- `nishkalkashyap/gemini-live-audio-nextjs-template` (MIT) — closest match: Next.js App Router, `/api/live-token` route, AudioWorklet resampler, resumption + transcript-replay fallback.
- `xorora/losono` — embeddable chat/voice widget with ephemeral tokens, origin restrictions.
- `greendesertsnow/gemini-live-with-ephemeral-tokens` — minimal ephemeral-token server example.
- `google-gemini/gemini-skills` → `skills/gemini-live-api-dev/SKILL.md` — canonical current SDK guidance.

## 15. Milestones

- **v0.1:** token route + basic voice session + hero button wiring + widget toggle. Manual QA on Chrome desktop.
- **v0.2:** live captions, barge-in polish, Turnstile + rate limits + session caps, Safari/mobile QA.
- **v0.3:** persona wired to profile API, analytics (sessions/day, avg duration — no audio stored), kill-switch dashboard, disclosure copy.

## 16. Appendix

- Research notes: `~/workspace/research_notes/gemini-live-api-nextjs-voice-widget-20261012-1500/` (report.md + notes/)
- Official docs: `ai.google.dev/gemini-api/docs/ephemeral-tokens`, `ai.google.dev/gemini-api/docs/live`
