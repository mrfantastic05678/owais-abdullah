import localFont from "next/font/local";

// Clash Display — display/heading font (Fontshare, ITF Free Font License)
export const clashDisplay = localFont({
  src: "../app/fonts/ClashDisplay-Variable.woff2",
  display: "swap",
  variable: "--font-clash-display",
  weight: "200 700",
});

// Satoshi — body/UI font (Fontshare, ITF Free Font License)
export const satoshi = localFont({
  src: [
    {
      path: "../app/fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../app/fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-satoshi",
});
