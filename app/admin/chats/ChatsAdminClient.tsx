"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Bot,
  Mic,
  MessageSquare,
  Search,
  Trash2,
  RefreshCw,
  ExternalLink,
  Mail,
  User,
  Clock,
  CheckCircle2,
  Radio,
  FileText,
  X,
  Copy,
  Check,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Calendar,
  PhoneCall,
  Sparkles,
  Compass,
} from "lucide-react";
import { getAdminAuthToken } from "@/lib/admin-auth";
import { resolveCountry } from "@/lib/analytics-parser";
import { formatDistanceToNow, format } from "date-fns";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatSessionRecord {
  id: string;
  visitorId?: string | null;
  mode: "text" | "voice" | "hybrid";
  messages: ChatMessage[];
  messageCount: number;
  turnCount?: number;
  hasLead: boolean;
  leadInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
    company?: string;
    budget?: string;
    timeline?: string;
    message?: string;
    source?: string;
  } | null;
  country?: string | null;
  countryCode?: string | null;
  city?: string | null;
  region?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  referrer?: string | null;
  referrerDomain?: string | null;
  path?: string | null;
  startedAt: string;
  updatedAt: string;
  userAgent?: string | null;
  ip?: string | null;
}

interface ChatStats {
  total: number;
  voice: number;
  text: number;
  hybrid: number;
  leads: number;
  totalMessages: number;
}

// Calculate active duration string
function calculateDuration(start: string, end: string): string {
  try {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diffSec = Math.max(0, Math.floor((e - s) / 1000));
    if (diffSec < 60) return `${diffSec}s active`;
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return `${mins}m ${secs}s`;
  } catch {
    return "brief";
  }
}

