import React from 'react'
import Contact from '@/components/Contact'
import JsonLdSchema from '@/components/JsonLdSchema'
import type { Metadata } from "next";

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Owais Abdullah - AI Agents Developer, Full Stack Developer, and Next.js specialist. Available for freelance projects, collaborations, and professional opportunities in web development and AI integration.",
  keywords: [
    "Contact Owais Abdullah",
    "Hire Owais Abdullah",
    "AI Agents Developer Contact",
    "Full Stack Developer Contact",
    "Next.js Developer Contact",
    "React Developer Contact",
    "Web Developer Contact",
    "AI Developer Contact",
    "Software Developer Contact",
    "Freelance Developer",
    "Hire Developer",
    "Web Development Services",
    "AI Integration Services",
    "Professional Contact"
  ],
  openGraph: {
    title: "Contact | Owais Abdullah - AI Agents Developer & Full Stack Developer",
    description: "Get in touch with Owais Abdullah - AI Agents Developer, Full Stack Developer, and Next.js specialist. Available for freelance projects, collaborations, and professional opportunities in web development and AI integration.",
    url: "https://owaisabdullah.dev/contact",
    images: [
      {
        url: '/assets/Owais Abdullah (2).png',
        width: 1200,
        height: 630,
        alt: 'Contact Owais Abdullah - AI Agents Developer & Full Stack Developer',
      },
    ],
  },
  twitter: {
    title: "Contact | Owais Abdullah - AI Agents Developer & Full Stack Developer",
    description: "Get in touch with Owais Abdullah - AI Agents Developer, Full Stack Developer, and Next.js specialist. Available for freelance projects, collaborations, and professional opportunities in web development and AI integration.",
  },
  alternates: {
    canonical: 'https://owaisabdullah.dev/contact',
  },
};

const contact = () => {
  return (
    <>
      <JsonLdSchema type="contact" pageUrl="https://owaisabdullah.dev/contact" />
      <Contact />
    </>
  )
}

export default contact