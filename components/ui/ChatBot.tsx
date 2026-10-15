"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ArrowUp,
  AlertTriangle,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Send,
  Loader2,
  Mail,
  ArrowLeft,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  FileText,
  Volume2,
} from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { useLiveVoice } from "@/hooks/useLiveVoice";
import { VoiceVisualizer } from "@/components/ui/VoiceVisualizer";
import ReactMarkdown from "react-markdown";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

const STARTER_PROMPTS = [
  { label: "Book a Spec Call", prompt: "I would like to discuss a project with Owais. How can we get in touch?" },
  { label: "Digital FTEs (AI Employees)", prompt: "What is a Digital FTE and how does it operate?" },
  { label: "Next.js & Astro Stack", prompt: "What tech stack and architecture do you use?" },
  { label: "Spec-First Process", prompt: "How does the spec-driven development process work?" },
];

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const { messages, input, setInput, handleSubmit, isLoading, clearChat, addMessages, syncSessionToDb } = useChat();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showProactiveNudge, setShowProactiveNudge] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // In-chat Lead Form Drawer state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadWebsite, setLeadWebsite] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [leadError, setLeadError] = useState("");

  // Live Voice Hook
  const {
    status: voiceStatus,
    errorMessage: voiceError,
    isMuted: isVoiceMuted,
    assistantTranscript,
    volumeLevel,
    isUserSpeaking,
    startSession: startVoiceSession,
    stopSession: stopVoiceSession,
    toggleMute: toggleVoiceMute,
  } = useLiveVoice({
    onSessionEnd: (history) => {
      if (history.length > 0) {
        const mapped = history.map((h) => ({
          role: h.role,
          content: h.text,
        }));
        addMessages(mapped);
        syncSessionToDb([...messages, ...mapped], undefined, "voice");
      }
    },
    onOpenLeadDrawer: () => {
      setShowLeadForm(true);
      setMode("text");
    },
  });

  // Switch to Voice Mode
  const handleSwitchToVoice = () => {
    setShowLeadForm(false);
    setMode("voice");
    startVoiceSession();
  };

  // Switch to Text Mode
  const handleSwitchToText = () => {
    stopVoiceSession();
    setMode("text");
  };

  // Proactive scroll-depth and section linger detection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasSeenNudge = sessionStorage.getItem("portfolio_proactive_nudge_shown");
    if (hasSeenNudge || isOpen) return;

    const triggerNudge = () => {
      if (!sessionStorage.getItem("portfolio_proactive_nudge_shown")) {
        setShowProactiveNudge(true);
        sessionStorage.setItem("portfolio_proactive_nudge_shown", "true");
      }
    };

    // Scroll depth trigger (>35% of page)
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && scrollY / docHeight > 0.35) {
        triggerNudge();
        window.removeEventListener("scroll", handleScroll);
      }
    };

    // Time-on-page linger trigger (12 seconds)
    const lingerTimer = setTimeout(() => {
      triggerNudge();
    }, 12000);

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(lingerTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  // Periodic subtle tooltip when closed and no proactive nudge is active
  useEffect(() => {
    if (isOpen || showProactiveNudge) {
      setShowTooltip(false);
      return;
    }

    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const startCycle = () => {
      showTimeout = setTimeout(() => {
        setShowTooltip(true);
        hideTimeout = setTimeout(() => {
          setShowTooltip(false);
          startCycle();
        }, 7000);
      }, 6000);
    };

    startCycle();

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isOpen, showProactiveNudge]);

  // Scroll to bottom when user sends a message or when loading
  useEffect(() => {
    if (isOpen && mode === "text" && messages.length > 1 && messagesEndRef.current && !showLeadForm) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length, isLoading, isOpen, showLeadForm, mode]);

  // Global listeners for "open-chat" and "open-chat-voice" events
  useEffect(() => {
    const openText = () => {
      setIsOpen(true);
      setShowProactiveNudge(false);
      setMode("text");
    };

    const openVoice = () => {
      setIsOpen(true);
      setShowProactiveNudge(false);
      setShowLeadForm(false);
      setMode("voice");
      startVoiceSession();
    };

    window.addEventListener("open-chat", openText);
    window.addEventListener("open-chat-voice", openVoice);

    return () => {
      window.removeEventListener("open-chat", openText);
      window.removeEventListener("open-chat-voice", openVoice);
    };
  }, [startVoiceSession]);

  const toggleChat = () => {
    if (isOpen) {
      if (mode === "voice") {
        stopVoiceSession();
      }
      setIsOpen(false);
    } else {
      setShowProactiveNudge(false);
      setIsOpen(true);
    }
  };

  const handleChipClick = (prompt: string) => {
    if (prompt.includes("discuss a project") || prompt.includes("Book a Spec Call")) {
      setShowLeadForm(true);
      return;
    }
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handleCopy = (text: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Submit Lead directly to our /api/contact pipeline
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim() || !leadMessage.trim()) {
      setLeadError("Please fill out all fields.");
      return;
    }
    setLeadStatus("loading");
    setLeadError("");

    try {
      const formattedMessage = [
        leadMessage.trim(),
        leadWebsite.trim() ? `Website/Store: ${leadWebsite.trim()}` : "",
        leadPhone.trim() ? `WhatsApp/Phone: ${leadPhone.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          email: leadEmail.trim(),
          subject: "Project Inquiry via Chat Widget",
          message: formattedMessage,
        }),
      });

      if (res.ok) {
        setLeadStatus("success");
        syncSessionToDb(
          messages,
          {
            name: leadName.trim(),
            email: leadEmail.trim(),
            website: leadWebsite.trim(),
            phone: leadPhone.trim(),
            message: leadMessage.trim(),
            source: "spec_form",
          },
          mode
        );
        setTimeout(() => {
          setShowLeadForm(false);
          setLeadStatus("idle");
          setLeadName("");
          setLeadEmail("");
          setLeadWebsite("");
          setLeadPhone("");
          setLeadMessage("");
        }, 2200);
      } else {
        const data = await res.json().catch(() => ({}));
        setLeadError(data.error || "Failed to submit. Please try again.");
        setLeadStatus("error");
      }
    } catch {
      setLeadError("Network error. Please try again.");
      setLeadStatus("error");
    }
  };

  return (
    <>
      {/* Floating Trigger FAB */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[5001]">
        <div className="relative">
          {/* Proactive Client Closer Nudge Toast */}
          <AnimatePresence>
            {showProactiveNudge && !isOpen && (
              <motion.div
                className="absolute -top-32 right-0 w-[310px] sm:w-[330px] bg-white dark:bg-[#041619] rounded-2xl p-3.5 shadow-2xl border border-teal-500/40 z-50 text-foreground"
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 400, damping: 20 },
                }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                      <Image
                        src="/assets/bot.png"
                        alt="Otto AI"
                        width={24}
                        height={24}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight">Scope an AI Agent or Web App?</p>
                      <p className="text-[10px] text-muted-foreground font-medium">Otto AI is active</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProactiveNudge(false)}
                    className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-md"
                    aria-label="Dismiss message"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowProactiveNudge(false);
                      setIsOpen(true);
                      setShowLeadForm(true);
                      setMode("text");
                    }}
                    className="flex-1 py-1.5 px-2.5 bg-gradient-to-r from-teal-700 to-emerald-600 hover:opacity-95 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Scope My Project</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProactiveNudge(false);
                      setIsOpen(true);
                      setShowLeadForm(false);
                      setMode("voice");
                      startVoiceSession();
                    }}
                    className="py-1.5 px-2.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Mic className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span>Live Voice</span>
                  </button>
                </div>

                {/* Arrow indicator */}
                <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#041619] border-r border-b border-teal-500/40 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Simple Tooltip (when closed and no proactive nudge) */}
          <AnimatePresence>
            {showTooltip && !isOpen && !showProactiveNudge && (
              <motion.div
                className="absolute -top-12 right-0 bg-white dark:bg-[#071F22] text-slate-800 dark:text-teal-100 text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-xl border border-teal-500/30 flex items-center gap-1.5 pointer-events-none"
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 450, damping: 18 },
                }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Talk with Otto AI (Text &amp; Voice)</span>
                <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white dark:bg-[#071F22] border-r border-b border-teal-500/30 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Launcher FAB */}
          <motion.button
            onClick={toggleChat}
            aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
            className={`flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-2xl shadow-xl transition-all cursor-pointer backdrop-blur-md ${
              isOpen
                ? "bg-white dark:bg-[#041417] text-teal-600 dark:text-teal-400 border border-teal-500/30 dark:border-teal-500/40 hover:bg-slate-50 dark:hover:bg-[#071F22] hover:border-teal-500 shadow-teal-900/10 dark:shadow-teal-950/60"
                : "bg-white dark:bg-[#031518] hover:bg-slate-50 dark:hover:bg-[#061e22] border border-teal-500/30 dark:border-teal-500/50 hover:border-teal-500 shadow-teal-900/10 dark:shadow-teal-950/60 hover:scale-105"
            }`}
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-teal-600 dark:text-teal-400"
                >
                  <X size={22} strokeWidth={2.4} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="relative flex items-center justify-center w-full h-full p-2"
                >
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/assets/bot.png"
                      alt="Otto AI Agent"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(20,184,166,0.25)]"
                      priority
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#031518] animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Main Chat/Voice Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="fixed bottom-[84px] sm:bottom-[90px] right-4 sm:right-6 z-[5000] w-[350px] sm:w-[380px] max-w-[calc(100vw-2rem)] font-sans overscroll-contain"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="h-[450px] sm:h-[470px] max-h-[calc(100vh-8.8rem)] flex flex-col rounded-2xl border border-slate-200 dark:border-teal-900/50 bg-white dark:bg-[#041417] shadow-2xl overflow-hidden font-sans overscroll-contain"
            >
              {/* Hallmark-Crafted Header: Unified segmented control, restrained typography, zero button zoo */}
              <div className="px-3.5 py-2.5 border-b border-slate-200/70 dark:border-teal-900/40 bg-white/95 dark:bg-[#031316]/95 backdrop-blur-sm flex items-center justify-between shrink-0 select-none">
                {/* Brand & Identity */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-teal-500/15 via-teal-500/10 to-emerald-500/20 border border-teal-500/30 p-1 flex items-center justify-center shrink-0">
                    <Image
                      src="/assets/bot.png"
                      alt="Otto AI"
                      width={20}
                      height={20}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-xs text-foreground tracking-tight leading-none font-sans">
                      Otto AI
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[10px] text-muted-foreground font-sans font-medium leading-none">
                        {mode === "voice" ? "Voice Session" : showLeadForm ? "Project Spec" : "Assistant"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unified Navigation & Controls */}
                <div className="flex items-center gap-1.5">
                  {/* Single Unified 3-Mode Segmented Control */}
                  <div className="flex items-center bg-slate-100 dark:bg-[#071F23] rounded-lg p-0.5 border border-slate-200/80 dark:border-teal-900/40">
                    <button
                      onClick={() => {
                        if (mode === "voice") stopVoiceSession();
                        setShowLeadForm(false);
                        setMode("text");
                      }}
                      title="Text Chat"
                      className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer ${
                        mode === "text" && !showLeadForm
                          ? "bg-white dark:bg-[#031518] text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Chat
                    </button>
                    <button
                      onClick={handleSwitchToVoice}
                      title="Live Voice"
                      className={`px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        mode === "voice"
                          ? "bg-teal-600 text-white font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Mic className="w-2.5 h-2.5" />
                      <span>Live</span>
                    </button>
                    <button
                      onClick={() => {
                        if (mode === "voice") stopVoiceSession();
                        setMode("text");
                        setShowLeadForm(true);
                      }}
                      title="Project Spec Intake"
                      className={`px-2 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all cursor-pointer ${
                        showLeadForm
                          ? "bg-teal-600 text-white font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Mail className="w-2.5 h-2.5" />
                      <span>Spec</span>
                    </button>
                  </div>

                  {/* Subtle Hairline Divider */}
                  <div className="w-px h-3.5 bg-slate-200 dark:bg-teal-900/60 mx-0.5" />

                  {/* Actions (Reset & Close) */}
                  <div className="flex items-center gap-0.5">
                    {mode === "text" && !showLeadForm && (
                      <button
                        onClick={clearChat}
                        title="Reset conversation"
                        aria-label="Reset conversation"
                        className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-teal-950/60 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={toggleChat}
                      title="Close"
                      aria-label="Close"
                      className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-teal-950/60 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mode 1: Live Voice UI */}
              {mode === "voice" ? (
                <div className="flex-1 min-h-0 p-4 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 dark:from-[#041619] dark:via-[#031114] dark:to-[#020b0d] flex flex-col justify-between items-center text-center">
                  
                  {/* OpenAI / Google Live Visual Cues Core */}
                  <div className="my-auto flex flex-col items-center justify-center w-full">
                    <VoiceVisualizer
                      status={voiceStatus}
                      volume={volumeLevel}
                      isUserSpeaking={isUserSpeaking}
                    />

                    {/* Live Assistant Caption Subtitle Stream */}
                    {assistantTranscript && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 px-4 py-2 rounded-xl bg-slate-100/90 dark:bg-[#071F23] border border-slate-200/80 dark:border-teal-900/40 max-w-[320px] text-xs font-sans text-foreground leading-relaxed text-center line-clamp-3 shadow-xs"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 inline-block mr-1.5 shrink-0" />
                        <span>{assistantTranscript}</span>
                      </motion.div>
                    )}

                    {voiceError && (
                      <p className="mt-2 text-[11px] text-rose-500 font-mono px-3 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">
                        {voiceError}
                      </p>
                    )}
                  </div>

                  {/* Bottom Voice Controls */}
                  <div className="w-full space-y-3 pt-2">
                    <div className="flex items-center justify-center gap-3">
                      {/* Mute Button */}
                      <button
                        onClick={toggleVoiceMute}
                        disabled={voiceStatus !== "listening" && voiceStatus !== "speaking"}
                        title={isVoiceMuted ? "Unmute microphone" : "Mute microphone"}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all cursor-pointer ${
                          isVoiceMuted
                            ? "bg-rose-500/10 border-rose-500/40 text-rose-500 hover:bg-rose-500/20"
                            : "bg-slate-100 dark:bg-[#071F23] border-slate-200 dark:border-teal-900/50 text-foreground hover:bg-slate-200 dark:hover:bg-teal-900/30"
                        }`}
                      >
                        {isVoiceMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      {/* End Call Button */}
                      <button
                        onClick={handleSwitchToText}
                        title="End Voice Call and return to chat"
                        className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-900/20 cursor-pointer transition-all hover:scale-105"
                      >
                        <PhoneOff className="w-4 h-4" />
                        <span>End Call</span>
                      </button>

                      {/* Open Spec Form */}
                      <button
                        onClick={() => {
                          stopVoiceSession();
                          setMode("text");
                          setShowLeadForm(true);
                        }}
                        title="Switch to Spec Intake Form"
                        className="w-11 h-11 rounded-2xl flex items-center justify-center border bg-slate-100 dark:bg-[#071F23] border-slate-200 dark:border-teal-900/50 text-foreground hover:bg-slate-200 dark:hover:bg-teal-900/30 transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      </button>
                    </div>

                    <p className="text-[10px] font-mono text-muted-foreground/75">
                      Barge-in supported · Interruption flushes output instantaneously
                    </p>
                  </div>
                </div>
              ) : showLeadForm ? (
                /* Mode 2: In-Chat Form View */
                <div
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="flex-1 min-h-0 p-4 bg-slate-50/50 dark:bg-[#041619] flex flex-col justify-between overflow-y-auto overscroll-contain"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Direct Spec Submission</span>
                      </div>
                      <button
                        onClick={() => setShowLeadForm(false)}
                        className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Back to chat
                      </button>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Leave your details and requirements. Your message is routed directly to Owais Abdullah&apos;s verified inbox.
                    </p>

                    <form onSubmit={handleLeadSubmit} className="space-y-2.5 pt-1">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full text-xs rounded-xl border border-slate-200 dark:border-teal-900/60 bg-white dark:bg-[#071F23] px-3 py-2 outline-none focus:border-teal-500 font-sans"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          placeholder="Work Email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="w-full text-xs rounded-xl border border-slate-200 dark:border-teal-900/60 bg-white dark:bg-[#071F23] px-3 py-2 outline-none focus:border-teal-500 font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Website / Store (opt)"
                          value={leadWebsite}
                          onChange={(e) => setLeadWebsite(e.target.value)}
                          className="w-full text-xs rounded-xl border border-slate-200 dark:border-teal-900/60 bg-white dark:bg-[#071F23] px-3 py-2 outline-none focus:border-teal-500 font-sans"
                        />
                        <input
                          type="text"
                          placeholder="Phone / WhatsApp (opt)"
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          className="w-full text-xs rounded-xl border border-slate-200 dark:border-teal-900/60 bg-white dark:bg-[#071F23] px-3 py-2 outline-none focus:border-teal-500 font-sans"
                        />
                      </div>
                      <div>
                        <textarea
                          required
                          rows={3}
                          placeholder="Project spec, timeline, or requirements..."
                          value={leadMessage}
                          onChange={(e) => setLeadMessage(e.target.value)}
                          className="w-full text-xs rounded-xl border border-slate-200 dark:border-teal-900/60 bg-white dark:bg-[#071F23] px-3 py-2 outline-none focus:border-teal-500 resize-none font-sans"
                        />
                      </div>

                      {leadError && (
                        <p className="text-[10px] text-red-500 font-mono">{leadError}</p>
                      )}

                      {leadStatus === "success" && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Message sent! Owais will review and reply shortly.</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={leadStatus === "loading" || leadStatus === "success"}
                        className="group w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:opacity-95 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {leadStatus === "loading" ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : leadStatus === "success" ? (
                          <span>Message Sent!</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            <SplitFlapLabel primary="Send Message" secondary="Submit Spec" />
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowLeadForm(false)}
                        className="w-full py-2 text-center text-xs font-semibold text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer flex items-center justify-center gap-1.5 rounded-xl hover:bg-teal-500/10"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to chat</span>
                      </button>
                    </form>
                  </div>

                  <div className="text-[10px] font-mono text-center text-muted-foreground/75 pt-2 flex items-center justify-center gap-1">
                    <span>Powered by</span>
                    <a
                      href="https://octively.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Octively
                    </a>
                  </div>
                </div>
              ) : (
                /* Mode 3: Standard Text Messages Stream */
                <>
                  <ScrollArea
                    className="flex-1 min-h-0 px-3.5 py-3 font-sans overscroll-contain"
                    ref={scrollAreaRef}
                    data-lenis-prevent="true"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-3.5 font-sans">
                      {messages.map((message, index) =>
                        message.role === "user" ? (
                          <div key={index} className="flex justify-end pt-0.5">
                            <div className="rounded-2xl rounded-br-xs px-3.5 py-2 max-w-[82%] bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white shadow-xs font-sans">
                              <p className="text-xs leading-relaxed whitespace-pre-wrap break-words font-sans">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div key={index} className="space-y-1 text-left group pt-0.5">
                            {message.content.includes("rate limit") && (
                              <div className="mb-1.5 flex items-center gap-1 text-amber-500 font-medium text-xs bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md w-fit">
                                <AlertTriangle className="h-3 w-3" />
                                <span>Rate Limited · Please try again soon</span>
                              </div>
                            )}

                            <div className="text-xs leading-relaxed text-foreground font-sans space-y-1.5 px-1 py-0.5">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => (
                                    <p className="mb-1.5 last:mb-0 leading-relaxed font-sans text-foreground">
                                      {children}
                                    </p>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-bold text-foreground font-sans">
                                      {children}
                                    </strong>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc pl-3.5 mb-1.5 space-y-0.5 font-sans text-foreground">
                                      {children}
                                    </ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal pl-3.5 mb-1.5 space-y-0.5 font-sans text-foreground">
                                      {children}
                                    </ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="leading-relaxed font-sans">{children}</li>
                                  ),
                                  code: ({ children }) => (
                                    <code className="px-1 py-0.5 rounded bg-slate-200/80 dark:bg-[#071F23] font-mono text-[10px] text-teal-700 dark:text-teal-300 border border-slate-300/60 dark:border-teal-900/40">
                                      {children}
                                    </code>
                                  ),
                                  a: ({ href, children }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-teal-600 dark:text-teal-400 underline font-semibold hover:opacity-80 font-sans"
                                    >
                                      {children}
                                    </a>
                                  ),
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>

                            <div className="pl-1 pt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => handleCopy(message.content, index)}
                                className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors cursor-pointer"
                              >
                                {copiedIndex === index ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-500" />
                                    <span className="text-emerald-500 font-bold">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      )}

                      {/* Starter Chips */}
                      {messages.length <= 1 && (
                        <div className="pt-1 space-y-1.5">
                          <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                            <span>Suggested Inquiries</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {STARTER_PROMPTS.map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleChipClick(item.prompt)}
                                className="text-[10px] font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-teal-900/50 bg-slate-100/70 dark:bg-[#061C20] text-slate-700 dark:text-teal-200 hover:border-teal-500/40 hover:bg-teal-500/10 dark:hover:bg-teal-900/30 hover:text-teal-900 dark:hover:text-white transition-all text-left cursor-pointer font-sans"
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Typing Indicator */}
                      {isLoading && (
                        <div className="flex items-center gap-2 pl-2 text-muted-foreground pt-1">
                          <div className="flex space-x-1">
                            <div
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500"
                              style={{ animationDelay: "0ms" }}
                            />
                            <div
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500"
                              style={{ animationDelay: "150ms" }}
                            />
                            <div
                              className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                          <span className="text-[10px] font-mono">
                            Thinking...
                          </span>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Form */}
                  <div className="p-2.5 border-t border-slate-200/80 dark:border-teal-900/40 bg-slate-50/70 dark:bg-[#031114] shrink-0">
                    <form
                      onSubmit={handleSubmit}
                      className="flex items-center gap-1.5 bg-white dark:bg-[#061C20] border border-slate-200 dark:border-teal-900/60 rounded-xl px-2.5 py-1 focus-within:border-teal-500/60 focus-within:ring-1 focus-within:ring-teal-500/20 shadow-2xs transition-all"
                    >
                      <input
                        ref={textareaRef}
                        type="text"
                        placeholder="Ask about AI agents, architecture, or specs..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none py-1 font-sans"
                      />

                      <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-7 h-7 rounded-lg bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-2xs disabled:opacity-30 disabled:hover:bg-teal-600 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                        aria-label="Send message"
                      >
                        <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </form>

                    <div className="text-[10px] font-mono text-center text-muted-foreground/75 pt-1.5 flex items-center justify-center gap-1">
                      <span>Powered by</span>
                      <a
                        href="https://octively.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        Octively
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
