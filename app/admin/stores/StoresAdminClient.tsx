"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  RefreshCw,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Building2,
  Trash2,
  Copy,
  Check,
  Layers,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Tag,
  MessageSquare,
  User,
  Mail,
  Phone,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { getAdminAuthToken, setAdminAuthToken, clearAdminAuthToken } from "@/lib/admin-auth";

interface PendingStore {
  id: number;
  name: string;
  slug: string;
  website: string;
  category: string;
  city: string;
  platform: string;
  description: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerWhatsapp?: string | null;
  notes?: string | null;
  createdAt?: string | null;
}

interface PendingClaim {
  id: number;
  storeId: number;
  claimantName: string;
  claimantEmail: string;
  claimantWhatsapp: string;
  claimantRole?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
  storeName?: string | null;
  storeSlug?: string | null;
  storeWebsite?: string | null;
  storeCategory?: string | null;
  storeCity?: string | null;
}

interface StoreItem {
  id: number;
  name: string;
  slug: string;
  website: string;
  category: string;
  city: string;
  platform: string;
  tier?: string | null;
  apiScore?: number | null;
  isClaimed?: boolean | null;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerWhatsapp?: string | null;
  editToken?: string | null;
  createdAt?: string | null;
}

interface DirectoryStats {
  totalStores: number;
  pendingStores: number;
  pendingClaims: number;
  claimedStores: number;
}

