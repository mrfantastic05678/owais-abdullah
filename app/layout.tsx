import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { clashDisplay, satoshi, newsreader } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Script from "next/script";
import LenisSmoothScroll from "@/components/LenisSmoothScroll";
import CursorFollower from "@/components/CursorFollower";
import { ThemeEnforcer } from "@/components/ThemeEnforcer";
import { LayoutShell } from "@/components/LayoutShell";


export const metadata: Metadata = {
  metadataBase: new URL("https://owaisabdullah.dev"),
  title: {
    default: "Owais Abdullah | AI Automation Agency & Custom Agent Development",
    template: "%s | Owais Abdullah",
  },
  description:
    "AI automation agency and custom agent development services by Owais Abdullah. Autonomous Digital FTEs, Next.js SaaS, and OpenAI Agents SDK. Hire an AI dev.",
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
    types: {
      "application/rss+xml": "https://owaisabdullah.dev/feed.xml",
    },
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
    title: "Owais Abdullah | AI Automation Agency & Custom Agent Development",
    description:
      "AI automation agency and custom agent development services by Owais Abdullah. Autonomous Digital FTEs, Next.js SaaS, and OpenAI Agents SDK.",
    siteName: "Owais Abdullah Portfolio",
    images: [
      {
        url: "/assets/owais-abdullah-og.png",
        width: 1200,
        height: 630,
        alt: "Owais Abdullah - AI Automation Agency & Custom Agent Development",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Owais Abdullah | AI Automation Agency & Custom Agent Development",
    description:
      "AI automation agency and custom agent development services by Owais Abdullah. Autonomous Digital FTEs, Next.js SaaS, and OpenAI Agents SDK.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://owaisabdullah.dev/#person",
              name: "Owais Abdullah",
              url: "https://owaisabdullah.dev",
              image: "https://owaisabdullah.dev/assets/owais-abdullah-og.png",
              jobTitle: "Spec-Driven Developer & AI Engineer",
              description:
                "AI engineer specializing in Next.js SaaS products, AI agents, and Digital FTEs. Founder of Octively. 3+ years, 40+ projects delivered.",
              sameAs: [
                "https://github.com/MrOwaisAbdullah",
                "https://www.linkedin.com/in/mrowaisabdullah/",
                "https://x.com/mrowaisabdullah",
                "https://octively.com",
              ],
              knowsAbout: [
                "Next.js",
                "TypeScript",
                "Python",
                "AI Agents",
                "OpenAI Agents SDK",
                "Claude Code",
                "SaaS Architecture",
                "Digital FTE",
                "AI Automation",
              ],
              worksFor: [
                { "@type": "Organization", name: "LionUp Digital" },
                { "@type": "Organization", name: "AA Marketing" },
              ],
              founder: {
                "@type": "Organization",
                name: "Octively",
                url: "https://octively.com",
              },
              address: { "@type": "PostalAddress", addressCountry: "PK" },
            }).replace(/</g, "\u003c"),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={cn(
          clashDisplay.variable,
          satoshi.variable,
          newsreader.variable,
          "font-sans antialiased bg-background text-foreground relative min-h-screen selection:bg-teal-500/20 selection:text-teal-900 dark:selection:text-teal-100"
        )}
      >
        {/* Fixed background micro-dot lattice and ambient mesh */}
        <div className="fixed inset-0 pointer-events-none bg-dot-lattice z-0" />
        <div className="fixed inset-0 pointer-events-none ambient-mesh z-0" />
        
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
        {/* Google Preferred Sources SDK */}
        <Script id="google-preferred-sources-init" strategy="beforeInteractive">
          {`window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || [];`}
        </Script>
        <Script
          src="https://news.google.com/swg/js/v1/publisher.js"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeEnforcer />
          <LenisSmoothScroll>
            <CursorFollower />
            <div className="relative z-10">
              <LayoutShell>{children}</LayoutShell>
            </div>
          </LenisSmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
