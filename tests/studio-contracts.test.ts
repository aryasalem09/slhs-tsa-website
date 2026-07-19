import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { readBodyWithLimit, RequestBodyTooLargeError } from "../src/lib/studio/http";
import { clearLoginAttempts, consumeLoginAttempt } from "../src/lib/studio/rate-limit";
import {
  isStudioLinkField,
  isStudioReviewPathRelevant,
  isValidStudioLink,
  studioPageEntries,
  studioPageLabel,
  studioSectionEntries,
  visibleEditorObjectEntries,
} from "../src/lib/studio/editor-config";
import { createSeedDocument } from "../src/lib/studio/seed";
import { studioDocumentSchema } from "../src/lib/studio/validation";
import { isSafeImageSrc, isSafeInternalHref } from "../src/lib/urls";

test("the canonical seed remains a valid bounded Studio document", () => {
  const result = studioDocumentSchema.safeParse(createSeedDocument());
  if (!result.success) assert.fail(result.error.message);
  assert.equal(result.success, true);
});

test("Studio combines the CEG and Museum editor surfaces without exposing the redirect page", () => {
  const seed = createSeedDocument();

  assert.equal(studioPageEntries(seed.pages).some(([key]) => key === "museum"), false);
  assert.equal(studioPageLabel("ceg", seed.pages.ceg.title), "CEG + Museum");
  assert.deepEqual(
    studioSectionEntries("ceg", seed.pages.ceg.sections).map(([key]) => key),
    ["ceg", "museum"],
  );
});

test("Studio section ordering is independent of content object insertion order", () => {
  const shuffledAbout = {
    meetings: {},
    competing: {},
    seasonHighlights: {},
    achievements: {},
    whatIsTsa: {},
  };

  assert.deepEqual(
    studioSectionEntries("about", shuffledAbout).map(([key]) => key),
    ["achievements", "seasonHighlights", "meetings", "competing"],
  );
});

test("Studio hides legacy Join and Museum URLs while retaining their source objects", () => {
  const joinLinks = {
    legacySignupUrl: "https://legacy.example/signup",
    payNGo: "https://pay.example",
    registrationForm: "https://register.example",
  };
  const museumLinks = {
    legacyMuseumUrl: "https://legacy.example/museum",
    shortForm: "https://museum.example/submit",
  };

  assert.deepEqual(
    visibleEditorObjectEntries(["pages", "join", "sections", "links"], joinLinks).map(([key]) => key),
    ["registrationForm", "payNGo"],
  );
  assert.equal(joinLinks.legacySignupUrl, "https://legacy.example/signup");
  assert.deepEqual(
    visibleEditorObjectEntries(["pages", "ceg", "sections", "museum"], museumLinks).map(([key]) => key),
    ["shortForm"],
  );
  assert.equal(isStudioReviewPathRelevant(["pages", "join", "sections", "links", "legacySignupUrl"]), false);
  assert.equal(isStudioReviewPathRelevant(["pages", "ceg", "sections", "museum", "legacyMuseumUrl"]), false);
});

test("Studio recognizes actual link fields without mistaking platform labels for URLs", () => {
  assert.equal(isStudioLinkField("registrationForm"), true);
  assert.equal(isStudioLinkField("calendarEmbedSrc"), true);
  assert.equal(isStudioLinkField("payNGo"), true);
  assert.equal(isStudioLinkField("platform"), false);
  assert.equal(isValidStudioLink("registrationForm", "http://example.com/form"), false);
  assert.equal(isValidStudioLink("registrationForm", "https://example.com/form"), true);
  assert.equal(isValidStudioLink("href", "/join"), true);
  assert.equal(isValidStudioLink("canvaUrl", "https://example.com/design/abc"), false);
  assert.equal(isValidStudioLink("canvaUrl", "https://www.canva.com/design/abc/view"), true);
  assert.equal(isValidStudioLink("canvaUrl", "/about"), false);
  assert.equal(isValidStudioLink("canvaUrl", "#slides"), false);
  assert.equal(isValidStudioLink("canvaUrl", "mailto:officers@example.com"), false);
});

test("Studio keeps gallery presentation fields editable and hides internal fields", () => {
  const photo = {
    src: "/gallery/photo.webp",
    alt: "TSA students at a competition",
    caption: "State conference",
    w: 1200,
    h: 800,
    stickers: ["star"],
    note: "internal layout note",
  };
  const path = ["pages", "gallery", "sections", "scrapbook", 0] as const;

  assert.deepEqual(visibleEditorObjectEntries(path, photo).map(([key]) => key), ["src", "alt", "caption"]);
  assert.equal(isStudioReviewPathRelevant([...path, "w"]), false);
  assert.equal(isStudioReviewPathRelevant([...path, "h"]), false);
  assert.equal(isStudioReviewPathRelevant([...path, "stickers"]), false);
  assert.equal(isStudioReviewPathRelevant([...path, "note"]), false);
  assert.equal(isStudioReviewPathRelevant([...path, "src"]), true);
  assert.equal(isStudioReviewPathRelevant([...path, "alt"]), true);
  assert.equal(isStudioReviewPathRelevant([...path, "caption"]), true);
  assert.equal(isStudioReviewPathRelevant(["pages", "gallery", "sections", "seasons", 0, "id"]), false);
});

