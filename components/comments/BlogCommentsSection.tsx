"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Reply, User, CheckCircle2, AlertCircle, Shield, CornerDownRight } from "lucide-react";
import SplitFlapLabel from "@/components/ui/SplitFlapLabel";

interface CommentItem {
  id: number;
  authorName: string;
  authorEmail: string;
  authorWebsite?: string | null;
  content: string;
  isAdmin: boolean;
  createdAt: string;
  replies?: CommentItem[];
}

export default function BlogCommentsSection({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch {
      console.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) return;

    setSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postSlug,
          parentId: replyingTo,
          authorName,
          authorEmail,
          authorWebsite,
          content,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNotification({ text: "Thank you! Your comment has been posted." });
        setContent("");
        setReplyingTo(null);
        fetchComments();
      } else {
        setNotification({ text: data.error || "Failed to post comment.", isError: true });
      }
    } catch {
      setNotification({ text: "Network error. Please try again.", isError: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="comments" className="mt-14 pt-10 border-t border-border/80 scroll-mt-28">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sans text-foreground">Discussion & Thoughts</h3>
            <p className="text-xs text-muted-foreground">Join the conversation with your perspective</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-muted text-xs font-mono text-muted-foreground border border-border">
          {totalCount} {totalCount === 1 ? "Comment" : "Comments"}
        </span>
      </div>

      {/* Notification banner */}
      {notification && (
        <div
          className={`p-4 rounded-xl mb-6 text-xs flex items-center gap-2.5 ${
            notification.isError
              ? "bg-destructive/10 border border-destructive/30 text-destructive"
              : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500"
          }`}
        >
          {notification.isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-xl bg-[#031215] dark:bg-[#031215] bg-[#EEF4F2] border border-[#143B42] dark:border-[#143B42] border-slate-300/80 shadow-xs space-y-4 mb-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
            {replyingTo ? "Leave a Reply" : "Leave a Comment"}
          </span>
          {replyingTo && (
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Cancel reply
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Your Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bilal Khan"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#081B1E] dark:bg-[#081B1E] bg-white border border-[#18464E] dark:border-[#18464E] border-slate-300 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Your Email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. bilal@example.com"
              value={authorEmail}
              onChange={(e) => setAuthorEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#081B1E] dark:bg-[#081B1E] bg-white border border-[#18464E] dark:border-[#18464E] border-slate-300 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Website or LinkedIn <span className="text-muted-foreground text-[10px]">(Optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://yourbrand.com or linkedin.com/in/you"
            value={authorWebsite}
            onChange={(e) => setAuthorWebsite(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#081B1E] dark:bg-[#081B1E] bg-white border border-[#18464E] dark:border-[#18464E] border-slate-300 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1">
            Your Comment <span className="text-destructive">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Write your constructive thoughts, critique, or questions here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-lg bg-[#081B1E] dark:bg-[#081B1E] bg-white border border-[#18464E] dark:border-[#18464E] border-slate-300 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent leading-relaxed resize-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="group px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-accent-foreground font-semibold text-xs transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send size={13} className="group-hover:translate-x-0.5 transition-transform" />
            {submitting ? (
              <span>Posting...</span>
            ) : (
              <SplitFlapLabel primary="Post Comment" secondary="Submit Thoughts" />
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-xs text-muted-foreground font-mono">
            Loading discussion...
          </div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-[#143B42] dark:border-[#143B42] border-slate-300 text-xs text-muted-foreground bg-[#031215]/50 dark:bg-[#031215]/50 bg-[#EEF4F2]/50">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-5 rounded-xl bg-[#031215] dark:bg-[#031215] bg-[#EEF4F2] border border-[#143B42] dark:border-[#143B42] border-slate-300/80 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    comment.isAdmin ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                  }`}>
                    {comment.isAdmin ? <Shield size={13} /> : comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">
                        {comment.authorName}
                      </span>
                      {comment.isAdmin && (
                        <span className="px-1.5 py-0.2 rounded bg-accent/20 text-accent text-[10px] font-semibold">
                          Author
                        </span>
                      )}
                      {comment.authorWebsite && (
                        <a
                          href={comment.authorWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-muted-foreground hover:text-accent transition-colors underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-accent transition-colors"
                >
                  <Reply size={12} />
                  <span>Reply</span>
                </button>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed pl-9">
                {comment.content}
              </p>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-6 pt-2 space-y-3 border-l-2 border-accent/30 ml-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="p-3.5 rounded-lg bg-[#05171B] dark:bg-[#05171B] bg-white border border-[#18464E] dark:border-[#18464E] border-slate-300 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CornerDownRight size={12} className="text-accent" />
                          <span className="text-xs font-bold text-foreground">
                            {reply.authorName}
                          </span>
                          {reply.isAdmin && (
                            <span className="px-1.5 py-0.2 rounded bg-accent/20 text-accent text-[10px] font-semibold">
                              Author
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed pl-4">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
