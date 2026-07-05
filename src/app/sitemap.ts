import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.9 },
    { path: "/officers", priority: 0.8 },
    { path: "/gallery", priority: 0.8 },
    { path: "/join", priority: 0.9 },
    { path: "/calendar", priority: 0.7 },
    { path: "/slides", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/ceg", priority: 0.4 },
    { path: "/museum", priority: 0.4 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
