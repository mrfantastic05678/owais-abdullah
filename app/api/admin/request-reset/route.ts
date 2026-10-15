import { NextRequest, NextResponse } from "next/server";
import { generateAdminResetToken, getAdminEmail } from "@/lib/admin-token";
import { getResend, FROM_ADDRESS } from "@/lib/email/clients";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const configuredAdminEmail = getAdminEmail();
    if (!configuredAdminEmail) {
      return NextResponse.json(
        { error: "Administrative email is not configured in server environment." },
        { status: 500 }
      );
    }

    if (email !== configuredAdminEmail) {
      return NextResponse.json(
        { error: "Unauthorized email address. Only the verified owner can request access keys." },
        { status: 403 }
      );
    }

    const token = generateAdminResetToken(email);

    // Compute base URL
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = `${proto}://${host}`;

    const instantLoginUrl = `${baseUrl}/admin/reset?token=${token}&action=login`;
    const resetPasswordUrl = `${baseUrl}/admin/reset?token=${token}`;

    const resend = getResend();
    const emailResult = await resend.emails.send({
      from: FROM_ADDRESS,
      to: configuredAdminEmail,
      subject: "🔐 Admin Vault Access & Password Reset Link — Owais Abdullah",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030F12; color: #E6F7F3; margin: 0; padding: 32px 16px; }
            .card { max-width: 520px; margin: 0 auto; background: #071E22; border: 1px solid rgba(20, 184, 166, 0.25); border-radius: 16px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; background: rgba(20, 184, 166, 0.15); border: 1px solid rgba(20, 184, 166, 0.3); color: #14B8A6; font-size: 11px; font-family: monospace; font-weight: bold; text-transform: uppercase; margin-bottom: 16px; }
            h1 { font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0 0 12px 0; }
            p { font-size: 14px; line-height: 1.6; color: #8FB7AF; margin: 0 0 20px 0; }
            .btn-primary { display: block; text-align: center; background: #0D9488; color: #FFFFFF; text-decoration: none; font-weight: 600; font-size: 14px; padding: 14px 24px; border-radius: 10px; margin-bottom: 12px; }
            .btn-secondary { display: block; text-align: center; background: transparent; border: 1px solid rgba(255, 255, 255, 0.15); color: #E6F7F3; text-decoration: none; font-weight: 500; font-size: 13px; padding: 12px 24px; border-radius: 10px; }
            .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #5C877E; text-align: center; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">Security Verification</div>
            <h1>Admin Vault Access Requested</h1>
            <p>
              A request was made to unlock the Owais Abdullah Admin Suite & Analytics Vault for <strong>${configuredAdminEmail}</strong>.
            </p>
            <p>
              Choose an action below to proceed. These secure links will expire in <strong>30 minutes</strong>.
            </p>
            
            <a href="${instantLoginUrl}" class="btn-primary">
              ⚡ Instant 1-Click Vault Unlock
            </a>

            <a href="${resetPasswordUrl}" class="btn-secondary">
              🔑 Set / Change Master Password
            </a>

            <div class="footer">
              If you did not request this email, you can safely ignore it. Your vault remains fully secured.<br/>
              Request generated at: ${new Date().toUTCString()}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (emailResult.error) {
      console.error("Resend error sending admin reset link:", emailResult.error);
      return NextResponse.json(
        { error: "Could not send verification email. Please check email provider configuration." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A secure access and password reset link has been sent to ${configuredAdminEmail}.`,
    });
  } catch (err: any) {
    console.error("Error in /api/admin/request-reset:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process access request" },
      { status: 500 }
    );
  }
}
