import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Body — GT America stand-in
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Headings + nav
const serif = Cormorant({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
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
      </body>
    </html>
  );
}
