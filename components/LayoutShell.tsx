"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ConditionalUI } from "@/components/ConditionalUI";

/**
 * Wraps Header, Footer, and Chatbot.
 * Hides all three on /studio routes (Sanity CMS).
 */
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname.startsWith("/studio");

  return (
    <>
      {!isStudio && <Header />}
      <ConditionalUI />
      <main className={isStudio ? "" : "pt-24"}>{children}</main>
      {!isStudio && <Footer />}
    </>
  );
}
