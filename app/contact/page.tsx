import React from "react";
import Contact from "@/components/Contact";
import JsonLdSchema from "@/components/JsonLdSchema";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact Owais Abdullah | Spec-Driven Developer & AI Engineer",
  description:
    "Get in touch with Owais Abdullah for spec-driven SaaS projects, AI agent development, and full-time digital solutions. Expert in Next.js, TypeScript, and OpenAI Agents SDK.",
  authors: [{ name: "Owais Abdullah", url: "https://owaisabdullah.dev" }],
  keywords: [
    "Contact Owais Abdullah",
    "Hire Spec-Driven Developer",
    "AI Agent Developer Contact",
    "AI-Driven Development Contact",
    "Next.js SaaS Developer Contact",
    "Full Stack Digital FTE",
    "Hire AI Engineer",
    "SaaS Architect Contact",
    "OpenAI Agents SDK Developer",
    "TypeScript Developer Contact",
    "Freelance Developer",
    "Hire Developer",
    "Web Development Services",
    "AI Integration Services",
    "Professional Contact",
  ],
  openGraph: {
    title: "Contact Owais Abdullah | Spec-Driven Developer & AI Engineer",
    description:
      "Get in touch with Owais Abdullah for spec-driven SaaS projects, AI agent development, and full-time digital solutions. Expert in Next.js, TypeScript, and OpenAI Agents SDK.",
    url: "https://owaisabdullah.dev/contact",
    siteName: "Owais Abdullah Portfolio",
    type: "website",
    images: [
      {
        url: "/assets/Owais Abdullah (2).png",
        width: 1200,
        height: 630,
        alt: "Contact Owais Abdullah - Spec-Driven Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    title: "Contact Owais Abdullah | Spec-Driven Developer & AI Engineer",
    description:
      "Get in touch with Owais Abdullah for spec-driven SaaS projects, AI agent development, and full-time digital solutions. Expert in Next.js, TypeScript, and OpenAI Agents SDK.",
    card: "summary_large_image",
    images: ["/assets/Owais Abdullah (2).png"],
  },
  alternates: {
    canonical: "https://owaisabdullah.dev/contact",
  },
};

const contact = () => {
  return (
    <>
      <JsonLdSchema
        type="contact"
        pageUrl="https://owaisabdullah.dev/contact"
      />
      <Contact />
    </>
  );
};

export default contact;
