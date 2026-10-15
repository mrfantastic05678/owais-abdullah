import { z } from "zod";

// ── Rate Limiter (Sliding Window in-memory) ───────────────────────────────────
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxRequests: number = 20, windowMs: number = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return false; // not limited
  }
  entry.count += 1;
  return entry.count > maxRequests; // true if limited
}

// ── Prompt Injection & Jailbreak Heuristics ──────────────────────────────────
const INJECTION_PATTERNS = [
  /ignore (all )?(previous|prior|above) (instructions|directives|prompts)/i,
  /disregard (all )?(previous|prior|above) (instructions|directives|prompts)/i,
  /reveal (your|the) (system|initial|developer) (prompt|instructions|guidelines)/i,
  /what (is|are) your (system|initial) (prompt|instructions)/i,
  /output (your|the) (system|initial) (prompt|instructions)/i,
  /print (your|the) (system|initial) (prompt|instructions)/i,
  /repeat the (text|words|prompt) above/i,
  /you are now in (developer|dan|jailbreak|unrestricted|sudo) mode/i,
  /act as an? (unrestricted|unfiltered|jailbroken|evil) (ai|model|assistant)/i,
  /bypass (all )?(content|safety) (filters|guardrails|policies)/i,
  /disable (safety|ethical) (guidelines|protocols)/i,
  /<!--LEAD:/i, // Prevent lead marker injection/spoofing from user
];

export function detectPromptInjection(content: string): boolean {
  if (!content || typeof content !== "string") return false;
  return INJECTION_PATTERNS.some((pattern) => pattern.test(content));
}

export function sanitizeUserMessage(content: string): string {
  if (!content || typeof content !== "string") return "";
  // Strip null bytes and malicious fake lead markers
  return content
    .replace(/\0/g, "")
    .replace(/<!--LEAD:[\s\S]*?:LEAD-->/gi, "[filtered]")
    .replace(/<!--LEAD:/gi, "[filtered]")
    .trim();
}

// ── Zod Schemas for Chat & Session ───────────────────────────────────────────
export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .min(1, "Message content cannot be empty.")
    .max(3000, "Message exceeds 3000 characters limit."),
  timestamp: z.string().optional(),
});

export const ChatRequestSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, "Conversation must contain at least one message.")
    .max(40, "Conversation length exceeds limit."),
});

export const ChatLeadSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Invalid email format").max(254).optional().or(z.literal("")),
  phone: z.string().max(40).optional(),
  website: z.string().max(255).optional(),
  company: z.string().max(100).optional(),
  budget: z.string().max(50).optional(),
  timeline: z.string().max(50).optional(),
  message: z.string().max(5000).optional(),
  source: z.string().max(50).optional(),
});

export const ChatSessionUpsertSchema = z.object({
  sessionId: z
    .string()
    .min(3, "Session ID too short.")
    .max(128, "Session ID too long.")
    .regex(/^[\w\-:]+$/, "Session ID contains illegal characters."),
  visitorId: z.string().max(128).optional(),
  mode: z.enum(["text", "voice"]).default("text"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(10000),
        timestamp: z.string().optional(),
      })
    )
    .max(150),
  leadInfo: ChatLeadSchema.optional(),
  path: z.string().max(255).optional(),
});
