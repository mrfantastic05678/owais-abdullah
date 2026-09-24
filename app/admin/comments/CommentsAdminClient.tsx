"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
  Trash2,
  Reply,
  Shield,
  RefreshCw,
  CornerDownRight,
  ExternalLink,
  AlertCircle,
  User,
  Mail,
  Send,
  Lock,
  Unlock,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { getAdminAuthToken, setAdminAuthToken, clearAdminAuthToken } from "@/lib/admin-auth";

interface Comment {
  id: number;
  postSlug: string;
  parentId?: number | null;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string | null;
  content: string;
  isAdmin: boolean;
  status: "approved" | "pending" | "hidden" | "rejected";
  createdAt: string;
}

export default function CommentsAdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, hidden: 0 });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [actionBusy, setActionBusy] = useState<number | null>(null);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const savedPassword = getAdminAuthToken();
    if (savedPassword) {
      fetchComments(savedPassword);
    }
    const handleAuthChange = () => {
      const p = getAdminAuthToken();
      if (p) {
        fetchComments(p);
      } else {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener("admin_auth_change", handleAuthChange);
    return () => window.removeEventListener("admin_auth_change", handleAuthChange);
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchComments = async (pass: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`/api/admin/comments?token=${encodeURIComponent(pass)}`, {
        headers: { Authorization: `Bearer ${pass}` },
      });

      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setStats(data.stats || { total: 0, pending: 0, approved: 0, hidden: 0 });
        setIsAuthenticated(true);
        setAdminAuthToken(pass);
      } else {
        const err = await res.json();
        setAuthError(err.error || "Incorrect password. Access denied.");
        clearAdminAuthToken();
        setIsAuthenticated(false);
      }
    } catch {
      setAuthError("Failed to connect to comments server.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    fetchComments(passwordInput.trim());
  };

  const runAction = async (payload: any) => {
    const pass = sessionStorage.getItem("analytics_auth_token");
    if (!pass) return;

    setActionBusy(payload.commentId || payload.parentId);
    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        fetchComments(pass);
        setReplyingToId(null);
        setReplyText("");
        setEditingId(null);
        setEditText("");
      } else {
        showToast(data.error || "Action failed", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setActionBusy(null);
    }
  };

  const filteredComments = comments.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesSearch =
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.postSlug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
        <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-2xl">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-5 shadow-sm">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-extrabold text-center text-foreground">Blog Comments Moderation</h1>
          <p className="text-xs text-muted-foreground text-center mt-1.5 mb-6">
            Review discussions, approve or hide comments, and reply to readers.
          </p>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <KeyRound size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
              >
                <Eye size={16} />
              </button>
            </div>
            {authError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={15} className="animate-spin" /> : <Unlock size={15} />}
              <span>Unlock Comments</span>
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm flex items-center gap-2.5 backdrop-blur-md ${
            toast.type === "success"
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
              : "bg-destructive/90 text-destructive-foreground border-destructive"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Blog Comments Moderation</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage community discussions, reply to inquiries, and filter spam</p>
        </div>
        <button
          onClick={() => {
            const pass = sessionStorage.getItem("analytics_auth_token");
            if (pass) fetchComments(pass);
          }}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-medium self-start"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-primary" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="text-[11px] font-mono text-muted-foreground uppercase">Total Comments</div>
          <div className="text-2xl font-extrabold text-foreground mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="text-[11px] font-mono text-muted-foreground uppercase">Approved & Visible</div>
          <div className="text-2xl font-extrabold text-emerald-500 mt-1">{stats.approved}</div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="text-[11px] font-mono text-muted-foreground uppercase">Pending Review</div>
          <div className="text-2xl font-extrabold text-amber-500 mt-1">{stats.pending}</div>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border shadow-xs">
          <div className="text-[11px] font-mono text-muted-foreground uppercase">Hidden</div>
          <div className="text-2xl font-extrabold text-muted-foreground mt-1">{stats.hidden}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-3.5 rounded-2xl bg-card border border-border flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search author, email, post slug, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "approved", "pending", "hidden"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3.5">
        {filteredComments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
            No comments found matching your filters.
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isBusy = actionBusy === comment.id;

            return (
              <div key={comment.id} className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      comment.isAdmin ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      {comment.isAdmin ? <Shield size={13} /> : comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground">{comment.authorName}</span>
                        {comment.isAdmin && (
                          <span className="px-1.5 py-0.2 rounded bg-primary/20 text-primary text-[10px] font-semibold">
                            Admin / Author
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground">({comment.authorEmail})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Link
                      href={`/blog/${comment.postSlug}`}
                      target="_blank"
                      className="text-primary hover:underline flex items-center gap-1 text-[11px] font-mono"
                    >
                      <span>/{comment.postSlug}</span>
                      <ExternalLink size={10} />
                    </Link>
                    <span className="text-muted-foreground text-[10px] font-mono">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        comment.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                          : comment.status === "hidden"
                          ? "bg-muted text-muted-foreground border border-border"
                          : "bg-amber-500/15 text-amber-500 border border-amber-500/30"
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>
                </div>

                {/* Content / Edit mode */}
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs rounded-lg bg-muted text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => runAction({ action: "edit-content", commentId: comment.id, content: editText })}
                        className="px-3 py-1 text-xs rounded-lg bg-primary text-primary-foreground font-semibold"
                      >
                        Save Edits
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-foreground/90 leading-relaxed pl-9">{comment.content}</p>
                )}

                {/* Reply Drawer */}
                {replyingToId === comment.id && (
                  <div className="pl-9 pt-2 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                      <CornerDownRight size={13} />
                      <span>Replying as Owais Abdullah (Author)</span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Type your official reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="px-3 py-1 text-xs rounded-lg bg-muted text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          runAction({
                            action: "admin-reply",
                            parentId: comment.id,
                            postSlug: comment.postSlug,
                            replyContent: replyText,
                          })
                        }
                        className="px-3 py-1 text-xs rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-1"
                      >
                        <Send size={11} />
                        <span>Publish Reply</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Toolbar */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                  <button
                    onClick={() => {
                      setReplyingToId(replyingToId === comment.id ? null : comment.id);
                      setReplyText("");
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
                  >
                    <Reply size={12} />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditText(comment.content);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Edit
                  </button>

                  {comment.status === "hidden" ? (
                    <button
                      onClick={() => runAction({ action: "update-status", commentId: comment.id, status: "approved" })}
                      disabled={isBusy}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors flex items-center gap-1"
                    >
                      <Eye size={12} />
                      <span>Unhide</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => runAction({ action: "update-status", commentId: comment.id, status: "hidden" })}
                      disabled={isBusy}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                    >
                      <EyeOff size={12} />
                      <span>Hide</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm("Permanently delete this comment?")) {
                        runAction({ action: "delete", commentId: comment.id });
                      }
                    }}
                    disabled={isBusy}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
