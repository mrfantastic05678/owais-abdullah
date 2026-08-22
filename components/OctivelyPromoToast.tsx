"use client";

import React, { useEffect, useState, useRef } from "react";
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
    bannerImage?: SanityImageRef;
    ctaText?: string;
    ctaUrl?: string;
  };
  variantB?: {
    badgeText?: string;
    founderName?: string;
    founderTitle?: string;
    founderAvatar?: SanityImageRef;
    note?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

export default function OctivelyPromoToast() {
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
          body: JSON.stringify({ event: "impression", variant }),
        }).catch(() => {});
      } catch {}
    }
  }, [isVisible, variant]);

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
        body: JSON.stringify({ event: "dismiss", variant }),
      }).catch(() => {});
    } catch {}
  };

  const handleCtaClick = () => {
    try {
      fetch("/api/promo-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "click", variant }),
      }).catch(() => {});
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
          aria-label="Octively AI Promo"
        >
          {/* Deep Blue Gradient Card with Glowing Border */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-400/35 bg-gradient-to-br from-[#0F224A] via-[#0A1838] to-[#071128] text-white shadow-[0_20px_50px_rgba(10,24,56,0.7)] p-4.5 p-4 sm:p-5 backdrop-blur-xl">
            {/* Ambient Corner Glow */}
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-blue-600/25 rounded-full blur-2xl pointer-events-none" />

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors z-20"
            >
              <X size={13} />
            </button>

            {variant === "A" ? (
              /* ================= VARIANT A: AGENCY & FREELANCER BLUE GRADIENT TOAST ================= */
              <div className="flex flex-col gap-2.5">
                {/* Header Tag */}
                <div className="flex items-center gap-1.5 pr-6">
                  <div className="w-5 h-5 rounded-md bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                    <Code2 size={12} />
                  </div>
                  <span className="text-[10px] font-semibold text-cyan-300 tracking-wider uppercase font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-500 animate-pulse" />
                    {dataA?.badgeText || "For Agencies & Devs · Free"}
                  </span>
                </div>

                {/* Hooking Headline */}
                <h4 className="text-[13.5px] font-bold text-white leading-snug font-sans">
                  {dataA?.headline || "Ship Branded AI Chatbots to Clients in 2 Minutes"}
                </h4>

                {/* Minimal Subtext */}
                <p className="text-[11.5px] text-blue-100/80 leading-relaxed font-sans">
                  {dataA?.description ||
                    "1-line embed, white-label client portals, zero maintenance. Monetize AI chatbots for your clients today."}
                </p>

                {/* Highlighted Glowing CTA */}
                <a
                  href={`${dataA?.ctaUrl || "https://octively.com"}?utm_source=portfolio_blog&utm_medium=toast_a&utm_campaign=agencies_free`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="group mt-1 flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-cyan-500/25 active:scale-[0.98]"
                >
                  <span>{dataA?.ctaText || "Claim Free AI Chatbot"}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            ) : (
              /* ================= VARIANT B: FOUNDER DIRECT PITCH ================= */
              <div className="flex flex-col gap-2.5">
                {/* Founder Header */}
                <div className="flex items-center gap-2 pr-6">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-cyan-400/50 bg-muted shrink-0">
                    <Image
                      src={founderAvatarB}
                      alt={dataB?.founderName || "Owais Abdullah"}
                      fill
                      sizes="28px"
                      className="object-cover object-top"
                      unoptimized={founderAvatarB.startsWith("/assets")}
                    />
                  </div>
                  <div>
                    <span className="text-[9.5px] font-mono uppercase text-cyan-300 font-semibold block leading-none">
                      Founder Note · Free for Agencies
                    </span>
                  </div>
                </div>

                {/* Hooking Headline */}
                <h4 className="text-[13.5px] font-bold text-white leading-snug font-sans">
                  Monetize Custom AI Chatbots for Your Web Clients
                </h4>

                {/* Minimal Subtext */}
                <p className="text-[11.5px] text-blue-100/80 leading-relaxed font-sans">
                  &ldquo;{dataB?.note ||
                    "I built Octively so developers and agency owners can deploy custom trained AI chatbots to clients with zero backend code."}&rdquo;
                </p>

                {/* Highlighted Glowing CTA */}
                <a
                  href={`${dataB?.ctaUrl || "https://octively.com"}?utm_source=portfolio_blog&utm_medium=toast_b&utm_campaign=agencies_free`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCtaClick}
                  className="group mt-1 flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs transition-all duration-200 shadow-md shadow-cyan-500/25 active:scale-[0.98]"
                >
                  <span>{dataB?.ctaText || "Claim Free AI Chatbot"}</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
