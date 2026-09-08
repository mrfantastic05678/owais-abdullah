import { NextRequest } from "next/server";

export interface TelemetryData {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  device: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  browser: string;
  os: string;
  referrer: string;
  referrerDomain: string;
  timestamp: string;
}

// Map common ISO 3166-1 alpha-2 country codes to friendly names & flag emojis
export const COUNTRY_NAMES: Record<string, { name: string; flag: string }> = {
  US: { name: "United States", flag: "🇺🇸" },
  PK: { name: "Pakistan", flag: "🇵🇰" },
  GB: { name: "United Kingdom", flag: "🇬🇧" },
  CA: { name: "Canada", flag: "🇨🇦" },
  DE: { name: "Germany", flag: "🇩🇪" },
  IN: { name: "India", flag: "🇮🇳" },
  AU: { name: "Australia", flag: "🇦🇺" },
  FR: { name: "France", flag: "🇫🇷" },
  NL: { name: "Netherlands", flag: "🇳🇱" },
  AE: { name: "United Arab Emirates", flag: "🇦🇪" },
  SA: { name: "Saudi Arabia", flag: "🇸🇦" },
  SG: { name: "Singapore", flag: "🇸🇬" },
  JP: { name: "Japan", flag: "🇯🇵" },
  CN: { name: "China", flag: "🇨🇳" },
  IL: { name: "Israel", flag: "🇮🇱" },
  RU: { name: "Russia", flag: "🇷🇺" },
  BR: { name: "Brazil", flag: "🇧🇷" },
  SE: { name: "Sweden", flag: "🇸🇪" },
  CH: { name: "Switzerland", flag: "🇨🇭" },
  ES: { name: "Spain", flag: "🇪🇸" },
  IT: { name: "Italy", flag: "🇮🇹" },
  PL: { name: "Poland", flag: "🇵🇱" },
  TR: { name: "Turkey", flag: "🇹🇷" },
  NG: { name: "Nigeria", flag: "🇳🇬" },
  BD: { name: "Bangladesh", flag: "🇧🇩" },
  ID: { name: "Indonesia", flag: "🇮🇩" },
  ZA: { name: "South Africa", flag: "🇿🇦" },
  IE: { name: "Ireland", flag: "🇮🇪" },
  AT: { name: "Austria", flag: "🇦🇹" },
  BE: { name: "Belgium", flag: "🇧🇪" },
  NO: { name: "Norway", flag: "🇳🇴" },
  DK: { name: "Denmark", flag: "🇩🇰" },
  FI: { name: "Finland", flag: "🇫🇮" },
  NZ: { name: "New Zealand", flag: "🇳🇿" },
  MY: { name: "Malaysia", flag: "🇲🇾" },
  PH: { name: "Philippines", flag: "🇵🇭" },
  VN: { name: "Vietnam", flag: "🇻🇳" },
  EG: { name: "Egypt", flag: "🇪🇬" },
  KR: { name: "South Korea", flag: "🇰🇷" },
  UA: { name: "Ukraine", flag: "🇺🇦" },
  TW: { name: "Taiwan", flag: "🇹🇼" },
  HK: { name: "Hong Kong", flag: "🇭🇰" },
  TH: { name: "Thailand", flag: "🇹🇭" },
  IR: { name: "Iran", flag: "🇮🇷" },
  IQ: { name: "Iraq", flag: "🇮🇶" },
  CO: { name: "Colombia", flag: "🇨🇴" },
  AR: { name: "Argentina", flag: "🇦🇷" },
  CL: { name: "Chile", flag: "🇨🇱" },
  PE: { name: "Peru", flag: "🇵🇪" },
  SV: { name: "El Salvador", flag: "🇸🇻" },
  QA: { name: "Qatar", flag: "🇶🇦" },
  KW: { name: "Kuwait", flag: "🇰🇼" },
  OM: { name: "Oman", flag: "🇴🇲" },
  BH: { name: "Bahrain", flag: "🇧🇭" },
  MX: { name: "Mexico", flag: "🇲🇽" },
  PT: { name: "Portugal", flag: "🇵🇹" },
  GR: { name: "Greece", flag: "🇬🇷" },
  RO: { name: "Romania", flag: "🇷🇴" },
  CZ: { name: "Czech Republic", flag: "🇨🇿" },
  HU: { name: "Hungary", flag: "🇭🇺" },
  KE: { name: "Kenya", flag: "🇰🇪" },
  GH: { name: "Ghana", flag: "🇬🇭" },
  MA: { name: "Morocco", flag: "🇲🇦" },
  DZ: { name: "Algeria", flag: "🇩🇿" },
  TN: { name: "Tunisia", flag: "🇹🇳" },
  LK: { name: "Sri Lanka", flag: "🇱🇰" },
  NP: { name: "Nepal", flag: "🇳🇵" },
  JO: { name: "Jordan", flag: "🇯🇴" },
  LB: { name: "Lebanon", flag: "🇱🇧" },
  PS: { name: "Palestine", flag: "🇵🇸" },
};

