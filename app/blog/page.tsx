import React from "react";
import BlogSection from "@/components/BlogSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owais Abdullah | AI Agents, AI Enthusiasts Blog",
  description:
    "Get the latest news and easy tips on Technology, Tools, AI and Agents.",
  openGraph: {
    title: "Owais Abdullah | AI Agents, AI Enthusiasts Blog",
    description:
      "Get the latest news and easy tips on Technology, Tools, AI and Agents.",
    url: "https://owaisabdullah.dev/blog",
  },
  alternates: {
    canonical: "/blog",
  },
};

const page = () => {
  return (
    <div className="min-h-screen mt-2 mb-20 ">
      <BlogSection />
    </div>
  );
};

export default page;