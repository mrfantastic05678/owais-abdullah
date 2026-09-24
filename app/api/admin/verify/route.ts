import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getExpectedPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.ANALYTICS_PASSWORD ||
    "owais-vault-2026"
  );
}

// POST: Verify password and issue cookie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const password = (body.password || "").trim();

    const expected = getExpectedPassword();

    if (!password || password !== expected) {
      return NextResponse.json(
        { error: "Invalid admin password. Access denied." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      token: password,
    });

    // Set 30-day session cookie
    res.cookies.set("admin_auth_session", password, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      httpOnly: false, // Client accessible for sync
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to verify admin password" },
      { status: 500 }
    );
  }
}

// GET: Check current session state
export async function GET(req: NextRequest) {
  try {
    const cookieToken = req.cookies.get("admin_auth_session")?.value;
    const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
    const queryToken = req.nextUrl.searchParams.get("token");

    const token = (cookieToken || authHeader || queryToken || "").trim();
    const expected = getExpectedPassword();

    if (!token || token !== expected) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, error: err.message },
      { status: 500 }
    );
  }
}
