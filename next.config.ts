import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// The site is statically rendered. This policy keeps scripts and embeds scoped
// to origins the site actually uses without forcing every page to be dynamic.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "frame-src https://calendar.google.com https://docs.google.com https://www.canva.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "X-XSS-Protection", value: "0" },
];

// Browser, intermediary-CDN, and Vercel-CDN caches are intentionally explicit.
// A new deployment invalidates the edge copy while browsers keep a short-lived
// page copy and a longer-lived copy of static media.
const pageCacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
  { key: "CDN-Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800" },
  { key: "Vercel-CDN-Cache-Control", value: "public, max-age=31536000, stale-while-revalidate=604800, stale-if-error=604800" },
];

const mediaCacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=31536000" },
  { key: "CDN-Cache-Control", value: "public, max-age=31536000, stale-while-revalidate=604800, stale-if-error=604800" },
  { key: "Vercel-CDN-Cache-Control", value: "public, max-age=31536000, stale-while-revalidate=604800, stale-if-error=604800" },
];

const nextConfig: NextConfig = {
  // Keep development and production artifacts separate. Running `next build`
  // while a preview is open can no longer overwrite Turbopack's live state.
  distDir: isDev ? ".next-dev" : ".next",
  // Photographs are already exported as WebP. Serving their exact original
  // bytes avoids another lossy encode and removes the optimizer abuse surface.
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders, ...pageCacheHeaders],
      },
      // Require at least one path segment so the /gallery and /officers HTML
      // routes retain the shorter page-cache policy.
      { source: "/gallery/:path+", headers: mediaCacheHeaders },
      { source: "/officers/:path+", headers: mediaCacheHeaders },
      { source: "/logos/:path+", headers: mediaCacheHeaders },
      { source: "/cursors/:path+", headers: mediaCacheHeaders },
      { source: "/og.jpg", headers: mediaCacheHeaders },
    ];
  },
};

export default nextConfig;
