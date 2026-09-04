"use client";

import { usePathname } from "next/navigation";
import { ChatBot } from "@/components/ui/ChatBot";
import OctivelyPromoToast from "@/components/OctivelyPromoToast";

export function ConditionalUI() {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith("/blog/") && pathname.length > 6;
  const isStudio = pathname.startsWith("/studio");
  const isInsights = pathname.startsWith("/insights-0786");

  return (
    <>
      {!isBlogPost && !isStudio && !isInsights && <ChatBot />}
      {!isStudio && !isInsights && <OctivelyPromoToast />}
    </>
  );
}