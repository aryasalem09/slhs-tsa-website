import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/about",
    "/officers",
    "/gallery",
    "/join",
    "/calendar",
    "/slides",
    "/contact",
    "/museum",
  ];

  return routes.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
  }));
}
