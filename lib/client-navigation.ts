"use client";

export interface NavigationResult {
  [key: string]: unknown;
  status: "navigated" | "already_there" | "unsupported_target";
  target: string;
  type: "section" | "page";
  destinationUrl?: string;
}

/**
 * Universal portfolio navigation handler.
 * Navigates across pages or smoothly scrolls to sections without triggering full browser reloads.
 * This guarantees the ChatBot and Live Voice WebSocket remain persistent and uninterrupted.
 */
export function handlePortfolioNavigation(
  rawTarget: string,
  pathname: string,
  router: { push: (url: string) => void }
): NavigationResult {
  if (!rawTarget || typeof rawTarget !== "string") {
    return { status: "unsupported_target", target: "", type: "page" };
  }

  const trimmed = rawTarget.trim();
  const lower = trimmed.toLowerCase();

  // Normalize aliases
  const sectionAliasMap: Record<string, string> = {
    work: "projects",
    portfolio: "projects",
    builds: "projects",
    project: "projects",
    cases: "projects",
    service: "services",
    skill: "skills",
    stacks: "stack",
    faq: "faq",
    faqs: "faq",
    intro: "hero",
    home: "hero",
  };

  const cleanSection = lower.replace(/^#/, "");
  const normalizedSection = sectionAliasMap[cleanSection] || cleanSection;

  const homeSections = [
    "hero",
    "skills",
    "about",
    "stats",
    "services",
    "fte",
    "projects",
    "blog",
    "experience",
    "faq",
    "contact",
  ];

  // Page mappings
  const pageRouteMap: Record<string, string> = {
    "/": "/",
    home: "/",
    about: "/about",
    "/about": "/about",
    projects: "/projects",
    "/projects": "/projects",
    work: "/projects",
    "/work": "/projects",
    services: "/services",
    "/services": "/services",
    "digital-fte": "/services/digital-fte",
    "/services/digital-fte": "/services/digital-fte",
    stack: "/stack",
    "/stack": "/stack",
    skills: "/skills",
    "/skills": "/skills",
    journey: "/journey",
    "/journey": "/journey",
    blog: "/blog",
    "/blog": "/blog",
    stores: "/stores",
    "/stores": "/stores",
    contact: "/contact",
    "/contact": "/contact",
    search: "/search",
    "/search": "/search",
  };

  const targetDisplayNames: Record<string, string> = {
    projects: "Projects & Builds",
    work: "Projects & Builds",
    services: "Engineering Services",
    "digital-fte": "Digital FTEs",
    "/services/digital-fte": "Digital FTEs",
    stack: "Verified Tech Stack",
    skills: "Core Engineering Skills",
    blog: "Tech Articles & Insights",
    stores: "E-Commerce Directory",
    about: "Background & Bio",
    contact: "Project Scope & Contact",
    faq: "Frequently Asked Questions",
    journey: "Engineering Journey",
    hero: "Mission Overview",
  };

  const displayName =
    targetDisplayNames[normalizedSection] ||
    targetDisplayNames[lower] ||
    targetDisplayNames[cleanSection] ||
    trimmed;

  // Helper: Trigger visual glow animation on arriving element
  const highlightElement = (elem: HTMLElement) => {
    elem.classList.remove("agent-target-highlight");
    void elem.offsetWidth; // trigger reflow
    elem.classList.add("agent-target-highlight");
    setTimeout(() => {
      elem.classList.remove("agent-target-highlight");
    }, 2800);
  };

  // Helper: Broadcast HUD notification to on-screen overlay
  const notifyAgentNavigation = (type: "section" | "page") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("agent_navigation", {
          detail: {
            target: rawTarget,
            displayName,
            type,
          },
        })
      );
    }
  };

  // 1. If currently on Home page and target is a home section
  if (pathname === "/" && homeSections.includes(normalizedSection)) {
    const el =
      document.getElementById(normalizedSection) ||
      document.getElementById(cleanSection) ||
      document.querySelector(`[data-section="${normalizedSection}"]`);
    if (el) {
      notifyAgentNavigation("section");
      // 350ms orchestrated delay so speech/chat response starts alongside the smooth glide
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
        highlightElement(el as HTMLElement);
      }, 350);

      return {
        status: "navigated",
        target: normalizedSection,
        type: "section",
        destinationUrl: `/#${normalizedSection}`,
      };
    }
  }

  // 2. If on a different page and target is a home section
  // Navigate back to home section via client router (no full reload)
  if (pathname !== "/" && homeSections.includes(normalizedSection)) {
    notifyAgentNavigation("section");
    // Orchestrated transition delay
    setTimeout(() => {
      router.push(`/#${normalizedSection}`);
      if (typeof window !== "undefined") {
        setTimeout(() => {
          const el =
            document.getElementById(normalizedSection) ||
            document.getElementById(cleanSection) ||
            document.querySelector(`[data-section="${normalizedSection}"]`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            highlightElement(el as HTMLElement);
          }
        }, 300);
      }
    }, 350);

    return {
      status: "navigated",
      target: normalizedSection,
      type: "section",
      destinationUrl: `/#${normalizedSection}`,
    };
  }

  // 3. Direct page route navigation
  const targetPage =
    pageRouteMap[lower] ||
    pageRouteMap[trimmed] ||
    (trimmed.startsWith("/") ? trimmed : null);

  if (targetPage) {
    if (pathname === targetPage) {
      notifyAgentNavigation("page");
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 350);
      }
      return {
        status: "already_there",
        target: targetPage,
        type: "page",
        destinationUrl: targetPage,
      };
    }

    notifyAgentNavigation("page");
    // Orchestrated transition delay
    setTimeout(() => {
      router.push(targetPage);
    }, 350);

    return {
      status: "navigated",
      target: targetPage,
      type: "page",
      destinationUrl: targetPage,
    };
  }

  // 4. Fallback DOM element search on the current page
  if (typeof document !== "undefined") {
    const anyEl =
      document.getElementById(cleanSection) ||
      document.querySelector(`[data-section="${cleanSection}"]`);
    if (anyEl) {
      notifyAgentNavigation("section");
      setTimeout(() => {
        anyEl.scrollIntoView({ behavior: "smooth" });
        highlightElement(anyEl as HTMLElement);
      }, 350);
      return {
        status: "navigated",
        target: cleanSection,
        type: "section",
      };
    }
  }

  return { status: "unsupported_target", target: rawTarget, type: "page" };
}
