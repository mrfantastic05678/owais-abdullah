"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { setAdminAuthToken } from "@/lib/admin-auth";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get("token") || "";
  const actionParam = searchParams.get("action") || "";

  // State
  const [token, setToken] = useState(tokenParam);
  const [email, setEmail] = useState("mrowaisabdullah@gmail.com");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Automatic 1-Click Login if action=login
  useEffect(() => {
    if (tokenParam && actionParam === "login") {
      performInstantLogin(tokenParam);
    }
  }, [tokenParam, actionParam]);

  const performInstantLogin = async (authToken: string) => {
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("Verifying secure magic link...");

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: authToken }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setAdminAuthToken(data.token || authToken);
        setIsSuccess(true);
        setStatusMessage("Vault unlocked! Redirecting to Mission Control...");
        setTimeout(() => {
          router.push("/admin/overview");
        }, 1200);
      } else {
        setErrorMessage(data.error || "The magic link is invalid or has expired.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  // Request new link
  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const res = await fetch("/api/admin/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatusMessage(`Access link sent! Check ${email.trim()} for your secure 1-click unlock and password reset links.`);
      } else {
        setErrorMessage(data.error || "Could not send link. Please verify your email.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to communicate with authentication service.");
    } finally {
      setLoading(false);
    }
  };

  // Submit new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMessage("Missing security token. Please use the link sent to your email.");
      return;
    }
    if (newPassword.length < 4) {
      setErrorMessage("Password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), newPassword: newPassword.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setAdminAuthToken(newPassword.trim());
        setIsSuccess(true);
        setStatusMessage("Administrative password updated! Redirecting to Mission Control...");
        setTimeout(() => {
          router.push("/admin/overview");
        }, 1500);
      } else {
        setErrorMessage(data.error || "Failed to update password. Your token may have expired.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error while updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-transparent border border-border/60 relative z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl border border-primary/30 text-primary flex items-center justify-center mb-4">
            <Lock size={26} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/30 text-primary text-[11px] font-mono font-bold mb-2">
            <ShieldCheck size={13} />
            SECURITY CREDENTIALS VAULT
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {token ? "Set / Reset Password" : "Email Access Link"}
          </h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {token
              ? "Choose your new master password to secure your Admin Suite and Analytics Vault."
              : "Enter your registered email address to receive an instant 1-click login and password reset link."}
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2"
          >
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}

        {/* Status notification */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
          >
            <CheckCircle2 size={15} className="shrink-0" />
            <span>{statusMessage}</span>
          </motion.div>
        )}

        {/* 1. Mode: Has Token -> Set / Reset Password */}
        {token ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground block">
                New Administrative Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground block">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Saving New Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Save Password & Unlock Vault</span>
                </>
              )}
            </button>

            {/* Direct 1-click alternative */}
            <button
              type="button"
              onClick={() => performInstantLogin(token)}
              disabled={loading || isSuccess}
              className="w-full py-2.5 rounded-xl border border-border/80 hover:border-primary/50 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRight size={14} />
              <span>Direct 1-Click Login (Keep Current Password)</span>
            </button>
          </form>
        ) : (
          /* 2. Mode: No Token -> Request Email Link */
          <form onSubmit={handleRequestLink} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground block">
                Administrative Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Sending Secure Link...</span>
                </>
              ) : (
                <>
                  <Mail size={15} />
                  <span>Send Access & Reset Link</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
          <button
            type="button"
            onClick={() => router.push("/admin/overview")}
            className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            ← Back to Admin Login
          </button>
          <span className="text-[10px] text-muted-foreground/60">
            End-to-End Encrypted Session
          </span>
        </div>
      </motion.div>
    </div>
  );
}
