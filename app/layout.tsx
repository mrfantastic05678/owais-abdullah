import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingNavbar from "@/components/FloatingNavbar";
import { ChatBot } from "@/components/ui/ChatBot";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Owais Abdullah | AI Agents Developer & Full Stack Developer",
    template: "%s | Owais Abdullah"
  },
  description: "Owais Abdullah is a skilled AI Agents Developer, Full Stack Developer, and Next.js specialist. Expert in React, AI integration, and modern web development. View portfolio and projects.",
  keywords: [
    "Owais Abdullah",
    "Owais",
    "Muhammad Owais", 
    "AI Agents Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "Full Stack Developer",
    "AI Developer",
    "Frontend Developer",
    "Backend Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Portfolio",
    "Web Development",
    "AI Integration",
    "Machine Learning",
    "Software Development"
  ],
  authors: [{ name: "Owais Abdullah" }],
  creator: "Owais Abdullah",
  publisher: "Owais Abdullah",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://owaisabdullah.dev'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/assets/owais_logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/owais_logo.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/assets/owais_logo.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Owais Abdullah Portfolio'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://owaisabdullah.dev',
    title: 'Owais Abdullah | AI Agents Developer & Full Stack Developer',
    description: 'Owais Abdullah is a skilled AI Agents Developer, Full Stack Developer, and Next.js specialist. Expert in React, AI integration, and modern web development.',
    siteName: 'Owais Abdullah Portfolio',
    images: [
      {
        url: '/assets/Owais Abdullah (2).png',
        width: 1200,
        height: 630,
        alt: 'Owais Abdullah - AI Agents Developer & Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Owais Abdullah | AI Agents Developer & Full Stack Developer',
    description: 'Owais Abdullah is a skilled AI Agents Developer, Full Stack Developer, and Next.js specialist. Expert in React, AI integration, and modern web development.',
    images: ['/assets/Owais Abdullah (2).png'],
    creator: '@mrowaisabdullah',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Owais Abdullah Portfolio',
    'application-name': 'Owais Abdullah Portfolio',
    'mobile-web-app-capable': 'yes',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Owais Abdullah Portfolio" />
        <meta name="application-name" content="Owais Abdullah Portfolio" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <FloatingNavbar />
        <Header />
        {children}
        <Footer />
        <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}
