import { NextRequest, NextResponse } from "next/server";
import { ContactSchema } from "@/lib/contact-schema";
import { getResend, FROM_ADDRESS, TO_ADDRESS } from "@/lib/email/clients";
import { contactEmailHtml, contactEmailText } from "@/lib/email/contact-template";

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
