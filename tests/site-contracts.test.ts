import assert from "node:assert/strict";
import test from "node:test";
import { isCanvaDesignUrl, toCanvaEmbedUrl } from "../src/lib/canva";
import { meetingSlides } from "../src/content/site";
import { getCountdown } from "../src/lib/countdown";
import { competitionDates } from "../src/content/competitions";

test("countdowns respect Central offsets and exclusive event ends", () => {
  for (const event of competitionDates) {
    const start = Date.parse(event.start);
    const end = Date.parse(event.end);
    assert.deepEqual(getCountdown(event.start, event.end, start - 90061000), {
      status: "upcoming", months: 0, days: 1, hours: 1, minutes: 1, seconds: 1,
    });
    assert.equal(getCountdown(event.start, event.end, start).status, "live");
    assert.equal(getCountdown(event.start, event.end, end - 1).status, "live");
    assert.deepEqual(getCountdown(event.start, event.end, end), {
      status: "complete", months: 0, days: 0, hours: 0, minutes: 0, seconds: 0,
    });
  }
  assert.equal(new Date(competitionDates[0].start).toISOString(), "2027-02-12T06:00:00.000Z");
  assert.equal(new Date(competitionDates[1].start).toISOString(), "2027-03-31T05:00:00.000Z");
});

test("countdown months handle short months, leap years, and year rollover", () => {
  for (const [start, now, months, days] of [
    ["2027-03-31T00:00:00-05:00", "2027-02-28T00:00:00-06:00", 1, 0],
    ["2028-03-31T00:00:00-05:00", "2028-02-29T00:00:00-06:00", 1, 0],
    ["2027-02-12T06:00:00Z", "2026-12-12T06:00:00Z", 2, 0],
    ["2027-02-12T00:00:00-06:00", "2026-09-22T00:00:00-05:00", 4, 20],
  ] as const) {
    const result = getCountdown(start, start, Date.parse(now));
    assert.equal(result.months, months);
    assert.equal(result.days, days);
    assert.equal(result.hours, 0);
  }
});

test("meeting slides use safe Canva embeds and remain newest first", () => {
  assert.deepEqual(meetingSlides, [{
    date: "September 24, 2026",
    title: "third general meeting",
    url: "https://www.canva.com/design/DAHWD5j3hs0/pSARcKqUvsfsx65zzNxlkw/view",
    platform: "canva",
  }, {
    date: "September 10, 2026",
    title: "event walkthrough",
    url: "https://www.canva.com/design/DAHUnf2aaps/lsfQL2f3dB5Hhqa3Y00k0g/view",
    platform: "canva",
  }, {
    date: "August 27, 2026",
    title: "introductory meeting",
    url: "https://www.canva.com/design/DAHRvc4owNM/znsxsExX82lm7o90carAEA/view",
    platform: "canva",
  }]);
  assert.equal(
    toCanvaEmbedUrl(meetingSlides[0].url),
    "https://www.canva.com/design/DAHWD5j3hs0/pSARcKqUvsfsx65zzNxlkw/view?embed",
  );
  assert.equal(isCanvaDesignUrl("https://canva.com/design/abc/def"), true);
  assert.equal(toCanvaEmbedUrl("https://www.canva.com/design/abc"), null);
  assert.equal(toCanvaEmbedUrl("https://example.com/design/abc/def/view"), null);
  assert.equal(toCanvaEmbedUrl("javascript:alert(1)"), null);
});

test("meeting slide records scale as an ordered deck collection", () => {
  const futureDecks = [{
    date: "2026-10-01",
    title: "second meeting",
    url: "https://www.canva.com/design/NEWER123/deck456/view",
    platform: "canva" as const,
  }, ...meetingSlides];
  assert.equal(futureDecks[0].title, "second meeting");
  assert.equal(futureDecks.length, meetingSlides.length + 1);
  assert.ok(futureDecks.every((deck) => deck.platform === "canva" && isCanvaDesignUrl(deck.url)));
});
