"use client";

import { usePathname } from "next/navigation";
import FloatingNavbar from "@/components/FloatingNavbar";
import { ChatBot } from "@/components/ui/ChatBot";

export function ConditionalUI() {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith('/blog/') && pathname.length > 6;

  return (
    <>
      {!isBlogPost && <FloatingNavbar />}
      {!isBlogPost && <ChatBot />}
    </>
  );
}