import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { site } from "../src/content/site";
import { pageSeo } from "../src/lib/seo";

async function discoverPublicRoutes() {
  const routes: string[] = [];
  const entries = await readdir("src/app", { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || entry.name !== "page.tsx") continue;
    const file = `${entry.parentPath}/${entry.name}`;
    const normalized = file.replaceAll("\\", "/");
    const route = normalized.slice("src/app".length).replace(/\/page\.tsx$/, "") || "/";
    if (route === "/museum") continue;
    routes.push(route);
  }
  return routes.sort();
}

test("the sitemap lists every canonical public route", async () => {
  const publicRoutes = await discoverPublicRoutes();
  assert.deepEqual(
    sitemap().map(({ url }) => url).sort(),
    publicRoutes.map((route) => `${site.url}${route === "/" ? "" : route}`),
  );
});

test("robots advertises the canonical sitemap", () => {
  const policy = robots();
  assert.deepEqual(policy.rules, { userAgent: "*", allow: "/" });
  assert.equal(policy.sitemap, `${site.url}/sitemap.xml`);
});

test("public page metadata is canonical, indexable, and eligible for rich previews", () => {
  const metadata = pageSeo("/about");
  assert.deepEqual(metadata.alternates, { canonical: "/about" });
  assert.equal(metadata.openGraph?.url, "/about");
  assert.deepEqual(metadata.robots, {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  });
});

test("the machine-readable site guide links every public route", async () => {
  const [guide, publicRoutes] = await Promise.all([
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
    discoverPublicRoutes(),
  ]);
  for (const route of publicRoutes) {
    const url = `${site.url}${route === "/" ? "/" : route}`;
    assert.match(guide, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
