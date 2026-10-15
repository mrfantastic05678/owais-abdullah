import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chatSessions } from "@/schema/directory";
import { sql } from "drizzle-orm";
import { extractTelemetry } from "@/lib/analytics-parser";

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
        if (phoneMatch && phoneMatch[1].replace(/\D/g, "").length >= 9) {
          result.phone = phoneMatch[1].trim();
        }
      }
    }
  }

  return result;
}

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
    }

    const body = await req.json();
    const {
      sessionId,
      visitorId,
      mode = "text",
      messages = [],
      leadInfo: providedLead,
      path = "/",
    } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ success: false, error: "Invalid sessionId" }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: "Invalid messages payload" }, { status: 400 });
    }

    // 1. Extract high-precision telemetry & geolocation
    const telemetry = extractTelemetry(req);
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
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
          mode: sql`CASE WHEN ${chatSessions.mode} != ${mode} THEN 'hybrid' ELSE ${mode} END`,
          messages,
          messageCount,
          turnCount: sql`${chatSessions.turnCount} + 1`,
          hasLead: hasLead ? true : sql`${chatSessions.hasLead}`,
          leadInfo: hasLead ? mergedLead : sql`${chatSessions.leadInfo}`,
          // Keep highest precision location
          country: telemetry.country ? telemetry.country : sql`${chatSessions.country}`,
          countryCode: telemetry.countryCode ? telemetry.countryCode : sql`${chatSessions.countryCode}`,
          city: telemetry.city ? telemetry.city : sql`${chatSessions.city}`,
          region: telemetry.region ? telemetry.region : sql`${chatSessions.region}`,
          device: telemetry.device ? telemetry.device : sql`${chatSessions.device}`,
          browser: telemetry.browser ? telemetry.browser : sql`${chatSessions.browser}`,
          os: telemetry.os ? telemetry.os : sql`${chatSessions.os}`,
          updatedAt: new Date(),
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
