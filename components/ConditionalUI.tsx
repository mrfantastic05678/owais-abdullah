"use client";

import { usePathname } from "next/navigation";

import { ChatBot } from "@/components/ui/ChatBot";

export function ConditionalUI() {
  const pathname = usePathname();
  const isBlogPost = pathname.startsWith('/blog/') && pathname.length > 6;

  return (
    <>
      {!isBlogPost && <ChatBot />}
    </>
  );
}