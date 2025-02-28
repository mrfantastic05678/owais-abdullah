import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingNavbar from "@/components/FloatingNavbar";



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
    <html lang="en">
      <body
      >
        <FloatingNavbar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
