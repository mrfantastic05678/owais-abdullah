import { db } from "@/lib/db";
import { chatSessions } from "@/schema/directory";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest, bodyPassword?: string): boolean {
  const serverPassword =
    process.env.ADMIN_PASSWORD ??
    process.env.ANALYTICS_PASSWORD;

  const cookieToken = req.cookies.get("admin_auth_session")?.value;
  const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
  const urlPassword = req.nextUrl.searchParams.get("token") || "";

  const password = bodyPassword || authHeader || cookieToken || urlPassword;
  return Boolean(password && password === serverPassword);
}

export async function GET(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({
        sessions: [],
        stats: { total: 0, voice: 0, text: 0, hybrid: 0, leads: 0, totalMessages: 0 },
      });
    }

    const sessions = await db
      .select()
      .from(chatSessions)
      .orderBy(desc(chatSessions.updatedAt))
      .limit(100);

    const stats = {
      total: sessions.length,
      voice: sessions.filter((s) => s.mode === "voice").length,
      text: sessions.filter((s) => s.mode === "text").length,
      hybrid: sessions.filter((s) => s.mode === "hybrid").length,
      leads: sessions.filter((s) => s.hasLead).length,
      totalMessages: sessions.reduce((acc, s) => acc + (s.messageCount || 0), 0),
    };

    return NextResponse.json({ sessions, stats });
  } catch (error: unknown) {
    console.error("Admin chats fetch error:", error);
    const message = error instanceof Error ? error.message : "Failed to load chat sessions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id || !db) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await db.delete(chatSessions).where(eq(chatSessions.id, id));

    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    console.error("Admin chats delete error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete chat session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
