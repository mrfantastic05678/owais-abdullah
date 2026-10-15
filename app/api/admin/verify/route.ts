import { NextRequest, NextResponse } from "next/server";
import { getActiveAdminPassword, verifyAdminResetToken, getAdminEmail } from "@/lib/admin-token";

export const dynamic = "force-dynamic";

function getExpectedEmail(): string | undefined {
  return getAdminEmail();
}

// POST: Verify credentials OR 1-click reset token, then issue secure admin cookie
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || "").toLowerCase().trim();
    const password = (body.password || "").trim();
    const magicToken = (body.token || "").trim();

    const expectedEmail = getExpectedEmail();
    const expectedPassword = await getActiveAdminPassword();

    // 1. Support 1-Click Magic Link Token
    if (magicToken) {
      const verification = verifyAdminResetToken(magicToken);
      if (verification.valid) {
        const res = NextResponse.json({
          success: true,
          message: "Magic link authentication successful",
          token: expectedPassword,
        });

        res.cookies.set("admin_auth_session", expectedPassword, {
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
          sameSite: "lax",
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
        });

        return res;
      }
      return NextResponse.json(
        { error: verification.error || "Invalid or expired magic link" },
        { status: 401 }
      );
    }

    // 2. Standard Email + Password verification
    if (email && email !== expectedEmail) {
      return NextResponse.json(
        { error: "Unauthorized administrative email. Access denied." },
        { status: 401 }
      );
    }

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid administrative credentials. Access denied." },
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
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to verify admin credentials" },
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
    const expected = await getActiveAdminPassword();

    const isMatch = token && (token === expected || verifyAdminResetToken(token).valid);

    if (!isMatch) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, email: getExpectedEmail() });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, error: err.message },
      { status: 500 }
    );
  }
}
