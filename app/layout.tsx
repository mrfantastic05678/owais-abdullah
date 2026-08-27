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
    default: "Owais Abdullah | AI Engineer & SaaS Developer",
    template: "%s | Owais Abdullah",
  },
  description:
    "AI engineer building Digital FTEs, custom agents, and Next.js SaaS. OpenAI Agents SDK, TypeScript, Python. View projects.",
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
    title: "Owais Abdullah | AI Engineer & SaaS Developer",
    description:
      "AI engineer building Digital FTEs, custom agents, and Next.js SaaS. OpenAI Agents SDK, TypeScript, Python.",
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
    title: "Owais Abdullah | AI Engineer & SaaS Developer",
    description:
      "AI engineer building Digital FTEs, custom agents, and Next.js SaaS. OpenAI Agents SDK, TypeScript, Python.",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var path = window.location.pathname;
                var isBlog = path === '/blog' || path.startsWith('/blog/');
                if (isBlog) {
                  var t = localStorage.getItem('theme');
                  if (t === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className={cn(
          clashDisplay.variable,
          satoshi.variable,
          newsreader.variable,
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
          <ThemeEnforcer />
          <LenisSmoothScroll>
            <CursorFollower />
            <LayoutShell>{children}</LayoutShell>
          </LenisSmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
