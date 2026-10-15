import { NextRequest, NextResponse } from "next/server";
import { verifyAdminResetToken, setStoredAdminPassword } from "@/lib/admin-token";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = (body.token || "").trim();
    const newPassword = (body.newPassword || "").trim();

    if (!token) {
      return NextResponse.json({ error: "Verification token is required." }, { status: 400 });
    }

    const verification = verifyAdminResetToken(token);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.error || "Invalid or expired token." }, { status: 401 });
    }

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json({ error: "Password must be at least 4 characters long." }, { status: 400 });
    }

    // Persist new password
    await setStoredAdminPassword(newPassword);

    const res = NextResponse.json({
      success: true,
      message: "Master administrative password updated successfully.",
      token: newPassword,
    });

    // Set 30-day session cookie for immediate authenticated access
    res.cookies.set("admin_auth_session", newPassword, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (err: any) {
    console.error("Error in /api/admin/reset-password:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update administrative password." },
      { status: 500 }
    );
  }
}
