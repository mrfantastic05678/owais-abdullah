"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Code2, Sparkles } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

type VariantType = "A" | "B";

interface SanityImageRef {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface PromoConfig {
  _id?: string;
  title?: string;
  campaignName?: string;
  isActive?: boolean;
  mode?: "ab_test" | "variant_a" | "variant_b";
  scrollTriggerPercent?: number;
  delaySeconds?: number;
  dismissalCooldown?: "session" | "3_hours" | "6_hours" | "12_hours" | "24_hours" | "3_days" | "7_days";
  position?: "bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left" | "top-center" | "middle-right" | "middle-left" | "middle-center";
  variantA?: {
    badgeText?: string;
    headline?: string;
    description?: string;
    featureTags?: string[];
    bannerImage?: SanityImageRef;
    ctaText?: string;
    ctaUrl?: string;
  };
  variantB?: {
    badgeText?: string;
    founderName?: string;
    founderTitle?: string;
    founderAvatar?: SanityImageRef;
    headline?: string;
    note?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

function buildTrackedUrl(
  rawUrl?: string,
  variantKey: VariantType = "A",
  campaignName?: string,
  pathname: string = "/"
): string {
  const fallbackUrl = "https://octively.com";
  const target = rawUrl?.trim() || fallbackUrl;

  try {
    const url = new URL(target.startsWith("http") ? target : `https://${target}`);
    const campaign = campaignName?.trim() || "promo_toast";

    // Inject dynamic UTM tracking parameters
    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", "owaisabdullah.dev");
    }
    if (!url.searchParams.has("utm_medium")) {
      url.searchParams.set("utm_medium", `toast_variant_${variantKey.toLowerCase()}`);
    }
    if (!url.searchParams.has("utm_campaign")) {
      url.searchParams.set("utm_campaign", campaign);
    }
    // utm_content captures the exact page where user clicked (e.g. /blog/..., /services/..., /stack/..., /)
    url.searchParams.set("utm_content", pathname.replace(/^\//, "") || "homepage");
    url.searchParams.set("utm_term", `variant_${variantKey.toLowerCase()}`);

    return url.toString();
  } catch {
    return target;
  }
}

export default function OctivelyPromoToast() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<VariantType>("A");
  const [config, setConfig] = useState<PromoConfig | null>(null);
  const impressionLoggedRef = useRef(false);

  useEffect(() => {
    // Fetch live config from Sanity
    async function initPromo() {
      try {
        const res = await fetch("/api/promo-config");
        if (res.ok) {
          const data = await res.json();
          if (data && data.isActive === false) {
            return;
          }
          setConfig(data);
          setupTrigger(data);
        } else {
          setupTrigger(null);
        }
      } catch {
        setupTrigger(null);
      }
    }

    function setupTrigger(liveConfig: PromoConfig | null) {
      // 1. Check dismissal cooldown (Session or Timed in localStorage)
      const sessionDismissed = sessionStorage.getItem("octively_toast_session_dismissed");
      if (sessionDismissed === "true") {
        return;
      }

      const dismissedUntil = localStorage.getItem("octively_toast_dismissed_until");
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        return;
      }

      // 2. Determine variant based on Sanity mode
      const mode = liveConfig?.mode || "ab_test";
      let assignedVariant: VariantType = "A";

      if (mode === "variant_a") {
        assignedVariant = "A";
      } else if (mode === "variant_b") {
        assignedVariant = "B";
      } else {
        // Smart A/B rotation: if user didn't interact with previous variant, alternate on next page!
        const lastSeen = localStorage.getItem("octively_toast_last_seen") as VariantType | null;
        if (lastSeen === "A") {
          assignedVariant = "B";
        } else if (lastSeen === "B") {
          assignedVariant = "A";
        } else {
          assignedVariant = Math.random() < 0.5 ? "A" : "B";
        }
      }

      setVariant(assignedVariant);

      // 3. Setup Triggers
      const delayMs = (liveConfig?.delaySeconds ?? 6) * 1000;
      const scrollPercentThreshold = (liveConfig?.scrollTriggerPercent ?? 30) / 100;

      let triggered = false;
      const showToast = () => {
        if (triggered) return;
        triggered = true;
        setIsVisible(true);
      };

      const timer = setTimeout(() => {
        showToast();
      }, delayMs);

      const handleScroll = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0 && scrollY / docHeight >= scrollPercentThreshold) {
          showToast();
          window.removeEventListener("scroll", handleScroll);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        clearTimeout(timer);
        window.removeEventListener("scroll", handleScroll);
      };
    }

    initPromo();
  }, []);

