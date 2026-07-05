import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Nunito_Sans } from "next/font/google";
import MobileTabBar from "@/components/MobileTabBar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TapSparkles from "@/components/TapSparkles";
import { site, whatIsTsa } from "@/content/site";
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
  description: whatIsTsa,
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
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileTabBar />
        <TapSparkles />
        <script
          type="application/ld+json"
          // Organization structured data so search engines understand the chapter.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: site.fullName,
              alternateName: "SLHS TSA",
              url: site.url,
              logo: `${site.url}/logos/spartan-mark-512.png`,
              email: site.email,
              sameAs: [site.socials.instagram, "https://tsaweb.org/"],
              address: {
                "@type": "PostalAddress",
                streetAddress: "9251 S Fry Rd",
                addressLocality: "Katy",
                addressRegion: "TX",
                postalCode: "77494",
                addressCountry: "US",
              },
              parentOrganization: {
                "@type": "Organization",
                name: "Technology Student Association",
                url: "https://tsaweb.org/",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
