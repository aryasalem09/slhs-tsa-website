/** end is exclusive, matching Google Calendar's all-day event convention. */
const centralClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

// Represent Central wall-clock fields as UTC fields for calendar arithmetic.
function centralFields(timestamp: number) {
  const parts = Object.fromEntries(centralClock.formatToParts(timestamp).map(({ type, value }) => [type, value]));
  return new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second));
}

function centralInstant(fields: Date) {
  const wallTime = fields.getTime();
  let instant = wallTime;
  // Resolve the Central offset at the anchor, including a DST change between
  // the deadline and the earlier month. Conference anchors are midnight.
  for (let pass = 0; pass < 3; pass += 1) {
    instant += wallTime - centralFields(instant).getTime();
  }
  return instant;
}

export function getCountdown(start: string, end: string, now: number) {
  const startMs = Date.parse(start);
  const endMs = Date.parse(end);
  const status = now >= endMs ? "complete" : now >= startMs ? "live" : "upcoming";
  // Whole calendar months counted backward from the deadline in Central, with
  // short months clamped to their last day. The remainder is elapsed time.
  const deadline = centralFields(startMs);
  const current = centralFields(now);
  let months = status === "upcoming" ? Math.max(0,
    (deadline.getUTCFullYear() - current.getUTCFullYear()) * 12
      + deadline.getUTCMonth() - current.getUTCMonth(),
  ) : 0;
  const subtractMonths = (count: number) => {
    if (count === 0) return startMs;
    const anchor = new Date(deadline);
    anchor.setUTCDate(1);
    anchor.setUTCMonth(anchor.getUTCMonth() - count);
    const lastDay = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 0)).getUTCDate();
    anchor.setUTCDate(Math.min(deadline.getUTCDate(), lastDay));
    return centralInstant(anchor);
  };
  if (months > 0 && subtractMonths(months) < now) months -= 1;
  const seconds = Math.max(0, Math.floor((subtractMonths(months) - now) / 1000));
  return {
    status,
    months,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}
