"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Send, MapPin, Mail, Phone } from "lucide-react";
import { FaLinkedin, FaGithubSquare, FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { ContactSchema } from "@/lib/contact-schema";
import CharRevealHeading from "@/components/CharRevealHeading";
import StatusDot from "@/components/ui/StatusDot";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const baseInputClass =
  "w-full bg-card rounded border focus:ring-1 text-base outline-none text-foreground py-2 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]";

function fieldClass(err?: string) {
  return `${baseInputClass} ${err ? "border-red-500 focus:border-red-500 focus:ring-red-500/25" : "border-border focus:border-accent focus:ring-accent/25"}`;
}

const fieldLabelClass = "font-mono text-xs tracking-widest text-muted-foreground";

const HELP_WITH = [
  "Digital FTEs (AI employees)",
  "Custom AI agents & automations",
  "Next.js SaaS products",
];

const SOCIALS = [
  { Icon: FaLinkedin, href: "https://www.linkedin.com/in/mrowaisabdullah/", label: "Connect with me on LinkedIn" },
  { Icon: FaGithubSquare, href: "https://github.com/MrOwaisAbdullah", label: "View my repositories on GitHub" },
  { Icon: FaSquareXTwitter, href: "https://www.twitter.com/MrOwaisAbdullah", label: "Follow me on X (Twitter)" },
  { Icon: FaInstagramSquare, href: "https://www.instagram.com/mrowaisabdullah/", label: "Follow me on Instagram" },
];

const CONTACT_ROWS = [
  { Icon: MapPin, label: "Address", content: <span className="text-foreground text-sm mt-0.5 block">Karachi, Pakistan</span> },
  {
    Icon: Mail,
    label: "Email",
    content: (
      <Link href="mailto:mrowaisabdullah@gmail.com" className="text-accent text-sm mt-0.5 block hover:text-accent-hover transition-colors">
        mrowaisabdullah@gmail.com
      </Link>
    ),
  },
  {
    Icon: Phone,
    label: "Phone",
    content: (
      <Link href="tel:+923262283140" className="text-foreground text-sm mt-0.5 block hover:text-accent transition-colors">
        +92 326 2283140
      </Link>
    ),
  },
];

const Contact = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Brief blue→green checkmark morph on the button itself before the
  // success panel swaps in, so the confirm state is actually seen
  const [justSent, setJustSent] = useState(false);
  // Mounted a frame after justSent so the checkmark's stroke-dashoffset has
  // a "from" state to transition out of, instead of appearing pre-drawn
  const [checkDrawn, setCheckDrawn] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // Local Karachi time — computed client-side to avoid an SSR/client mismatch
  const [karachiTime, setKarachiTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setKarachiTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!justSent) {
      setCheckDrawn(false);
      return;
    }
    const raf = requestAnimationFrame(() => setCheckDrawn(true));
    return () => cancelAnimationFrame(raf);
  }, [justSent]);

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
      website: (form.elements.namedItem("website") as HTMLInputElement).value,
      _trap: (form.elements.namedItem("_trap") as HTMLInputElement).value,
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
        setJustSent(true);
        setTimeout(() => {
          setJustSent(false);
          setStatus("success");
          formRef.current?.reset();
        }, 900);
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto text-muted-foreground body-font relative px-4 py-24"
    >
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left panel — agent-status styled contact card, matches AboutSection */}
        <motion.aside
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          data-cursor="live"
          data-cursor-label="LIVE"
          className="relative md:w-1/2 w-full rounded-xl bg-card border border-border overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
        >
          {/* Token-derived accent glow so the card has presence in light mode too */}
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-40 dark:opacity-25 pointer-events-none"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 40%, transparent) 0%, transparent 70%)" }}
          ></div>

          <header className="relative px-5 py-3 border-b border-border flex justify-between items-center bg-background text-[0.72rem] tracking-[0.08em] text-muted-foreground">
            <span className="font-mono uppercase">contact-channel</span>
            <span className="inline-flex items-center gap-2 text-signal-500 font-mono uppercase font-bold">
              <StatusDot size={6} />
              ONLINE
            </span>
          </header>

          <div className="relative px-5 py-6">
            <h2 className="font-semibold text-foreground text-2xl tracking-wide">OWAIS ABDULLAH</h2>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Founder, Octively — building AI employees from Karachi, working with teams worldwide.
            </p>
            <p className="font-mono text-[0.68rem] tracking-wide text-muted-foreground uppercase mt-4">
              {karachiTime ? `${karachiTime} local time · Karachi, PKT` : "Karachi, PKT"}
            </p>
          </div>

          <div className="relative">
            {CONTACT_ROWS.map(({ Icon, label, content }) => (
              <div key={label} className="flex items-start gap-3 px-5 py-5 border-t border-border/50">
                <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className={fieldLabelClass}>{label.toUpperCase()}</p>
                  {content}
                </div>
              </div>
            ))}
          </div>

          <div className="relative px-5 py-6 border-t border-border/50">
            <p className={`${fieldLabelClass} mb-3`}>WHAT I HELP WITH</p>
            <ul className="space-y-2.5">
              {HELP_WITH.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative px-5 py-4 border-t border-border/50 flex items-center gap-2">
            <StatusDot size={7} />
            <span className="font-mono text-[0.68rem] tracking-wide text-muted-foreground uppercase">
              Available for AI Agent &amp; SaaS projects
            </span>
          </div>

          <div className="relative px-5 py-4 border-t border-border/50 bg-background/40 flex items-center justify-between">
            <span className={fieldLabelClass}>ELSEWHERE</span>
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-accent text-lg transition-colors"
                >
                  <Icon aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* Right panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-1/2 w-full flex flex-col md:ml-auto md:py-8 mt-8 md:mt-0"
        >
          <div className="mb-6">
            <CharRevealHeading
              as="h2"
              className="text-foreground text-2xl font-semibold tracking-wide mb-1"
              highlightWords={["WITH", "ME"]}
            >
              CONNECT WITH ME
            </CharRevealHeading>
            <p className="text-muted-foreground text-sm">
              Have a project in mind or want to discuss opportunities?
            </p>
          </div>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center gap-4 py-16 px-8 bg-card border border-border rounded-xl text-center"
              >
                <CheckCircle className="w-12 h-12 text-signal-500" />
                <div>
                  <p className="text-foreground font-semibold text-lg mb-1">Message sent!</p>
                  <p className="text-muted-foreground text-sm">
                    Thanks for reaching out. I&apos;ll get back to you as soon as possible.
                  </p>
                </div>
                <button
                  onClick={() => { setStatus("idle"); setFieldErrors({}); }}
                  className="text-accent text-sm font-medium hover:underline mt-2"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Honeypot — hidden from real users */}
                <div aria-hidden="true" className="hidden">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  <input type="text" name="_trap" tabIndex={-1} autoComplete="off" />
                </div>

                {/* Name */}
                <div className="relative mb-4">
                  <label htmlFor="name" className={`leading-7 ${fieldLabelClass}`}>
                    NAME
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    minLength={2}
                    maxLength={100}
                    disabled={status === "loading"}
                    onChange={() => clearFieldError("name")}
                    className={fieldClass(fieldErrors.name)}
                  />
                  {fieldErrors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="relative mb-4">
                  <label htmlFor="email" className={`leading-7 ${fieldLabelClass}`}>
                    EMAIL
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    spellCheck={false}
                    required
                    maxLength={254}
                    disabled={status === "loading"}
                    onChange={() => clearFieldError("email")}
                    className={fieldClass(fieldErrors.email)}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="relative mb-4">
                  <label htmlFor="subject" className={`leading-7 ${fieldLabelClass}`}>
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    minLength={2}
                    maxLength={200}
                    disabled={status === "loading"}
                    onChange={() => clearFieldError("subject")}
                    className={fieldClass(fieldErrors.subject)}
                  />
                  {fieldErrors.subject && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {fieldErrors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="relative mb-4">
                  <label htmlFor="message" className={`leading-7 ${fieldLabelClass}`}>
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    disabled={status === "loading"}
                    onChange={() => clearFieldError("message")}
                    className={`${fieldClass(fieldErrors.message)} h-36 resize-none leading-6`}
                  />
                  {fieldErrors.message && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* Server error banner */}
                <AnimatePresence>
                  {status === "error" && serverError && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2 text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      {serverError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: status === "loading" || justSent ? 1 : 1.02 }}
                  whileTap={{ scale: status === "loading" || justSent ? 1 : 0.98 }}
                  type="submit"
                  disabled={status === "loading" || justSent}
                  className={`w-full inline-flex items-center justify-center gap-2 text-accent-foreground border-0 py-4 px-6 focus:outline-none rounded text-sm font-semibold tracking-wide uppercase transition-colors duration-300 disabled:cursor-not-allowed ${
                    justSent
                      ? "bg-signal-500"
                      : "bg-gradient-to-br from-accent-hover to-accent disabled:opacity-60"
                  }`}
                >
                  {justSent ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0">
                        <path
                          d="M5 12.5l4.5 4.5L19 7"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ strokeDasharray: 24, strokeDashoffset: checkDrawn ? 0 : 24, transition: "stroke-dashoffset 0.35s ease 0.1s" }}
                        />
                      </svg>
                      Sent
                    </>
                  ) : status === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  I&apos;ll get back to you as soon as possible.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Contact;
