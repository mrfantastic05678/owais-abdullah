"use client";
import Image from "next/image";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Loader2, Send } from "lucide-react";
import { ContactSchema } from "@/lib/contact-schema";

type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const baseInputClass =
  "w-full bg-card rounded border focus:ring-1 text-base outline-none text-foreground py-2 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]";

function fieldClass(err?: string) {
  return `${baseInputClass} ${err ? "border-red-500 focus:border-red-500" : "border-border focus:border-accent"}`;
}

const Contact = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

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
        setStatus("success");
        formRef.current?.reset();
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto text-muted-foreground body-font relative px-4 py-24"
    >
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:w-1/2 w-full rounded-lg overflow-hidden p-5 bg-card shadow-xl"
        >
          <Image
            src="/assets/contact.png"
            alt="contact"
            className="rounded-md mb-5 object-cover w-full h-52 md:h-64"
            width={600}
            height={400}
            unoptimized
          />
          <h2 className="font-semibold text-foreground text-2xl sm:text-3xl tracking-wide">
            OWAIS ABDULLAH
          </h2>
          <div className="mt-4 space-y-2">
            <div>
              <p className="font-semibold text-foreground text-xs">ADDRESS</p>
              <p className="mt-1 text-foreground">Karachi, Pakistan</p>
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs">EMAIL</p>
              <Link href="mailto:mrowaisabdullah@gmail.com" className="text-accent leading-relaxed">
                mrowaisabdullah@gmail.com
              </Link>
            </div>
            <div>
              <p className="font-semibold text-foreground text-xs">PHONE</p>
              <Link href="tel:+923262283140" className="leading-relaxed text-foreground">
                +92 326 2283140
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-1/2 w-full flex flex-col md:ml-auto md:py-8 mt-8 md:mt-0"
        >
          <div className="mb-6">
            <h2 className="text-foreground text-2xl font-semibold tracking-wide mb-1">
              CONNECT WITH ME
            </h2>
            <p className="text-muted-foreground text-sm">
              Have a project in mind or want to discuss opportunities? Send me a
              message and I&apos;ll get back to you shortly.
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
                <CheckCircle className="w-12 h-12 text-green-500" />
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
                  <label htmlFor="name" className="leading-7 text-sm text-muted-foreground">
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
                  <label htmlFor="email" className="leading-7 text-sm text-muted-foreground">
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
                  <label htmlFor="subject" className="leading-7 text-sm text-muted-foreground">
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
                  <label htmlFor="message" className="leading-7 text-sm text-muted-foreground">
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
                  whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
                  whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 text-white bg-gradient-to-br from-blue-600 via-accent to-blue-500 border-0 py-4 px-6 focus:outline-none rounded text-sm font-semibold tracking-wide uppercase transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
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
