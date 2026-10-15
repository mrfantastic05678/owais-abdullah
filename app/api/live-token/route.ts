import { NextRequest } from "next/server";

// In-memory rate limiting map (IP -> timestamps array)
const mintRateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_MINTS_PER_WINDOW = 6; // Max 6 voice sessions per 10 mins per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = mintRateLimitMap.get(ip) || [];

  // Filter out expired timestamps
  const activeTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (activeTimestamps.length >= MAX_MINTS_PER_WINDOW) {
    mintRateLimitMap.set(ip, activeTimestamps);
    return true;
  }

  activeTimestamps.push(now);
  mintRateLimitMap.set(ip, activeTimestamps);

  // Periodically clean up old keys if map exceeds 500 entries
  if (mintRateLimitMap.size > 500) {
    for (const [key, times] of mintRateLimitMap.entries()) {
      const valid = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) mintRateLimitMap.delete(key);
      else mintRateLimitMap.set(key, valid);
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Kill-switch check
    if (process.env.LIVE_VOICE_ENABLED === "false") {
      return new Response(
        JSON.stringify({ error: "Live voice assistant is temporarily paused. Please use text chat." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is not configured on the server." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. IP extraction & Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown-client";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({
          error: "Voice session rate limit reached. Please wait a few minutes before starting a new voice call or continue via text chat.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Mint short-lived ephemeral token from Google
    // Window: 2 minutes to establish connection; session ceiling: 30 minutes
    const now = Date.now();
    const expireTime = new Date(now + 30 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(now + 2 * 60 * 1000).toISOString();

    const tokenResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/auth_tokens", {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uses: 1,
        expireTime,
        newSessionExpireTime,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[live-token] Google auth_tokens mint error:", tokenResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to mint voice session token from Google." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await tokenResponse.json();
    const tokenName = data.name; // Format: "auth_tokens/xxxx..."

    if (!tokenName) {
      return new Response(
        JSON.stringify({ error: "Invalid token response format." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        token: tokenName,
        model: "models/gemini-3.8-live",
        voice: "Kore",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[live-token] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error minting voice token." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
