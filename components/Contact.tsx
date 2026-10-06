"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, CheckCircle2, AlertCircle, Loader2, MapPin, Mail, Phone, Clock, ShieldCheck, Sparkles, Bot } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { ContactSchema } from "@/lib/contact-schema";
import { profile } from "@/data/profile";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [karachiTime, setKarachiTime] = useState<string>("Karachi, PK (UTC+5)");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => {
      try {
        setKarachiTime(`${formatter.format(new Date())} PKT (Karachi)`);
      } catch {
        setKarachiTime("Karachi, PK (UTC+5)");
      }
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const clearFieldError = (field: keyof FieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");

    const form = e.currentTarget;
    const raw = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      website: (form.elements.namedItem("website") as HTMLInputElement)?.value || "",
      _trap: (form.elements.namedItem("_trap") as HTMLInputElement)?.value || "",
    };

    // Client-side Zod validation
    const parsed = ContactSchema.safeParse(raw);
    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.errors) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
        formRef.current?.reset();
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-5 py-16 sm:py-24 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider font-bold text-teal-700 dark:text-teal-400">
            INITIATE ENGAGEMENT
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
            Connect With Me
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mt-1">
            Have a project in mind, need a Digital FTE architecture, or want to discuss engineering contracts? Every build starts with a written spec.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/80 text-xs font-mono font-bold text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ESTIMATED RESPONSE: &lt; 24H</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Panel (5 Cols): Agent Status Contact Card */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-teal-900/60 bg-white dark:bg-[#081B1E] shadow-xl overflow-hidden flex flex-col justify-between h-full">
          
          {/* Terminal Header */}
          <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-slate-50 dark:bg-[#05181b] text-[11px] font-mono tracking-wider">
            <span className="font-bold text-muted-foreground uppercase">contact-channel</span>
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>

          {/* Profile & Status */}
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-teal-500/10 border border-teal-500/20 shadow-xs p-1">
                  <Image
                    src="/assets/bot.png"
                    alt="Owais Abdullah AI Agent"
                    width={56}
                    height={56}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg tracking-tight text-foreground">
                  {profile.name.toUpperCase()}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Founder, Octively — building autonomous AI employees and Next.js SaaS platforms from Karachi, working with founders globally.
                </p>
                <div className="pt-1 text-[11px] font-mono font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{karachiTime}</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("open-chat"))}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/50 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:rotate-12 transition-transform" />
                    <SplitFlapLabel primary="Chat with AI Agent" secondary="Open Spec Chat" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="border-t border-border divide-y divide-border">
            <div className="px-6 py-3.5 flex items-start gap-3.5">
              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground block">
                  ADDRESS
                </span>
                <span className="text-xs font-semibold text-foreground">
                  Karachi, Pakistan
                </span>
              </div>
            </div>

            <div className="px-6 py-3.5 flex items-start gap-3.5">
              <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground block">
                  EMAIL
                </span>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                >
                  {profile.contact.email}
                </a>
              </div>
            </div>

            <div className="px-6 py-3.5 flex items-start gap-3.5">
              <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground block">
                  PHONE / WHATSAPP
                </span>
                <a
                  href="tel:+923262283140"
                  className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline"
                >
                  +92 326 2283140
                </a>
              </div>
            </div>
          </div>

          {/* What I Help With Section */}
          <div className="p-6 border-t border-border space-y-2.5 bg-muted/20">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground block">
              WHAT I HELP WITH
            </span>
            <ul className="space-y-2 text-xs text-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                <span>Digital FTEs (Autonomous 24/7 AI employees)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                <span>Custom AI agents, multi-agent swarms &amp; automations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400" />
                <span>Full-Stack Next.js SaaS platforms &amp; Stripe billing</span>
              </li>
            </ul>
          </div>

          {/* Bottom Footer Bar */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono font-bold text-foreground">Available for Projects</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href={profile.linkedInUrl}
                target="_blank"
                className="text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                title="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </Link>
              <Link
                href={profile.githubUrl}
                target="_blank"
                className="text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                title="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </Link>
              <Link
                href="https://x.com/mrowaisabdullah"
                target="_blank"
                className="text-muted-foreground hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                title="X (Twitter)"
              >
                <FaXTwitter className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* Right Panel (7 Cols): Clean Connect Form */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-teal-900/60 bg-white dark:bg-[#081B1E] p-6 sm:p-8 shadow-xl relative flex flex-col justify-between h-full">
          
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Send a Direct Message
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Have a project in mind, need an AI employee architecture, or want to explore contracts? I respond to all direct inquiries promptly.
            </p>
          </div>

          {/* Success Panel */}
          {status === "success" && (
            <div className="mb-6 p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-3 animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground">Message Delivered!</h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. Your spec inquiry has been logged and I will personally reply within 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-border bg-card hover:bg-muted text-foreground cursor-pointer transition-colors"
              >
                Send Another Message ↺
              </button>
            </div>
          )}

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4" noValidate>
            
            {/* Honeypot traps */}
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="text" name="_trap" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  NAME *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  onChange={() => clearFieldError("name")}
                  placeholder="Alexander Wright"
                  className={`w-full rounded-xl border bg-slate-50/80 dark:bg-[#041316] px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 dark:border-teal-900/60 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />
                {fieldErrors.name && (
                  <span className="text-[10px] font-mono text-red-500 mt-1 block">
                    {fieldErrors.name}
                  </span>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  EMAIL *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  onChange={() => clearFieldError("email")}
                  placeholder="alex@company.com"
                  className={`w-full rounded-xl border bg-slate-50/80 dark:bg-[#041316] px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.email
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 dark:border-teal-900/60 focus:border-teal-500 focus:ring-teal-500/20"
                  }`}
                />
                {fieldErrors.email && (
                  <span className="text-[10px] font-mono text-red-500 mt-1 block">
                    {fieldErrors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                SUBJECT *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                onChange={() => clearFieldError("subject")}
                placeholder="e.g. Digital FTE Architecture for E-commerce Operations"
                className={`w-full rounded-xl border bg-slate-50/80 dark:bg-[#041316] px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.subject
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-teal-900/60 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
              {fieldErrors.subject && (
                <span className="text-[10px] font-mono text-red-500 mt-1 block">
                  {fieldErrors.subject}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="flex-1 flex flex-col">
              <label htmlFor="message" className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                MESSAGE *
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                onChange={() => clearFieldError("message")}
                placeholder="Tell me about your workflows, timeline, and what you're looking to build..."
                className={`w-full flex-1 min-h-[140px] rounded-xl border bg-slate-50/80 dark:bg-[#041316] px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 resize-y transition-all ${
                  fieldErrors.message
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 dark:border-teal-900/60 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
              />
              {fieldErrors.message && (
                <span className="text-[10px] font-mono text-red-500 mt-1 block">
                  {fieldErrors.message}
                </span>
              )}
            </div>

            {/* Submit Button (Emerald-Teal Gradient) */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 group"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting Spec...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <SplitFlapLabel primary="Send Message" secondary="Transmit Spec" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Direct engineer review · No sales spam · NDA on request</span>
              </div>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}
