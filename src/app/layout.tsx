import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Nunito_Sans } from "next/font/google";
import MobileTabBar from "@/components/MobileTabBar";
import ManagedSiteFooter from "@/components/ManagedSiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TapSparkles from "@/components/TapSparkles";
import StudioBridge from "@/components/StudioBridge";
import { metaDescription, site } from "@/content/site";
import { getDocumentForRender } from "@/lib/studio/render";
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
  metadataBase: new URL(site.url),
  title: {
    default: "SLHS TSA · Seven Lakes High School Technology Student Association",
    template: "%s · SLHS TSA",
  },
  description: metaDescription,
  keywords: [
    "SLHS TSA",
    "Seven Lakes High School",
    "Technology Student Association",
    "Katy ISD",
    "STEM club",
  ],
  // No title/description here: each page's own resolved title and
  // description flow into its og/twitter tags automatically.
  openGraph: {
    siteName: "SLHS TSA",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "SLHS TSA members at the TSA 2026 state conference marquee",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6ed",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const document = await getDocumentForRender();
  const preset = document.theme.presets.find((candidate) => candidate.id === document.theme.activePreset) ?? document.theme.presets[0];
  const validColor = (value: unknown, fallback: string) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  const themeStyle = {
    "--color-tsa-blue": validColor(preset?.tokens.primary, "#005eab"),
    "--color-tsa-red": validColor(preset?.tokens.accent, "#ef3224"),
    "--color-paper": validColor(preset?.tokens.surface, "#faf6ed"),
    "--color-ink": validColor(preset?.tokens.ink, "#253244"),
  } as CSSProperties;
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${nunito.variable} ${caveat.variable} bg-paper pb-[calc(4.5rem+env(safe-area-inset-bottom))] font-body text-ink antialiased lg:pb-0`}
        style={themeStyle}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border-2 focus:border-ink focus:bg-card focus:px-4 focus:py-2 focus:font-bold"
        >
          Skip to content
        </a>
        <SiteHeader navigation={document.navigation} siteInfo={document.site} />
        <main id="main">{children}</main>
        <ManagedSiteFooter navigation={document.navigation} siteInfo={document.site} />
        <MobileTabBar navigation={document.navigation} />
        <TapSparkles />
        <StudioBridge />
      </body>
    </html>
  );
}