export default function StoresAdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Data
  const [pendingStores, setPendingStores] = useState<PendingStore[]>([]);
  const [pendingClaims, setPendingClaims] = useState<PendingClaim[]>([]);
  const [allStores, setAllStores] = useState<StoreItem[]>([]);
  const [stats, setStats] = useState<DirectoryStats>({
    totalStores: 0,
    pendingStores: 0,
    pendingClaims: 0,
    claimedStores: 0,
  });

  // UI States
  const [activeTab, setActiveTab] = useState<"submissions" | "claims" | "all">("submissions");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [claimedFilter, setClaimedFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Restore saved auth token
  useEffect(() => {
    const savedPassword = getAdminAuthToken();
    if (savedPassword) {
      fetchDirectoryData(savedPassword);
    }
    const handleAuthChange = () => {
      const p = getAdminAuthToken();
      if (p) {
        fetchDirectoryData(p);
      } else {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener("admin_auth_change", handleAuthChange);
    return () => window.removeEventListener("admin_auth_change", handleAuthChange);
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchDirectoryData = async (pass: string) => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`/api/admin/directory?token=${encodeURIComponent(pass)}`, {
        headers: { Authorization: `Bearer ${pass}` },
      });

      if (res.ok) {
        const data = await res.json();
        setPendingStores(data.pendingStores || []);
        setPendingClaims(data.pendingClaims || []);
        setAllStores(data.allStores || []);
        setStats(data.stats || { totalStores: 0, pendingStores: 0, pendingClaims: 0, claimedStores: 0 });
        setIsAuthenticated(true);
        setAdminAuthToken(pass);
      } else {
        const err = await res.json();
        setAuthError(err.error || "Incorrect password. Access denied.");
        clearAdminAuthToken();
        setIsAuthenticated(false);
      }
    } catch {
      setAuthError("Failed to connect to directory server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    fetchDirectoryData(passwordInput.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem("analytics_auth_token");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const handleRefresh = () => {
    const pass = sessionStorage.getItem("analytics_auth_token");
    if (pass) fetchDirectoryData(pass);
  };

  // Admin Actions
  const runAdminAction = async (payload: any) => {
    const pass = sessionStorage.getItem("analytics_auth_token");
    if (!pass) return;

    const actionKey = `${payload.action}-${payload.storeId || payload.claimId}`;
    setActionLoading(actionKey);

    try {
      const res = await fetch("/api/admin/directory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, password: pass }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        showToast(result.message || "Action completed successfully!");
        fetchDirectoryData(pass);
      } else {
        showToast(result.error || "Action failed.", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Request failed.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Filtered store directory
  const filteredStores = useMemo(() => {
    return allStores.filter((store) => {
      const matchesSearch =
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (store.ownerName && store.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === "all" || store.category === categoryFilter;
      const matchesCity = cityFilter === "all" || store.city === cityFilter;
      const matchesClaimed =
        claimedFilter === "all" ||
        (claimedFilter === "claimed" && store.isClaimed) ||
        (claimedFilter === "unclaimed" && !store.isClaimed);

      return matchesSearch && matchesCat && matchesCity && matchesClaimed;
    });
  }, [allStores, searchQuery, categoryFilter, cityFilter, claimedFilter]);

  // Categories & Cities for filters
  const categoriesList = useMemo(() => {
    return Array.from(new Set(allStores.map((s) => s.category).filter(Boolean)));
  }, [allStores]);

  const citiesList = useMemo(() => {
    return Array.from(new Set(allStores.map((s) => s.city).filter(Boolean)));
  }, [allStores]);

  // =========================================================================
  // 1. LOGIN SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-2xl"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto mb-5 shadow-sm">
            <Lock size={22} />
          </div>

          <h1 className="text-2xl font-extrabold text-center text-foreground tracking-tight">
            Directory & Stores Admin
          </h1>
          <p className="text-xs text-muted-foreground text-center mt-1.5 mb-6">
            Review inbound store submissions, verify merchant claims, and manage directory records.
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
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground/60 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle password visibility"
              >
                <Eye size={16} />
              </button>
            </div>

            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2"
              >
                <AlertCircle size={14} className="shrink-0" />
                <span>{authError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock size={15} />
                  <span>Unlock Admin Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Route: /admin/stores</span>
            <span className="text-emerald-500 font-semibold">Protected Vault</span>
          </div>
        </motion.div>
      </main>
    );
  }

  // =========================================================================
  // 2. AUTHENTICATED DASHBOARD
  // =========================================================================
  return (
    <main className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-foreground">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm flex items-center gap-2.5 backdrop-blur-md ${
              toastMessage.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
                : "bg-destructive/90 text-destructive-foreground border-destructive"
            }`}
          >
            {toastMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              ADMIN VAULT
            </span>
            <span className="text-xs font-mono text-muted-foreground">/admin/stores</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Store Directory Manager
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin text-primary" : ""} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/insights"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-medium transition-colors"
          >
            <TrendingUp size={13} className="text-primary" />
            <span>Insights Vault</span>
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border hover:border-primary text-foreground text-xs font-medium transition-colors"
          >
            <span>Sanity Studio</span>
            <ArrowUpRight size={13} />
          </Link>
          <Link
            href="/stores"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted/60 border border-border hover:border-primary text-foreground text-xs font-medium transition-colors"
          >
            <span>Live Directory</span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 text-destructive text-xs font-medium transition-colors"
          >
            <Lock size={13} />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>PENDING SUBMISSIONS</span>
            <Building2 size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {stats.pendingStores}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Inbound stores waiting review</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>PENDING CLAIMS</span>
            <ShieldCheck size={16} className="text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {stats.pendingClaims}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Founders requesting badge</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>VERIFIED STORES</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {stats.claimedStores}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Claimed & active profiles</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>TOTAL LISTINGS</span>
            <Layers size={16} className="text-foreground" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {stats.totalStores}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">All database listings</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === "submissions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Store Submissions</span>
          {pendingStores.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-500">
              {pendingStores.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("claims")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === "claims"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Claim Requests</span>
          {pendingClaims.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary">
              {pendingClaims.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>All Stores ({allStores.length})</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: PENDING STORE SUBMISSIONS
      ===================================================================== */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          {pendingStores.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500/50 mb-3" />
              <h3 className="text-base font-bold text-foreground">No Pending Inbound Submissions</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                All submitted stores have been reviewed! New submissions from <code className="text-foreground">/stores/submit</code> will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingStores.map((store) => {
                const actionKey = `approve-store-${store.id}`;
                const rejectKey = `reject-store-${store.id}`;
                const isActionBusy = actionLoading === actionKey || actionLoading === rejectKey;
                const cleanPhone = store.ownerWhatsapp?.replace(/[\s\-\+]/g, "");

                return (
                  <div
                    key={store.id}
                    className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          Pending Review
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                          {store.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border flex items-center gap-1">
                          <MapPin size={11} />
                          {store.city}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-primary/10 text-primary border border-primary/20">
                          {store.platform}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <span>{store.name}</span>
                          <a
                            href={store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-xs font-normal"
                          >
                            <ExternalLink size={13} />
                            <span>Visit Site</span>
                          </a>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {store.description}
                        </p>
                      </div>

                      {/* Founder Info */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/50">
                        {store.ownerName && (
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <User size={13} className="text-primary" />
                            <span>{store.ownerName}</span>
                          </div>
                        )}
                        {store.ownerEmail && (
                          <a
                            href={`mailto:${store.ownerEmail}`}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            <Mail size={13} />
                            <span>{store.ownerEmail}</span>
                          </a>
                        )}
                        {store.ownerWhatsapp && (
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-500 hover:underline font-mono"
                          >
                            <Phone size={13} />
                            <span>{store.ownerWhatsapp} (WhatsApp)</span>
                          </a>
                        )}
                      </div>

                      {store.notes && (
                        <div className="p-2.5 rounded-lg bg-muted/40 border border-border/80 text-xs text-muted-foreground">
                          <strong className="text-foreground">Notes:</strong> {store.notes}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => runAdminAction({ action: "approve-store", storeId: store.id, tier: "silver", apiScore: 80 })}
                        disabled={isActionBusy}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        <span>Approve & Publish</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Reject and delete submission for "${store.name}"?`)) {
                            runAdminAction({ action: "reject-store", storeId: store.id });
                          }
                        }}
                        disabled={isActionBusy}
                        className="px-3.5 py-2 rounded-xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 text-destructive text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: PENDING STORE CLAIMS
      ===================================================================== */}
      {activeTab === "claims" && (
        <div className="space-y-4">
          {pendingClaims.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
              <ShieldCheck className="mx-auto h-10 w-10 text-primary/50 mb-3" />
              <h3 className="text-base font-bold text-foreground">No Pending Store Claims</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                All claims have been verified! Inbound requests from store owners via <code className="text-foreground">/stores/claim</code> will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingClaims.map((claim) => {
                const actionKey = `approve-claim-${claim.id}`;
                const rejectKey = `reject-claim-${claim.id}`;
                const isActionBusy = actionLoading === actionKey || actionLoading === rejectKey;
                const cleanPhone = claim.claimantWhatsapp?.replace(/[\s\-\+]/g, "");

                return (
                  <div
                    key={claim.id}
                    className="p-5 sm:p-6 rounded-2xl bg-card border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/30 flex items-center gap-1">
                          <ShieldCheck size={12} />
                          Claim Request
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          Received: {new Date(claim.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">Claiming Store:</div>
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                          <span>{claim.storeName || `Store #${claim.storeId}`}</span>
                          {claim.storeSlug && (
                            <Link
                              href={`/stores/${claim.storeSlug}`}
                              target="_blank"
                              className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 text-xs font-normal"
                            >
                              <ExternalLink size={13} />
                              <span>View Listing</span>
                            </Link>
                          )}
                        </h3>
                      </div>

                      {/* Claimant Contact Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-muted/30 border border-border text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-mono">CLAIMANT</span>
                          <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                            <User size={12} className="text-primary" />
                            {claim.claimantName} ({claim.claimantRole || "Owner"})
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-mono">EMAIL</span>
                          <a
                            href={`mailto:${claim.claimantEmail}`}
                            className="font-medium text-foreground hover:underline flex items-center gap-1 mt-0.5 truncate"
                          >
                            <Mail size={12} />
                            {claim.claimantEmail}
                          </a>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-mono">WHATSAPP</span>
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-emerald-500 font-semibold hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <Phone size={12} />
                            {claim.claimantWhatsapp}
                          </a>
                        </div>
                      </div>

                      {claim.message && (
                        <div className="text-xs text-muted-foreground bg-card p-2.5 rounded-lg border border-border/70">
                          <strong className="text-foreground">Verification Note:</strong> {claim.message}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                      <a
                        href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(
                          claim.claimantName
                        )},%20this%20is%20Owais%20from%20the%20Pakistani%20E-commerce%20Store%20Directory%20regarding%20your%20claim%20for%20${encodeURIComponent(
                          claim.storeName || "your store"
                        )}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare size={13} />
                        <span>Chat WhatsApp</span>
                      </a>

                      <button
                        onClick={() =>
                          runAdminAction({
                            action: "approve-claim",
                            claimId: claim.id,
                            storeId: claim.storeId,
                          })
                        }
                        disabled={isActionBusy}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        <span>Confirm & Verify</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Reject this claim from ${claim.claimantName}?`)) {
                            runAdminAction({ action: "reject-claim", claimId: claim.id });
                          }
                        }}
                        disabled={isActionBusy}
                        className="px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 text-destructive text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: ALL STORES DIRECTORY
      ===================================================================== */}
      {activeTab === "all" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-card border border-border shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stores or owners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Categories ({allStores.length})</option>
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">All Cities</option>
                {citiesList.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={claimedFilter}
                onChange={(e) => setClaimedFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl bg-background border border-border text-foreground focus:outline-none focus:border-primary"
              >
                <option value="all">Claim Status: All</option>
                <option value="claimed">Verified / Claimed</option>
                <option value="unclaimed">Unclaimed</option>
              </select>
            </div>
          </div>

          {/* Stores Table */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono">
                  <tr>
                    <th className="py-3 px-4">STORE NAME</th>
                    <th className="py-3 px-3">CATEGORY & CITY</th>
                    <th className="py-3 px-3">STATUS</th>
                    <th className="py-3 px-3">OWNER CONTACT</th>
                    <th className="py-3 px-3">MAGIC EDIT LINK</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No stores matched your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStores.map((store) => {
                      const editUrl = store.editToken ? `/stores/${store.slug}/edit?token=${store.editToken}` : null;
                      const fullEditUrl = editUrl ? `https://owaisabdullah.dev${editUrl}` : null;

                      return (
                        <tr key={store.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                              <span>{store.name}</span>
                              {store.isClaimed && (
                                <CheckCircle2 size={13} className="text-primary shrink-0" />
                              )}
                            </div>
                            <a
                              href={store.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
                            >
                              <ExternalLink size={10} />
                              <span className="truncate max-w-[180px]">{store.website.replace(/^https?:\/\//, "")}</span>
                            </a>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="font-medium text-foreground">{store.category}</div>
                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />
                              <span>{store.city}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            {store.isClaimed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[10px] font-bold">
                                <CheckCircle2 size={11} />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border text-[10px] font-medium">
                                Unclaimed
                              </span>
                            )}
                            {store.tier && (
                              <div className="text-[10px] font-mono text-muted-foreground mt-0.5 uppercase">
                                Tier: {store.tier}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-3 text-[11px]">
                            {store.ownerName ? (
                              <div className="space-y-0.5">
                                <div className="font-medium text-foreground">{store.ownerName}</div>
                                {store.ownerWhatsapp && (
                                  <div className="font-mono text-emerald-500">{store.ownerWhatsapp}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic">No contact yet</span>
                            )}
                          </td>

                          <td className="py-3.5 px-3">
                            {store.editToken ? (
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={editUrl!}
                                  target="_blank"
                                  className="px-2 py-1 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground text-[11px] font-mono transition-colors"
                                >
                                  Open Editor
                                </Link>
                                <button
                                  onClick={() => copyToClipboard(fullEditUrl!, `link-${store.id}`)}
                                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                  title="Copy Magic Link"
                                >
                                  {copiedToken === `link-${store.id}` ? (
                                    <Check size={13} className="text-emerald-500" />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-[11px]">No token</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() =>
                                  runAdminAction({
                                    action: "toggle-claim",
                                    storeId: store.id,
                                    isClaimed: !store.isClaimed,
                                  })
                                }
                                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                                  store.isClaimed
                                    ? "bg-muted text-muted-foreground border-border hover:text-foreground"
                                    : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                                }`}
                              >
                                {store.isClaimed ? "Unverify" : "Verify"}
                              </button>

                              <Link
                                href={`/stores/${store.slug}`}
                                target="_blank"
                                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="View live listing"
                              >
                                <ArrowUpRight size={14} />
                              </Link>

                              <button
                                onClick={() => {
                                  if (confirm(`Permanently delete "${store.name}" from directory?`)) {
                                    runAdminAction({ action: "delete-store", storeId: store.id });
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="Delete Store"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
