# Gemini Multimodal Live API Protocol Reference

This document details the exact JSON message specifications used when communicating with Google Gemini Live API via bidirectional WebSockets.

Endpoint:
```
wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=AUTH_TOKEN
```

---

## 1. Initial Handshake (`BidiGenerateContentSetup`)

The client sends this immediately upon establishing the WebSocket connection:

```json
{
  "setup": {
    "model": "models/gemini-2.5-flash",
    "generationConfig": {
      "responseModalities": ["AUDIO"],
      "speechConfig": {
        "voiceConfig": {
          "prebuiltVoiceConfig": {
            "voiceName": "Kore"
          }
        }
      }
    },
    "systemInstruction": {
      "parts": [
        {
          "text": "You are a helpful real-time AI assistant. Speak with conversational brevity."
        }
      ]
    },
    "tools": [
      {
        "functionDeclarations": [
          {
            "name": "navigate_to_section",
            "description": "Scroll the screen to a section",
            "parameters": {
              "type": "OBJECT",
              "properties": {
                "sectionId": { "type": "STRING" }
              },
              "required": ["sectionId"]
            }
          }
        ]
      }
    ]
  }
}
```

---

## 2. Real-time Mic Audio Stream (`realtimeInput`)

Sent continuously from the client's AudioWorklet at 16,000 Hz mono 16-bit PCM:

```json
{
  "realtimeInput": {
    "mediaChunks": [
      {
        "mimeType": "audio/pcm;rate=16000",
        "data": "<BASE64_ENCODED_PCM16_CHUNK>"
      }
    ]
  }
}
```

---

## 3. Server Model Audio & Transcripts (`serverContent`)

Received by the client over WebSocket during model speech:

```json
{
  "serverContent": {
    "modelTurn": {
      "parts": [
        {
          "text": "Hello there! How can I help you today?"
        },
        {
          "inlineData": {
            "mimeType": "audio/pcm;rate=24000",
            "data": "<BASE64_ENCODED_24KHZ_PCM16_AUDIO>"
          }
        }
      ]
    },
    "turnComplete": true,
    "interrupted": false
  }
}
```

---

## 4. Barge-in Interruption Signal

When Gemini's server-side VAD detects that the user interrupted the model:

```json
{
  "serverContent": {
    "interrupted": true
  }
}
```
**Action:** Client immediately halts audio playback and flushes queued AudioBufferSourceNodes.

---

## 5. Tool Call & Tool Response

When Gemini triggers a tool:
```json
{
  "toolCall": {
    "functionCalls": [
      {
        "name": "navigate_to_section",
        "id": "call_12345",
        "args": {
          "sectionId": "services"
        }
      }
    ]
  }
}
```

Client responds with:
```json
{
  "toolResponse": {
    "functionResponses": [
      {
        "response": { "output": { "status": "success" } },
        "id": "call_12345"
      }
    ]
  }
}
```
