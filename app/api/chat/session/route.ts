import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chatSessions } from "@/schema/directory";
import { sql } from "drizzle-orm";
import { extractTelemetry } from "@/lib/analytics-parser";
import {
  ChatSessionUpsertSchema,
  checkRateLimit,
} from "@/lib/chat-security";

interface LeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  company?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  source?: string;
}

// Regex heuristics to detect user contact/project details from raw dialogue
function extractProjectSignals(messages: Array<{ role: string; content: string }>): LeadPayload {
  const result: LeadPayload = {};

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|pk|dev|io|org|co|store|app|ai|net)[^\s]*)/i;
  const phoneRegex = /(\+?\d{1,4}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/i;

  for (const m of messages) {
    if (m.role === "user") {
      // Email
      if (!result.email) {
        const emailMatch = m.content.match(emailRegex);
        if (emailMatch) result.email = emailMatch[1].toLowerCase();
      }

      // Website / Store URL
      if (!result.website) {
        const urlMatch = m.content.match(urlRegex);
        if (urlMatch && !urlMatch[1].includes("@")) {
          result.website = urlMatch[1];
        }
      }

      // Phone
      if (!result.phone) {
        const phoneMatch = m.content.match(phoneRegex);
        if (phoneMatch && phoneMatch[1].replace(/\D/g, "").length >= 7) {
          result.phone = phoneMatch[1];
        }
      }

      // Name indicator heuristic
      if (!result.name) {
        const nameMatch = m.content.match(/(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
        if (nameMatch) {
          result.name = nameMatch[1];
        }
      }
    }
  }

  return result;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate Limiting (Max 30 sync calls per IP per minute)
  if (checkRateLimit(`session_${ip}`, 30, 60_000)) {
    return NextResponse.json(
      { success: false, error: "Too many session updates. Rate limited." },
      { status: 429 }
    );
  }

  try {
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
    }

    // Strict Zod Validation
    const parsed = ChatSessionUpsertSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid session payload format";
      return NextResponse.json({ success: false, error: firstError }, { status: 422 });
    }

    const {
      sessionId,
      visitorId,
      mode,
      messages,
      leadInfo: providedLead,
      path = "/",
    } = parsed.data;

    // 1. Extract high-precision telemetry & geolocation
    const telemetry = extractTelemetry(req);
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 2. Intelligent lead synthesis (provided lead + dialogue heuristics)
    const detectedSignals = extractProjectSignals(messages);
    const mergedLead: LeadPayload = {
      ...(providedLead || {}),
      email: providedLead?.email || detectedSignals.email,
      website: providedLead?.website || detectedSignals.website,
      phone: providedLead?.phone || detectedSignals.phone,
      name: providedLead?.name || detectedSignals.name,
      message: providedLead?.message || detectedSignals.message,
    };

    const hasLead = Boolean(mergedLead.email || mergedLead.name || mergedLead.website || mergedLead.phone);
    const messageCount = messages.length;

    // 3. Upsert into Neon PostgreSQL
    await db
      .insert(chatSessions)
      .values({
        id: sessionId,
        visitorId: visitorId || sessionId,
        mode,
        messages,
        messageCount,
        turnCount: 1,
        hasLead,
        leadInfo: hasLead ? mergedLead : null,
        country: telemetry.country || "Global",
        countryCode: telemetry.countryCode || "GL",
        city: telemetry.city || "",
        region: telemetry.region || "",
        device: telemetry.device || "Desktop",
        browser: telemetry.browser || "Chrome",
        os: telemetry.os || "Unknown",
        referrer: telemetry.referrer || "",
        referrerDomain: telemetry.referrerDomain || "Direct",
        path,
        ip,
        userAgent,
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: chatSessions.id,
        set: {
          messages,
          messageCount,
          turnCount: sql`${chatSessions.turnCount} + 1`,
          hasLead: sql`CASE WHEN ${hasLead} THEN true ELSE ${chatSessions.hasLead} END`,
          leadInfo: hasLead ? mergedLead : sql`COALESCE(${chatSessions.leadInfo}, ${hasLead ? JSON.stringify(mergedLead) : "null"}::jsonb)`,
          updatedAt: new Date(),
          path,
          mode,
        },
      });

    return NextResponse.json({
      success: true,
      sessionId,
      hasLead,
      leadInfo: hasLead ? mergedLead : undefined,
    });
  } catch (err: unknown) {
    console.error("[chat/session] Upsert failed:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