  // Log impression when toast becomes visible and mark last seen
  useEffect(() => {
    if (isVisible && !impressionLoggedRef.current) {
      impressionLoggedRef.current = true;
      localStorage.setItem("octively_toast_last_seen", variant);
      try {
        fetch("/api/promo-tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "impression", variant, path: pathname }),
        }).catch(() => {});
      } catch {}
    }
  }, [isVisible, variant, pathname]);

  const handleDismiss = () => {
    setIsVisible(false);
    const cooldown = config?.dismissalCooldown || "24_hours";

    if (cooldown === "session") {
      sessionStorage.setItem("octively_toast_session_dismissed", "true");
    } else {
      const cooldownMap: Record<string, number> = {
        "3_hours": 3 * 60 * 60 * 1000,
        "6_hours": 6 * 60 * 60 * 1000,
        "12_hours": 12 * 60 * 60 * 1000,
        "24_hours": 24 * 60 * 60 * 1000,
        "3_days": 3 * 24 * 60 * 60 * 1000,
        "7_days": 7 * 24 * 60 * 60 * 1000,
      };

      const ms = cooldownMap[cooldown] ?? 24 * 60 * 60 * 1000;
      const nextAvailable = Date.now() + ms;
      localStorage.setItem("octively_toast_dismissed_until", nextAvailable.toString());
    }

    try {
      fetch("/api/promo-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "dismiss", variant, path: pathname }),
      }).catch(() => {});
    } catch {}
  };

  const handleCtaClick = () => {
    try {
      const payload = JSON.stringify({ event: "click", variant, path: pathname });
      if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/promo-tracking", blob);
      } else {
        fetch("/api/promo-tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {}
  };

  const dataA = config?.variantA;
  const dataB = config?.variantB;

  const founderAvatarB = dataB?.founderAvatar
    ? urlFor(dataB.founderAvatar).width(80).height(80).url()
    : "/assets/owais-abdullah.webp";

  const position = config?.position || "bottom-right";
  const positionClasses: Record<string, string> = {
    "bottom-right": "bottom-5 right-5",
    "bottom-left": "bottom-5 left-5",
    "bottom-center": "bottom-5 left-1/2 -translate-x-1/2",
    "top-right": "top-24 right-5",
    "top-left": "top-24 left-5",
    "top-center": "top-24 left-1/2 -translate-x-1/2",
    "middle-right": "top-1/2 -translate-y-1/2 right-5",
    "middle-left": "top-1/2 -translate-y-1/2 left-5",
    "middle-center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };
  const activePositionClass = positionClasses[position] || "bottom-5 right-5";

  // Dynamic tracked target URLs with utm_content set to current pathname
  const trackedUrlA = buildTrackedUrl(dataA?.ctaUrl, "A", config?.campaignName, pathname);
  const trackedUrlB = buildTrackedUrl(dataB?.ctaUrl, "B", config?.campaignName, pathname);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.94, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          style={{ width: "340px", maxWidth: "calc(100vw - 32px)" }}
          className={`fixed z-[6000] font-sans pointer-events-auto ${activePositionClass}`}
          role="complementary"
          aria-label={config?.title || "Promotional Announcement"}
        >
          {/* Eye-Catchy Luxury Dark Teal Card with Glowing Holographic Border */}
          <div className="relative overflow-hidden rounded-2xl border border-teal-400/40 bg-gradient-to-br from-[#062429] via-[#031518] to-[#01090B] text-white shadow-[0_22px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(20,184,166,0.22)] p-4 sm:p-5 backdrop-blur-2xl ring-1 ring-teal-300/20">
            {/* Ambient Background Grid Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "radial-gradient(#2dd4bf 1px, transparent 1px)",
                backgroundSize: "16px 16px"
              }}
            />

            {/* Ambient Corner Flare */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-400/25 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              aria-label="Close promotion"
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-teal-200 hover:text-white flex items-center justify-center transition-all z-20 hover:scale-110 active:scale-95"
            >
              <X size={13} />
            </button>

            {variant === "A" ? (
              /* ================= VARIANT A: VISUAL / LEAD MAGNET TEAL GRADIENT TOAST ================= */
              <div className="relative z-10 flex flex-col gap-2.5">
                {/* Header Tag */}
                <div className="flex items-center gap-1.5 pr-6">
                  <div className="w-5 h-5 rounded-md bg-teal-400/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-400/30">
                    <Code2 size={12} />
                  </div>
                  <span className="text-[10px] font-bold text-teal-300 tracking-wider uppercase font-mono flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                    {dataA?.badgeText || "For Agencies & Devs · Free"}
                  </span>
                </div>

                {/* Hooking Headline */}
                <h4 className="text-[14px] font-extrabold text-white leading-snug font-sans tracking-tight">
                  {dataA?.headline || "Ship Branded AI Chatbots to Clients in 2 Minutes"}
                </h4>

                {/* Minimal Subtext */}
                <p className="text-[11.5px] text-teal-100/80 leading-relaxed font-sans">
                  {dataA?.description ||
                    "1-line embed, white-label client portals, zero maintenance. Monetize AI chatbots for your clients today."}
                </p>

                {/* Highlighted Glowing CTA with Dynamic UTM tracking & Shimmer */}
                <a
                  href={trackedUrlA}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="group relative overflow-hidden mt-1 flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 hover:brightness-110 text-[#021316] font-extrabold text-xs transition-all duration-200 shadow-lg shadow-teal-500/30 active:scale-[0.98]"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <span className="relative z-10">{dataA?.ctaText || "Claim Free AI Chatbot"}</span>
                  <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            ) : (
              /* ================= VARIANT B: PERSONAL NOTE / EDITORIAL PITCH ================= */
              <div className="relative z-10 flex flex-col gap-2.5">
                {/* Founder Header */}
                <div className="flex items-center gap-2.5 pr-6">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-teal-400/70 shadow-[0_0_12px_rgba(20,184,166,0.45)] shrink-0 bg-[#031518]">
                    <Image
                      src={founderAvatarB}
                      alt={dataB?.founderName || "Owais Abdullah"}
                      fill
                      sizes="32px"
                      className="object-cover object-top"
                      unoptimized={founderAvatarB.startsWith("/assets")}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-teal-300 font-bold block leading-none">
                      {dataB?.badgeText || "Founder Note · Free for Agencies"}
                    </span>
                    {dataB?.founderName && (
                      <span className="text-[10px] text-teal-100/70 font-sans block leading-none mt-1">
                        {dataB.founderName} {dataB.founderTitle ? `· ${dataB.founderTitle}` : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hooking Headline */}
                <h4 className="text-[14px] font-extrabold text-white leading-snug font-sans tracking-tight">
                  {dataB?.headline || "Monetize Custom AI Chatbots for Your Web Clients"}
                </h4>

                {/* Editorial Quote Box */}
                <div className="relative pl-3 border-l-2 border-teal-500/40 my-0.5">
                  <p className="text-[11.5px] text-teal-100/90 leading-relaxed italic font-serif">
                    &ldquo;{dataB?.note ||
                      "I built Octively so developers and agency owners can deploy custom trained AI chatbots to clients with zero backend code."}&rdquo;
                  </p>
                </div>

                {/* Highlighted Glowing CTA with Dynamic UTM tracking & Shimmer */}
                <a
                  href={trackedUrlB}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="group relative overflow-hidden mt-1 flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 hover:brightness-110 text-[#021316] font-extrabold text-xs transition-all duration-200 shadow-lg shadow-teal-500/30 active:scale-[0.98]"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                  <span className="relative z-10">{dataB?.ctaText || "Claim Free AI Chatbot"}</span>
                  <ArrowRight size={13} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
