"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide labeled cursor (Operator style): a small square follower that
 * trails behind the pointer, grows into a labeled disc over elements with
 * `data-cursor` + `data-cursor-label` (OPEN / LIVE / SCROLL / DRAG), and
 * rings over links/buttons. The native cursor stays visible — this is a
 * trailing accent, not a replacement. Disabled entirely on /studio, for
 * touch, and for reduced-motion users.
 */
export default function CursorFollower() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => {
    if (
      isStudio ||
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label) return;

    root.style.display = "block";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    // Delegated hover states — survives client-side re-renders
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const stateEl = target.closest<HTMLElement>("[data-cursor]");
      if (stateEl) {
        root.dataset.state = stateEl.dataset.cursor || "";
        label.textContent = stateEl.dataset.cursorLabel || "";
      } else {
        root.dataset.state = "";
        label.textContent = "";
      }
      root.classList.toggle("is-link", !!target.closest("a, button, summary, [role='button']"));
    };
    document.addEventListener("mouseover", onOver, { passive: true });

    const onLeaveWindow = () => {
      root.style.opacity = "0";
    };
    const onEnterWindow = () => {
      root.style.opacity = "1";
    };
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
      root.style.display = "none";
    };
  }, [isStudio]);

  if (isStudio) return null;

  return (
    <div ref={rootRef} className="cursor-follower" aria-hidden="true" style={{ display: "none" }}>
      <div className="cursor-core">
        <span ref={labelRef}></span>
      </div>
    </div>
  );
}
