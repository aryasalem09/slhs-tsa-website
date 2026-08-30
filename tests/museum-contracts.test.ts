import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { museumEvents, uteMuseumEvents } from "../src/content/museum";

const ordinalPlacement = /\b(?:(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+place|(?:[1-9]|10)(?:st|nd|rd|th)\s+(?:place|at))\b/i;
const prohibited = /resource|article|discussion|guide|info(?:rmational)?|prompt|tips|finalist|semifinalist|top[- ]?(?:ten|16)|prelim|unplaced|unknown|portfolio/i;

test("museum keeps forty distinct events and only placed project artifacts", () => {
  assert.equal(museumEvents.length, 40);
  assert.equal(new Set(museumEvents.map((event) => event.title)).size, 40);

  for (const event of museumEvents) {
    assert.ok(event.title.trim());
    assert.ok(event.description.trim());
    assert.deepEqual(event.details, []);
    assert.doesNotMatch(event.description, /\[[^\]]*\||https?:\/\//i);

    for (const example of event.examples) {
      assert.match(example.label, ordinalPlacement);
      assert.doesNotMatch(example.label, prohibited);
      assert.ok(example.links.length > 0);
      for (const artifact of example.links) {
        assert.equal(artifact.label, "Project artifact");
        assert.match(artifact.href, /^https?:\/\//);
        assert.doesNotMatch(artifact.href, /reddit/i);
      }
    }
  }

  const serializedExamples = JSON.stringify(museumEvents.flatMap((event) => event.examples));
  assert.doesNotMatch(serializedExamples, /museumContributions|reddit|discussion|tips document|official design problem|portfolio|github\.com\/aarikg|bradykondek|itch\.io/i);
});

test("museum descriptions match the official 2025-2026 CEG overviews", () => {
  const digest = createHash("sha256")
    .update(JSON.stringify(museumEvents.map(({ title, description }) => ({ title, description }))))
    .digest("hex");
  assert.equal(digest, "b312e1e17060a2d921624e590305d52e65f741fc3f3d4678d3348d716f949c4a");
});

test("placed artifacts are not claimed by multiple events", () => {
  const ownerByArtifact = new Map<string, string>();

  for (const event of museumEvents) {
    for (const example of event.examples) {
      for (const artifact of example.links) {
        const url = new URL(artifact.href);
        const canonical = url.hostname === "youtu.be"
          ? `youtube:${url.pathname.split("/").filter(Boolean)[0]}`
          : url.hostname.endsWith("youtube.com") && url.searchParams.get("v")
            ? `youtube:${url.searchParams.get("v")}`
            : `${url.origin}${url.pathname.replace(/\/$/, "")}`;
        const previousOwner = ownerByArtifact.get(canonical);
        assert.ok(!previousOwner || previousOwner === event.title, `${canonical} is claimed by ${previousOwner} and ${event.title}`);
        ownerByArtifact.set(canonical, event.title);
      }
    }
  }
});

test("museum retains the two approved anonymous placed artifacts", () => {
  const videoGame = museumEvents.find((event) => event.title === "Video Game Design");
  const geospatial = museumEvents.find((event) => event.title === "Geospatial Technology");

  assert.deepEqual(videoGame?.examples[0]?.links.map((link) => link.href), [
    "https://play.unity.com/en/games/d660ec69-7851-4d9a-a8ba-6edbbf007e29/build",
    "https://youtu.be/i-aCt2ZPMsM",
  ]);
  assert.equal(videoGame?.examples[0]?.label, "Nationals 2026 Fourth Place");
  assert.equal(geospatial?.examples[0]?.label, "Texas TSA State 2026 Fourth Place");
  assert.equal(geospatial?.examples[0]?.links.length, 1);
});

test("UTE museum examples hide submitter attribution", () => {
  assert.equal(uteMuseumEvents.length, 6);
  assert.equal(new Set(uteMuseumEvents.map((event) => event.title)).size, 6);

  const serialized = JSON.stringify(uteMuseumEvents);
  assert.doesNotMatch(serialized, /\bby\s*:|participant\s*id|student\s*id|instagram|drive\.google|docs\.google|HP\d{4,}/i);

  const examples = uteMuseumEvents.flatMap((event) => event.examples);
  const links = examples.flatMap((example) => example.links);
  const localLinks = links.filter((link) => link.href.startsWith("/"));
  const externalLinks = links.filter((link) => !link.href.startsWith("/"));

  assert.equal(links.length, 6);
  assert.equal(localLinks.length, 5);
  assert.deepEqual(externalLinks.map((link) => link.href), ["https://youtu.be/e23x7KhdSfM"]);

  for (const artifact of localLinks) {
    assert.match(artifact.href, /^\/museum\/ute\/[a-z0-9-]+\.pdf$/);
    assert.equal(existsSync(resolve("public", artifact.href.slice(1))), true, `${artifact.href} must exist`);
  }
});