test("a fresh seed limits Join and Museum editor shapes while retaining the legacy redirect", () => {
  const seed = createSeedDocument();

  assert.deepEqual(Object.keys(seed.pages.join.sections.links as Record<string, unknown>), ["registrationForm", "payNGo"]);
  assert.deepEqual(Object.keys(seed.pages.ceg.sections.museum as Record<string, unknown>), ["shortForm"]);
  assert.deepEqual(seed.pages.museum.sections, { redirectTo: "/ceg" });
});

test("full-page draft previews and contact directions use edited Studio content", async () => {
  const [bridge, contactPage] = await Promise.all([
    readFile(new URL("../src/components/StudioBridge.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/app/contact/page.tsx", import.meta.url), "utf8"),
  ]);
  const draftFetch = bridge.indexOf('fetch("/api/studio/document")');
  const iframeOnlyInteraction = bridge.indexOf("if (window.parent === window) return;");

  assert.match(bridge, /if \(!preview\) return;/);
  assert.ok(draftFetch >= 0 && iframeOnlyInteraction > draftFetch);
  assert.match(contactPage, /<SchoolMap\s+directionsHref=\{directions\}\s*\/>/);
});

test("document validation rejects cycles, excessive depth, and oversized collections", () => {
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  const withCycle = createSeedDocument();
  withCycle.pages.home.sections.cyclic = cyclic;
  assert.equal(studioDocumentSchema.safeParse(withCycle).success, false);

  let nested: Record<string, unknown> = {};
  const root = nested;
  for (let depth = 0; depth < 14; depth += 1) {
    nested.child = {};
    nested = nested.child as Record<string, unknown>;
  }
  const tooDeep = createSeedDocument();
  tooDeep.pages.home.sections.tooDeep = root;
  assert.equal(studioDocumentSchema.safeParse(tooDeep).success, false);

  const tooMany = createSeedDocument();
  tooMany.pages.home.sections.tooMany = Array.from({ length: 501 }, (_, index) => index);
  assert.equal(studioDocumentSchema.safeParse(tooMany).success, false);
});

test("internal and image URL guards reject browser-normalized external paths", () => {
  assert.equal(isSafeInternalHref("/about"), true);
  assert.equal(isSafeInternalHref("//evil.example"), false);
  assert.equal(isSafeInternalHref("/\\evil.example"), false);
  assert.equal(isSafeInternalHref("/about\nheader"), false);
  assert.equal(isSafeImageSrc("/gallery/team.webp"), true);
  assert.equal(isSafeImageSrc("/api/studio/media/123e4567-e89b-42d3-a456-426614174000"), true);
  assert.equal(isSafeImageSrc("/about"), false);
  assert.equal(isSafeImageSrc("https://evil.example/photo.webp"), false);
});

test("streaming request limits stop chunked bodies before unbounded buffering", async () => {
  const request = new Request("http://localhost/test", {
    method: "POST",
    body: new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2, 3]));
        controller.enqueue(new Uint8Array([4, 5, 6]));
        controller.close();
      },
    }),
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  await assert.rejects(() => readBodyWithLimit(request, 4), RequestBodyTooLargeError);
});

test("the instance throttle is bounded by both attempts and explicit clearing", () => {
  const key = `test:${Date.now()}:${Math.random()}`;
  assert.equal(consumeLoginAttempt(key, 2).allowed, true);
  assert.equal(consumeLoginAttempt(key, 2).allowed, true);
  assert.equal(consumeLoginAttempt(key, 2).allowed, false);
  clearLoginAttempts(key);
  assert.equal(consumeLoginAttempt(key, 2).allowed, true);
  clearLoginAttempts(key);
});

test("the migration preserves publish and restore concurrency/security contracts", async () => {
  const sql = await readFile(new URL("../supabase/migrations/20260718233713_studio_foundation.sql", import.meta.url), "utf8");
  assert.match(sql, /publish_studio_document\(p_expected_lock_version integer\)/);
  assert.match(sql, /draft\.lock_version <> p_expected_lock_version/);
  assert.match(sql, /restore_studio_revision\(p_revision_id uuid, p_expected_lock_version integer\)/);
  assert.match(sql, /Draft before restore/);
  assert.match(sql, /for update/);
  assert.match(sql, /revoke all on function[\s\S]*from public, anon/);
  assert.match(sql, /values \('studio-media', 'studio-media', false/);
});
