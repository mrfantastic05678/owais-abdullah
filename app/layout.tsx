import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { clashDisplay, satoshi } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { ConditionalUI } from "@/components/ConditionalUI";
import LenisSmoothScroll from "@/components/LenisSmoothScroll";
import SVGPageTransition from "@/components/SVGPageTransition";
import CursorFollower from "@/components/CursorFollower";


export const metadata: Metadata = {
  metadataBase: new URL("https://owaisabdullah.dev"),
  title: {
    default: "Owais Abdullah | Spec-Driven Developer & AI Engineer",
    template: "%s | Spec-Driven Developer & AI Engineer",
  },
  description:
    "Owais Abdullah is a spec-driven developer and AI engineer specializing in Next.js SaaS products, AI agents, and Digital FTEs (AI employees). Expert in TypeScript, OpenAI Agents SDK, and building production-ready architectures with AI-driven engineering.",
  keywords: [
    "Owais Abdullah",
    "Owais",
    "Spec-Driven Developer",
    "AI Agent Engineer",
    "AI-Driven Development",
    "Next.js SaaS Developer",
    "Full Stack Digital FTE",
    "OpenAI Agents SDK",
    "TypeScript Developer",
    "SaaS Architect",
    "AI Automation Engineer",
    "WordPress Developer",
    "Sanity CMS Developer",
    "Full Stack Developer",
    "React Developer",
    "Python Developer",
    "Portfolio",
    "Web Development",
    "AI Integration",
    "Software Development",
  ],
  authors: [{ name: "Owais Abdullah", url: "https://owaisabdullah.dev" }],
  creator: "Owais Abdullah",
  publisher: "Owais Abdullah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/assets/logo.png" },
      { url: "/assets/owais_logo.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/owais_logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/assets/logo-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Owais Abdullah Portfolio",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://owaisabdullah.dev",
    title: "Owais Abdullah | Spec-Driven Developer & AI Engineer",
    description:
      "Owais Abdullah is a spec-driven developer and AI engineer specializing in Next.js SaaS products, AI agents, and Digital FTEs (AI employees). Expert in TypeScript, OpenAI Agents SDK, and building production-ready architectures.",
    siteName: "Owais Abdullah Portfolio",
    images: [
      {
        url: "/assets/owais-abdullah-og.png",
        width: 1200,
        height: 630,
        alt: "Owais Abdullah - Spec-Driven Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Owais Abdullah | Spec-Driven Developer & AI Engineer",
    description:
      "Owais Abdullah is a spec-driven developer and AI engineer specializing in Next.js SaaS products, AI agents, and Digital FTEs (AI employees). Expert in TypeScript, OpenAI Agents SDK, and building production-ready architectures.",
    images: ["/assets/owais-abdullah-og.png"],
    creator: "@mrowaisabdullah",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "92FJDtkgr_fHL9xYV5k_H0WlCjrZbHdrJq5I43pw7Zk",
  },
  other: {
    "msapplication-TileColor": "#212428",
    "theme-color": "#212428",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Owais Abdullah Portfolio",
    "application-name": "Owais Abdullah Portfolio",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('dark');`,
          }}
        />
      </head>
      <body
        className={cn(
          clashDisplay.variable,
          satoshi.variable,
          "font-sans antialiased"
        )}
      >
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <LenisSmoothScroll>
              {/* Header/Footer must live INSIDE the transition provider —
                  auto mode only intercepts links within its subtree, so nav
                  clicks outside it would hard-navigate with no animation */}
              <SVGPageTransition>
                <ConditionalUI />
                <CursorFollower />
                <Header />
                <main className="pt-24">{children}</main>
                <Footer />
              </SVGPageTransition>
          </LenisSmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
