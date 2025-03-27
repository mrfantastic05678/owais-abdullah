import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingNavbar from "@/components/FloatingNavbar";
import { ChatBot } from "@/components/ui/ChatBot";
import { ThemeProvider } from "@/components/ThemeProvider";



export const metadata: Metadata = {
  title: "Owais Abdullah | AI Powered Solutions",
  description: "Creating Websites, Driving Result with AI Advantage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
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
