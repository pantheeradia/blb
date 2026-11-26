import type { Metadata } from "next";
import localFont from "next/font/local";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { UtmTracker } from "@/components/UtmTracker";
import "./globals.css";

const geist = localFont({
  src: "../../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bean Leaf Brew - Artisan Coffee, Bengaluru",
  description:
    "Specialty coffee roasted in small batches in Whitefield, Bengaluru. Shop single-origin beans, ground blends, and instant premix.",
  keywords: ["coffee", "specialty coffee", "Bengaluru", "artisan", "instant premix"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preload" as="image" href="/images/HB_03.webp" />
      </head>
      <body className={`${geist.variable} antialiased`}>
        <UtmTracker />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
