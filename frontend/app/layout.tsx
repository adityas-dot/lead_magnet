import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = localFont({
  src: "../public/fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

const nohemi = localFont({
  src: [
    {
      path: "../public/fonts/Nohemi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Nohemi-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
});

const satoshi = localFont({
  src: "../public/fonts/SatoshiVariable.ttf",
  variable: "--font-satoshi",
  weight: "100 900",
});

const delight = localFont({
  src: "../public/fonts/DelightVariable.ttf",
  variable: "--font-delight",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Thumbstack - Shopify Lead Magnet",
  description: "Turn More of Your Traffic Into Customers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nohemi.variable} ${satoshi.variable} ${delight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-satoshi">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