export function resolveCountry(code: string): { name: string; flag: string } {
  if (!code) return { name: "Unknown", flag: "🌐" };
  const upper = code.toUpperCase().trim();

  if (COUNTRY_NAMES[upper]) {
    return COUNTRY_NAMES[upper];
  }

  let name = upper;
  try {
    if (typeof Intl !== "undefined" && (Intl as any).DisplayNames) {
      const dn = new Intl.DisplayNames(["en"], { type: "region" });
      const resolved = dn.of(upper);
      if (resolved && resolved !== upper) {
        name = resolved;
      }
    }
  } catch {}

  let flag = "🌐";
  if (upper.length === 2 && /^[A-Z]{2}$/.test(upper)) {
    try {
      const codePoints = upper
        .split("")
        .map((c) => 127397 + c.charCodeAt(0));
      flag = String.fromCodePoint(...codePoints);
    } catch {}
  }

  return { name, flag };
}

export function parseTelemetry(req: NextRequest, clientPayload?: Record<string, any>): TelemetryData {
  const headers = req.headers;

  // 1. Geolocation from Vercel / Cloudflare headers
  let countryCode = (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    clientPayload?.countryCode ||
    "US"
  ).toUpperCase();

  // If running locally (e.g. 127.0.0.1 or unknown), infer or fallback
  if (countryCode === "UNKNOWN" || !countryCode || countryCode === "XX") {
    countryCode = clientPayload?.countryCode?.toUpperCase() || "US";
  }

  let rawCity =
    headers.get("x-vercel-ip-city") ||
    headers.get("x-city") ||
    clientPayload?.city ||
    "";

  try {
    rawCity = decodeURIComponent(rawCity);
  } catch {}

  const city = rawCity === "UNKNOWN" || !rawCity || rawCity === "Direct Visitor" ? "" : rawCity;
  const region = headers.get("x-vercel-ip-country-region") || clientPayload?.region || "";

  const countryInfo = resolveCountry(countryCode);
  const country = countryInfo.name;

  // 2. User Agent Parsing
  const userAgent = headers.get("user-agent") || clientPayload?.userAgent || "";

  // Device
  let device: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Desktop";
  if (/iPad|tablet|PlayBook|Silk/i.test(userAgent)) {
    device = "Tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(userAgent)) {
    device = "Mobile";
  }

  // Browser
  let browser = "Chrome";
  if (/Edg\//i.test(userAgent)) {
    browser = "Microsoft Edge";
  } else if (/OPR\/|Opera/i.test(userAgent)) {
    browser = "Opera";
  } else if (/Chrome\//i.test(userAgent) && !/Chromium\//i.test(userAgent)) {
    browser = "Google Chrome";
  } else if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent)) {
    browser = "Safari";
  } else if (/Firefox\//i.test(userAgent)) {
    browser = "Firefox";
  } else if (/Brave/i.test(userAgent)) {
    browser = "Brave";
  }

  // Operating System
  let os = "Windows";
  if (/Mac OS X|Macintosh/i.test(userAgent)) {
    os = /iPhone|iPad|iPod/i.test(userAgent) ? "iOS" : "macOS";
  } else if (/Windows NT/i.test(userAgent)) {
    os = "Windows";
  } else if (/Android/i.test(userAgent)) {
    os = "Android";
  } else if (/Linux/i.test(userAgent)) {
    os = "Linux";
  }

  // 3. Referrer Analysis
  const rawReferrer = headers.get("referer") || clientPayload?.referrer || "";
  let referrerDomain = "Direct / Bookmark";

  if (rawReferrer) {
    try {
      const url = new URL(rawReferrer);
      const host = url.hostname.toLowerCase();
      if (host.includes("google.")) {
        referrerDomain = "Google Search";
      } else if (host.includes("twitter.com") || host.includes("x.com") || host.includes("t.co")) {
        referrerDomain = "X (Twitter)";
      } else if (host.includes("linkedin.com") || host.includes("lnkd.in")) {
        referrerDomain = "LinkedIn";
      } else if (host.includes("github.com")) {
        referrerDomain = "GitHub";
      } else if (host.includes("reddit.com")) {
        referrerDomain = "Reddit";
      } else if (host.includes("youtube.com") || host.includes("youtu.be")) {
        referrerDomain = "YouTube";
      } else if (host.includes("facebook.com") || host.includes("instagram.com")) {
        referrerDomain = "Meta / Instagram";
      } else if (host.includes("owaisabdullah.dev") || host.includes("localhost")) {
        referrerDomain = "Internal Navigation";
      } else {
        referrerDomain = host.replace(/^www\./, "");
      }
    } catch {
      referrerDomain = "Direct / Bookmark";
    }
  }

  return {
    country,
    countryCode,
    city,
    region,
    device,
    browser,
    os,
    referrer: rawReferrer,
    referrerDomain,
    timestamp: new Date().toISOString(),
  };
}
