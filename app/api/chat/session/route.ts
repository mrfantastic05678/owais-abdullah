import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { chatSessions } from "@/schema/directory";
import { sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not configured" }, { status: 503 });
    }

    const body = await req.json();
    const { sessionId, mode = "text", messages = [], leadInfo } = body;

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json({ success: false, error: "Invalid sessionId" }, { status: 400 });
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json({ success: false, error: "Invalid messages payload" }, { status: 400 });
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const hasLead = Boolean(leadInfo && (leadInfo.email || leadInfo.name));
    const messageCount = messages.length;

    // Upsert session
    await db
      .insert(chatSessions)
      .values({
        id: sessionId,
        mode,
        messages,
        messageCount,
        hasLead,
        leadInfo: leadInfo || null,
        userAgent,
        ip,
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: chatSessions.id,
        set: {
          mode: sql`CASE WHEN ${chatSessions.mode} != ${mode} THEN 'hybrid' ELSE ${mode} END`,
          messages,
          messageCount,
          hasLead: hasLead ? true : sql`${chatSessions.hasLead}`,
          leadInfo: leadInfo ? leadInfo : sql`${chatSessions.leadInfo}`,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({ success: true, sessionId });
  } catch (err: unknown) {
    console.error("[chat/session] Upsert failed:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
