"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu,
  Lock,
  ArrowUpRight,
  ExternalLink,
  Bot,
  Mail,
} from "lucide-react";

import {
  getAdminAuthToken,
  setAdminAuthToken,
  clearAdminAuthToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { motion } from "framer-motion";
import {
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Unlock,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardShell({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Login Gate State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [resetSent, setResetSent] = useState("");

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = getAdminAuthToken();
      setIsLoggedIn(Boolean(token));
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("admin_auth_change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("admin_auth_change", checkAuth);
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setLoginLoading(true);
    setLoginError("");
    setResetSent("");

    const result = await verifyAdminPassword(passwordInput.trim(), emailInput.trim() || undefined);
    if (result.success) {
      setAdminAuthToken(passwordInput.trim());
      setIsLoggedIn(true);
      setPasswordInput("");
    } else {
      setLoginError(result.error || "Invalid administrative credentials. Access denied.");
    }
    setLoginLoading(false);
  };

  const handleSendResetLink = async () => {
    if (!emailInput.trim()) {
      setLoginError("Please enter your administrative email in the field above to receive a link.");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    setResetSent("");
    try {
      const res = await fetch("/api/admin/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setResetSent(data.message || "A secure access and password reset link has been sent to your email.");
      } else {
        setLoginError(data.error || "Failed to send reset link.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to communicate with auth server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminAuthToken();
    setIsLoggedIn(false);
  };

  // 1. Initial mounting skeleton to prevent content flash
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={24} className="animate-spin text-primary" />
          <span className="text-xs font-mono text-muted-foreground">Verifying administrative security...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Render Centralized Superadmin Login Gate
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen text-foreground flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-transparent border border-border/60 relative z-10"
        >
          {/* Lock Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl border border-primary/30 text-primary flex items-center justify-center mb-4">
              <Lock size={26} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/30 text-primary text-[11px] font-mono font-bold mb-2">
              <ShieldCheck size={13} />
              SUPERADMIN ACCESS GATE
            </div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              Owais Abdullah Admin Suite
            </h1>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Enter your administrative master key to access Mission Control, Stores & Claims, Analytics Vault, Comments, and Cache controls.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                  placeholder="admin@domain.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-muted-foreground block">
                Administrative Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <KeyRound size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter administrative password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-transparent border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleSendResetLink}
                  disabled={loginLoading}
                  className="text-[11px] font-mono text-primary/90 hover:text-primary hover:underline transition-colors cursor-pointer"
                >
                  Forgot or need to reset password?
                </button>
                <Link
                  href="/admin/reset"
                  className="text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset options →
                </Link>
              </div>
            </div>

            {resetSent && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
              >
                <ShieldCheck size={15} className="shrink-0" />
                <span>{resetSent}</span>
              </motion.div>
            )}

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2"
              >
                <AlertCircle size={15} className="shrink-0" />
                <span>{loginError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock size={15} />
                  <span>Unlock Admin Suite</span>
                </>
              )}
            </button>
          </form>

          {/* Security Information Footer */}
          <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Single Sign-On Active
            </span>
            <span className="text-[10px] text-muted-foreground/60">Secured Access</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Mission Control",
      href: "/admin/overview",
      icon: LayoutDashboard,
      badge: "Overview",
    },
    {
      label: "Stores & Claims",
      href: "/admin/stores",
      icon: ShoppingBag,
      badge: "Directory",
    },
    {
      label: "Analytics Vault",
      href: "/admin/insights",
      icon: TrendingUp,
      badge: "Live",
    },
    {
      label: "Blog Comments",
      href: "/admin/comments",
      icon: MessageSquare,
      badge: "Community",
    },
    {
      label: "Otto AI Sessions",
      href: "/admin/chats",
      icon: Bot,
      badge: "Agent",
    },
    {
      label: "Cache & Webhooks",
      href: "/admin/cache",
      icon: Zap,
      badge: "Purge",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2.5 font-bold text-sm text-foreground">
          <Image
            src="/assets/logo-192.png"
            alt="Owais Abdullah"
            width={24}
            height={24}
            className="w-6 h-6 rounded-md object-contain"
          />
          <span>Admin Suite</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-muted text-foreground"
          aria-label="Toggle navigation"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block md:sticky top-0 h-auto md:h-screen shrink-0 border-r border-border bg-card flex flex-col justify-between transition-all duration-300 z-40 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Brand Header */}
          <div>
            {!collapsed ? (
              <div className="flex items-center justify-between gap-2">
                <Link href="/admin/overview" className="flex items-center gap-2.5 min-w-0 group">
                  <div className="relative shrink-0">
                    <Image
                      src="/assets/logo-192.png"
                      alt="Owais Abdullah"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="font-extrabold text-xs tracking-tight text-foreground truncate">
                      OWAIS ABDULLAH
                    </div>
                    <div className="text-[10px] font-mono text-emerald-500">Superadmin Suite</div>
                  </div>
                </Link>

                {/* Collapse toggle button on desktop */}
                <button
                  onClick={() => setCollapsed(true)}
                  className="hidden md:flex p-1.5 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => setCollapsed(false)}
                  className="relative group p-1.5 rounded-xl hover:bg-muted/70 transition-all cursor-pointer flex items-center justify-center"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <Image
                    src="/assets/logo-192.png"
                    alt="Owais Abdullah"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-xl object-contain shadow-xs group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-card border border-border rounded-full p-0.5 shadow-xs text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronRight size={10} />
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  } ${collapsed ? "justify-center px-2" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} className={isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"} />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary External Links */}
          <div className="pt-4 border-t border-border space-y-1">
            <Link
              href="/studio"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors ${
                collapsed ? "justify-center px-2" : ""
              }`}
              title="Sanity Studio"
            >
              <Layers size={15} />
              {!collapsed && <span>Sanity Studio</span>}
              {!collapsed && <ArrowUpRight size={11} className="ml-auto" />}
            </Link>

            <Link
              href="/stores"
              target="_blank"
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors ${
                collapsed ? "justify-center px-2" : ""
              }`}
              title="Public Directory"
            >
              <ExternalLink size={15} />
              {!collapsed && <span>Live Directory</span>}
            </Link>
          </div>
        </div>

        {/* Footer Logout / Lock */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="Lock Dashboard"
          >
            <Lock size={14} />
            {!collapsed && <span>Lock Vault</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
