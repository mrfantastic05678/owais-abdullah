import crypto from "crypto";
import { getDb } from "@/lib/db";
import { adminSettings } from "@/schema/directory";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

export function getAdminEmail(): string | undefined {
  const envEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  return envEmail || undefined;
}

function getSigningSecret(): string {
  return (
    process.env.SANITY_REVALIDATE_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.RESEND_API_KEY ||
    "owais-vault-fallback-secret-2026"
  );
}

/**
 * Generates a signed, time-limited reset/login token (valid for 30 minutes).
 */
export function generateAdminResetToken(email?: string): string {
  const targetEmail = (email || getAdminEmail() || "").toLowerCase().trim();
  if (!targetEmail) {
    throw new Error("ADMIN_EMAIL is not configured in environment variables.");
  }

  const expiresAt = Date.now() + 1000 * 60 * 30; // 30 minutes
  const nonce = crypto.randomBytes(8).toString("hex");

  const payload = JSON.stringify({ email: targetEmail, exp: expiresAt, nonce });
  const payloadBase64 = Buffer.from(payload).toString("base64url");

  const secret = getSigningSecret();
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies a reset/login token and returns payload if valid.
 */
export function verifyAdminResetToken(
  token: string
): { valid: boolean; email?: string; error?: string } {
  if (!token || !token.includes(".")) {
    return { valid: false, error: "Malformed authentication token" };
  }

  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) {
    return { valid: false, error: "Invalid token segments" };
  }

  const secret = getSigningSecret();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadBase64)
    .digest("base64url");

  // Constant-time comparison
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return { valid: false, error: "Invalid token signature" };
  }

  try {
    const raw = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(raw);

    if (Date.now() > payload.exp) {
      return { valid: false, error: "Authentication token has expired. Please request a new link." };
    }

    const expectedEmail = getAdminEmail();
    if (expectedEmail && payload.email !== expectedEmail) {
      return { valid: false, error: "Unauthorized email address." };
    }

    return { valid: true, email: payload.email };
  } catch {
    return { valid: false, error: "Failed to decode authentication token" };
  }
}

/**
 * Gets the active admin password, checking Neon DB first, then falling back to process.env.ADMIN_PASSWORD.
 */
export async function getActiveAdminPassword(): Promise<string> {
  try {
    const db = getDb();
    if (db) {
      const records = await db
        .select()
        .from(adminSettings)
        .where(eq(adminSettings.key, "admin_password"))
        .limit(1);

      if (records.length > 0 && records[0].value) {
        return records[0].value.trim();
      }
    }
  } catch (err) {
    console.warn("Could not query admin_settings from database, falling back to env:", err);
  }

  return (process.env.ADMIN_PASSWORD || process.env.ANALYTICS_PASSWORD || "").trim();
}

/**
 * Sets a new administrative password in both Neon DB and .env.local (if local dev).
 */
export async function setStoredAdminPassword(newPassword: string): Promise<boolean> {
  const trimmed = newPassword.trim();
  if (!trimmed || trimmed.length < 4) {
    throw new Error("Password must be at least 4 characters long.");
  }

  // 1. Persist to Neon Postgres
  try {
    const db = getDb();
    if (db) {
      await db
        .insert(adminSettings)
        .values({
          key: "admin_password",
          value: trimmed,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: adminSettings.key,
          set: {
            value: trimmed,
            updatedAt: new Date(),
          },
        });
    }
  } catch (dbErr) {
    console.error("Failed to persist password to database:", dbErr);
  }

  // 2. Update runtime memory
  process.env.ADMIN_PASSWORD = trimmed;

  // 3. Update .env.local if running in local environment
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, "utf-8");
      if (/ADMIN_PASSWORD=/.test(content)) {
        content = content.replace(/ADMIN_PASSWORD=.*(?:\r?\n|$)/, `ADMIN_PASSWORD=${trimmed}\n`);
      } else {
        content += `\nADMIN_PASSWORD=${trimmed}\n`;
      }
      fs.writeFileSync(envPath, content, "utf-8");
    }
  } catch (fsErr) {
    console.warn("Could not write password to .env.local:", fsErr);
  }

  return true;
}
