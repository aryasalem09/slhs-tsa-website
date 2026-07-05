import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Nunito_Sans } from "next/font/google";
import MobileTabBar from "@/components/MobileTabBar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TapSparkles from "@/components/TapSparkles";
import { whatIsTsa } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SLHS TSA — Seven Lakes High School Technology Student Association",
    template: "%s · SLHS TSA",
  },
  description: whatIsTsa,
  keywords: [
    "SLHS TSA",
    "Seven Lakes High School",
    "Technology Student Association",
    "Katy ISD",
    "STEM club",
  ],
};

export const viewport: Viewport = {
  themeColor: "#faf6ed",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${nunito.variable} ${caveat.variable} bg-paper pb-[calc(4.5rem+env(safe-area-inset-bottom))] font-body text-ink antialiased lg:pb-0`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border-2 focus:border-ink focus:bg-card focus:px-4 focus:py-2 focus:font-bold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div className="relative">
          {/* notebook doodles in the wide-screen margins — decoration only */}
          <div
            aria-hidden="true"
            className="doodle-margin pointer-events-none absolute inset-y-0 left-3 hidden w-[170px] opacity-[0.18] min-[1500px]:block"
          />
          <div
            aria-hidden="true"
            className="doodle-margin pointer-events-none absolute inset-y-0 right-3 hidden w-[170px] opacity-[0.18] min-[1500px]:block"
            style={{ backgroundPosition: "0 520px" }}
          />
          <main id="main">{children}</main>
        </div>
        <SiteFooter />
        <MobileTabBar />
        <TapSparkles />
      </body>
    </html>
  );
}
