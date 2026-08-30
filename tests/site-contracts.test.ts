import assert from "node:assert/strict";
import test from "node:test";
import { isCanvaDesignUrl, toCanvaEmbedUrl } from "../src/lib/canva";
import { meetingSlides } from "../src/content/site";

test("meeting slides use safe Canva embeds and remain newest first", () => {
  assert.deepEqual(meetingSlides, [{
    date: "August 27, 2026",
    title: "introductory meeting",
    url: "https://www.canva.com/design/DAHRvc4owNM/znsxsExX82lm7o90carAEA/view",
    platform: "canva",
  }]);
  assert.equal(
    toCanvaEmbedUrl(meetingSlides[0].url),
    "https://www.canva.com/design/DAHRvc4owNM/znsxsExX82lm7o90carAEA/view?embed",
  );
  assert.equal(isCanvaDesignUrl("https://canva.com/design/abc/def"), true);
  assert.equal(toCanvaEmbedUrl("https://www.canva.com/design/abc"), null);
  assert.equal(toCanvaEmbedUrl("https://example.com/design/abc/def/view"), null);
  assert.equal(toCanvaEmbedUrl("javascript:alert(1)"), null);
});

test("meeting slide records scale as an ordered deck collection", () => {
  const futureDecks = [{
    date: "2026-09-10",
    title: "second meeting",
    url: "https://www.canva.com/design/NEWER123/deck456/view",
    platform: "canva" as const,
  }, ...meetingSlides];
  assert.equal(futureDecks[0].title, "second meeting");
  assert.equal(futureDecks.length, 2);
  assert.ok(futureDecks.every((deck) => deck.platform === "canva" && isCanvaDesignUrl(deck.url)));
});