export default function ChatsAdminClient() {
  const [sessions, setSessions] = useState<ChatSessionRecord[]>([]);
  const [stats, setStats] = useState<ChatStats>({
    total: 0,
    voice: 0,
    text: 0,
    hybrid: 0,
    leads: 0,
    totalMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "voice" | "text" | "hybrid" | "leads">("all");
  const [selectedSession, setSelectedSession] = useState<ChatSessionRecord | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSessions = async (authToken?: string) => {
    const token = authToken || getAdminAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/chats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load chat records");
      }

      const data = await res.json();
      setSessions(data.sessions || []);
      setStats(data.stats || { total: 0, voice: 0, text: 0, hybrid: 0, leads: 0, totalMessages: 0 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error connecting to session store";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this conversation record permanently?")) return;

    const token = getAdminAuthToken();
    try {
      setDeletingId(id);
      const res = await fetch(`/api/admin/chats?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        if (selectedSession?.id === id) {
          setSelectedSession(null);
        }
      }
    } catch {
      alert("Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyTranscript = () => {
    if (!selectedSession) return;
    const text = selectedSession.messages
      .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      // Mode filter
      if (modeFilter === "voice" && s.mode !== "voice") return false;
      if (modeFilter === "text" && s.mode !== "text") return false;
      if (modeFilter === "hybrid" && s.mode !== "hybrid") return false;
      if (modeFilter === "leads" && !s.hasLead) return false;

      // Query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      const inMessages = s.messages.some((m) => m.content.toLowerCase().includes(q));
      const inLead =
        s.leadInfo?.name?.toLowerCase().includes(q) ||
        s.leadInfo?.email?.toLowerCase().includes(q) ||
        s.leadInfo?.phone?.toLowerCase().includes(q) ||
        s.leadInfo?.website?.toLowerCase().includes(q) ||
        s.leadInfo?.message?.toLowerCase().includes(q);
      const inGeo =
        s.country?.toLowerCase().includes(q) ||
        s.city?.toLowerCase().includes(q) ||
        s.ip?.toLowerCase().includes(q);
      const inId = s.id.toLowerCase().includes(q) || s.visitorId?.toLowerCase().includes(q);

      return inMessages || inLead || inGeo || inId;
    });
  }, [sessions, modeFilter, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight font-sans">
              Otto AI Sessions &amp; Intelligence Vault
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Live DB
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete telemetry, multi-session history, geo tracking, and qualified client specs recorded in Neon PostgreSQL.
          </p>
        </div>

        <button
          onClick={() => fetchSessions()}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border flex items-center gap-2 cursor-pointer transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <p className="text-[11px] font-mono text-muted-foreground">Total Sessions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
            <Mic className="w-3.5 h-3.5 text-teal-500" />
            <span>Voice Calls</span>
          </div>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">{stats.voice}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            <span>Text Chats</span>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.text}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
            <Mail className="w-3.5 h-3.5 text-emerald-500" />
            <span>Specs &amp; Leads</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.leads}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-mono text-muted-foreground">Total Exchanges</p>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.totalMessages}</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcripts, client emails, websites, cities, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-card border border-border text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-teal-500 font-sans"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: "all", label: `All (${sessions.length})` },
            { id: "leads", label: `Specs/Leads (${stats.leads})` },
            { id: "voice", label: `Voice (${stats.voice})` },
            { id: "text", label: `Text (${stats.text})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setModeFilter(tab.id as typeof modeFilter)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                modeFilter === tab.id
                  ? "bg-card text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Grid */}
      {loading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-teal-600 dark:text-teal-400" />
          <p className="text-xs text-muted-foreground font-mono">Loading sessions from Neon database...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono">
          {error}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-12 rounded-2xl bg-card border border-border text-center space-y-2">
          <Bot className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">No sessions found</p>
          <p className="text-xs text-muted-foreground">
            {searchQuery
              ? "No chat logs matched your search terms."
              : "When visitors interact via text or voice, conversations will be recorded here automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session) => {
            const firstUserMsg = session.messages.find((m) => m.role === "user");
            const lastMsg = session.messages[session.messages.length - 1];
            const countryMeta = resolveCountry(session.countryCode || "GL");
            const duration = calculateDuration(session.startedAt, session.updatedAt);

            return (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`p-4 rounded-2xl bg-card border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                  session.hasLead
                    ? "border-emerald-500/40 hover:border-emerald-500 shadow-sm shadow-emerald-500/5"
                    : "border-border hover:border-teal-500/50 hover:shadow-md"
                }`}
              >
                <div className="min-w-0 space-y-2 flex-1">
                  {/* Top Metadata Row: Mode, Lead, Location, Time */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Mode Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
                        session.mode === "voice"
                          ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30"
                          : session.mode === "hybrid"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {session.mode === "voice" && <Mic className="w-2.5 h-2.5" />}
                      {session.mode === "text" && <MessageSquare className="w-2.5 h-2.5" />}
                      {session.mode === "hybrid" && <Radio className="w-2.5 h-2.5" />}
                      <span className="capitalize">{session.mode}</span>
                    </span>

                    {/* Has Lead Badge */}
                    {session.hasLead && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Lead / Project Captured</span>
                      </span>
                    )}

                    {/* Location Badge (Flag + Country + City) */}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-foreground/80 bg-muted/60 border border-border flex items-center gap-1">
                      <span>{countryMeta.flag}</span>
                      <span>
                        {session.city ? `${session.city}, ` : ""}
                        {session.country || countryMeta.name}
                      </span>
                    </span>

                    {/* Device & Browser Badge */}
                    {(session.device || session.browser) && (
                      <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                        {session.device === "Mobile" ? (
                          <Smartphone className="w-2.5 h-2.5" />
                        ) : session.device === "Tablet" ? (
                          <Tablet className="w-2.5 h-2.5" />
                        ) : (
                          <Monitor className="w-2.5 h-2.5" />
                        )}
                        <span>
                          {session.browser || "Web"} · {session.os || "OS"}
                        </span>
                      </span>
                    )}

                    {/* Duration & Time */}
                    <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{duration}</span>
                      <span>· {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}</span>
                    </span>
                  </div>

                  {/* Comprehensive Lead Card if present */}
                  {session.leadInfo && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/25 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                        {session.leadInfo.name && (
                          <span className="font-bold text-foreground flex items-center gap-1">
                            <User className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{session.leadInfo.name}</span>
                          </span>
                        )}
                        {session.leadInfo.email && (
                          <a
                            href={`mailto:${session.leadInfo.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{session.leadInfo.email}</span>
                          </a>
                        )}
                        {session.leadInfo.website && (
                          <a
                            href={
                              session.leadInfo.website.startsWith("http")
                                ? session.leadInfo.website
                                : `https://${session.leadInfo.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Globe className="w-3 h-3" />
                            <span>{session.leadInfo.website}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {session.leadInfo.phone && (
                          <a
                            href={`https://wa.me/${session.leadInfo.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>{session.leadInfo.phone}</span>
                          </a>
                        )}
                      </div>
                      {session.leadInfo.message && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 italic font-sans pt-0.5">
                          &ldquo;{session.leadInfo.message}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  {/* Message Preview Snippet */}
                  <p className="text-xs text-foreground/90 line-clamp-2 font-sans">
                    {firstUserMsg ? (
                      <>
                        <span className="font-semibold text-teal-600 dark:text-teal-400">User: </span>
                        <span>{firstUserMsg.content}</span>
                      </>
                    ) : lastMsg ? (
                      <>
                        <span className="font-semibold text-muted-foreground">Turn: </span>
                        <span>{lastMsg.content}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">Session initialized</span>
                    )}
                  </p>

                  {/* Footer Bar: Visitor ID & Referrer */}
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted-foreground/75 pt-0.5">
                    <span>Visitor: {session.visitorId?.slice(0, 14) || session.id.slice(0, 14)}</span>
                    {session.turnCount && session.turnCount > 1 && (
                      <span className="text-teal-600 dark:text-teal-400 font-bold">
                        · {session.turnCount} turns
                      </span>
                    )}
                    {session.referrerDomain && session.referrerDomain !== "Direct" && (
                      <span className="flex items-center gap-1">
                        <Compass className="w-2.5 h-2.5" />
                        <span>Via {session.referrerDomain}</span>
                      </span>
                    )}
                    {session.ip && <span>· IP: {session.ip}</span>}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="px-2.5 py-1 rounded-lg bg-muted text-[11px] font-mono text-muted-foreground">
                    {session.messageCount} msg{session.messageCount === 1 ? "" : "s"}
                  </span>

                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    disabled={deletingId === session.id}
                    title="Delete record"
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Transcript Inspection Modal Drawer */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold capitalize bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                    {selectedSession.mode}
                  </span>
                  <h3 className="font-bold text-sm text-foreground">Conversation Transcript</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground font-mono mt-1">
                  <span>{resolveCountry(selectedSession.countryCode || "GL").flag}</span>
                  <span>
                    {selectedSession.city ? `${selectedSession.city}, ` : ""}
                    {selectedSession.country || "Global"}
                  </span>
                  <span>· IP: {selectedSession.ip}</span>
                  <span>· {selectedSession.messages.length} exchanges</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyTranscript}
                  title="Copy full transcript"
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedIndex === -1 ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Client Spec Details if present */}
            {selectedSession.leadInfo && (
              <div className="p-4 bg-emerald-500/5 border-b border-emerald-500/20 space-y-2">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Client Project Spec &amp; Contact</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-mono">NAME</span>
                    <span className="font-semibold text-foreground">{selectedSession.leadInfo.name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-mono">EMAIL</span>
                    <span className="font-semibold text-foreground font-mono text-[11px]">
                      {selectedSession.leadInfo.email || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] font-mono">WEBSITE / STORE</span>
                    {selectedSession.leadInfo.website ? (
                      <a
                        href={
                          selectedSession.leadInfo.website.startsWith("http")
                            ? selectedSession.leadInfo.website
                            : `https://${selectedSession.leadInfo.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>{selectedSession.leadInfo.website}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                  {selectedSession.leadInfo.phone && (
                    <div>
                      <span className="text-muted-foreground block text-[10px] font-mono">WHATSAPP / PHONE</span>
                      <a
                        href={`https://wa.me/${selectedSession.leadInfo.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] hover:underline"
                      >
                        {selectedSession.leadInfo.phone}
                      </a>
                    </div>
                  )}
                </div>
                {selectedSession.leadInfo.message && (
                  <div className="pt-1">
                    <span className="text-muted-foreground block text-[10px] font-mono mb-0.5">PROJECT REQUIREMENTS</span>
                    <p className="text-xs text-foreground/90 font-mono bg-background/60 p-2.5 rounded-lg border border-border">
                      {selectedSession.leadInfo.message}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Transcript Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-sans">
              {selectedSession.messages.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground italic py-8">
                  No dialogue turns recorded in this session.
                </p>
              ) : (
                selectedSession.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] font-mono text-muted-foreground mb-1 uppercase font-semibold">
                      {msg.role === "user" ? "User" : "Otto AI"}
                    </span>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white rounded-tr-xs"
                          : "bg-muted text-foreground border border-border rounded-tl-xs"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
