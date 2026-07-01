import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getResend, FROM_ADDRESS, TO_ADDRESS } from "@/lib/email/clients";
import { contactEmailHtml, contactEmailText } from "@/lib/email/contact-template";

// ── Zod schema (single source of truth — shared with client via lib/contact-schema.ts) ──
export const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters.")
    .regex(/^[\p{L}\p{M}\s'\-\.]+$/u, "Name contains invalid characters."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters.")
    .max(200, "Subject must be under 200 characters."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be under 5000 characters."),
  // Honeypot — must be empty; bots fill these
  website: z.string().max(0).optional(),
  _trap: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

// ── Rate limiting (in-memory sliding window) ─────────────────────────────────
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 3;   // per IP per window

const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(rawBody);

  if (!parsed.success) {
    // Return the first validation error message
    const firstError = parsed.error.errors[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: firstError }, { status: 422 });
  }

  const { name, email, subject, message, website, _trap } = parsed.data;

  // Honeypot check — silently succeed so bots don't know they were caught
  if (website || _trap) {
    return NextResponse.json({ ok: true });
  }

  const receivedAt = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Karachi",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const { error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    html: contactEmailHtml({ name, email, subject, message, ip, receivedAt }),
    text: contactEmailText({ name, email, subject, message, ip, receivedAt }),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
