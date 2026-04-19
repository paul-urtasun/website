import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Body — GT America stand-in
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Headings + nav
const serif = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    {
      path: "./fonts/LouizeDisplay-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/LouizeDisplay-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    default: "Paul Urtasun",
    template: "%s — Paul Urtasun",
  },
  description:
    "Paul Urtasun is an interior designer based in New York. Selected interiors and objects.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
