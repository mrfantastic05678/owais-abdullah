---
name: llm-chatbot
description: Creates optimized LLM-powered chatbot implementations following Vercel best practices and Next.js 15 patterns. Choose your provider (OpenAI, Anthropic, Gemini, Groq, OpenRouter) and get a complete working example with streaming API route, performant UI component, and proper error handling.
allowed-tools: Read, Write, Edit, Bash
---

# LLM Chatbot Examples

Production-ready chatbot implementations following **Vercel best practices** and **Next.js 15 patterns**. Each example includes:
- Streaming API route with Edge Runtime
- Optimized React component with proper state management
- Error handling and loading states
- Accessibility and performance considerations

## Choose Your Provider

| Provider | Example File | Models | Streaming |
|----------|-------------|--------|-----------|
| **OpenAI** | `examples/openai.ts` | gpt-5-nano (default), gpt-4o, gpt-4-turbo, o1 | ✅ |
| **Anthropic** | `examples/anthropic.ts` | claude-opus-4.5, claude-sonnet-4.5 | ✅ |
| **Gemini** | `examples/gemini.ts` | gemini-2.5-flash, gemini-2.5-pro | ✅ |
| **Groq** | `examples/groq.ts` | llama-3.3-70b, mixtral-8x7b | ✅ |
| **OpenRouter** | `examples/openrouter.ts` | 100+ models | ✅ |

## Quick Start

### 1. Install Dependencies

```bash
# OpenAI, Groq, OpenRouter (same package)
npm install openai

# Anthropic
npm install @anthropic-ai/sdk

# Gemini
npm install @google/genai

# UI dependencies
npm install framer-motion react-markdown
```

### 2. Set Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=...
GROQ_API_KEY=gsk_...
OPENROUTER_API_KEY=sk-or-...
```

### 3. Copy API Route (Choose Your Provider)

```bash
# For OpenAI
cp .claude/skills/llm-chatbot/examples/openai.ts app/api/chat/route.ts

# For Anthropic
cp .claude/skills/llm-chatbot/examples/anthropic.ts app/api/chat/route.ts

# For Gemini
cp .claude/skills/llm-chatbot/examples/gemini.ts app/api/chat/route.ts

# For Groq
cp .claude/skills/llm-chatbot/examples/groq.ts app/api/chat/route.ts

# For OpenRouter
cp .claude/skills/llm-chatbot/examples/openrouter.ts app/api/chat/route.ts
```

### 4. Copy UI Component

```bash
cp .claude/skills/llm-chatbot/examples/Chatbot.tsx components/Chatbot.tsx
```

### 5. Use in Your App

```tsx
import { Chatbot } from '@/components/Chatbot';

export default function Page() {
  return <Chatbot />;
}
```

## Optimization Patterns Applied

### Vercel Best Practices
- `bundle-dynamic-imports` - Heavy imports inside event handlers
- `rerender-use-ref-transient-values` - Refs for frequently updated values
- `rerender-functional-setstate` - Functional updates for stable state
- `rerender-move-effect-to-event` - Interaction logic in event handlers
- `rendering-conditional-render` - Ternary operators, not `&&`
- `js-early-exit` - Early returns in error handling

### Next.js 15 Patterns
- Edge Runtime for streaming API routes
- `maxDuration` for long-running requests
- Proper SSE headers for streaming
- Client component boundaries

### Web Design Guidelines
- Accessible button labels
- Proper focus management
- Loading state feedback
- Error recovery options
- Responsive design

## Example: OpenAI Streaming API Route

```typescript
// app/api/chat/route.ts
import OpenAI from 'openai';

const openai = new OpenAI();

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-5-nano' } = await req.json();

    const stream = await openai.chat.completions.create({
      model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          try {
            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content;

              if (content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                );
              }

              if (chunk.choices[0]?.finish_reason) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
                );
                controller.close();
                break;
              }
            }
          } catch (error) {
            controller.error(error);
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## Example: Optimized Chatbot Component

Key optimizations:
- Refs for transient state (typing indicator, abort controller)
- Functional setState for stable updates
- Early exits for error cases
- Dynamic imports for heavy libraries
- Proper cleanup in useEffect

```tsx
"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Chatbot() {
  // Use refs for transient values that change frequently
  const abortControllerRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  // Use functional setState for stable updates
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (input: string) => {
    if (!input.trim() || isLoading) return;

    // Early exit for empty input
    const trimmed = input.trim();
    if (trimmed.length === 0) return;

    // Cancel any existing request
    abortControllerRef.current?.abort();

    // Create new abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Functional update for stable state
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: trimmed }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      readerRef.current = reader;

      // Stream handling...
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // User cancelled
      }
      // Error handling...
    } finally {
      setIsLoading(false);
      readerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      readerRef.current?.cancel();
    };
  }, []);

  return (
    // JSX with ternary operators for conditional rendering
    isLoading ? (
      <LoadingSpinner />
    ) : error ? (
      <ErrorMessage error={error} onRetry={handleRetry} />
    ) : (
      <ChatMessages messages={messages} />
    )
  );
}
```

## SSE Response Format

All providers emit the same format for consistent client handling:

```
data: {"content": "Hello"}
data: {"content": " world"}
data: {"done": true}
```

## Error Handling Best Practices

1. **Abort on component unmount** - Cancel pending requests
2. **Abort on new submit** - Cancel previous request when user submits again
3. **Retry mechanism** - Allow user to retry failed requests
4. **Graceful degradation** - Show helpful error messages

## Performance Checklist

- [ ] Using Edge Runtime for API routes
- [ ] Abort controller for request cancellation
- [ ] Refs for transient state (typing, abort)
- [ ] Functional setState for derived updates
- [ ] Dynamic imports for heavy components
- [ ] Early exits in error paths
- [ ] Cleanup in useEffect returns
- [ ] Ternary operators for conditional rendering

## Accessibility Checklist

- [ ] Focus management on open/close
- [ ] Keyboard navigation support
- [ ] ARIA labels for icon buttons
- [ ] Loading announcements for screen readers
- [ ] Error messages with actionable options

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `API key not found` | Missing `.env.local` | Check environment file |
| `Streaming not working` | Wrong headers | Ensure `text/event-stream` |
| `Memory leak` | No cleanup | Add abort controller cleanup |
| `Stale responses` | Multiple requests | Cancel previous requests |

## References

- Vercel React Best Practices - See `../vercel-react-best-practices/SKILL.md`
- Web Design Guidelines - See `../web-design-guidelines/SKILL.md`
- Next.js 15 Docs - https://nextjs.org/docs
