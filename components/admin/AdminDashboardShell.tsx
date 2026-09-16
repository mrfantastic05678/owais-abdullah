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

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const token = sessionStorage.getItem("analytics_auth_token");
      setIsLoggedIn(Boolean(token));
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 800);
    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

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
      label: "Cache & Webhooks",
      href: "/admin/cache",
      icon: Zap,
      badge: "Purge",
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("analytics_auth_token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  // If user is not logged in yet, render the clean full-screen login card without any sidebar or navbar
  if (mounted && !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

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
