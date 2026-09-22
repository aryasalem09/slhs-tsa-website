/**
 * Verified September 21, 2026 against the public competition calendar embedded
 * on /calendar. All-day DTEND values are exclusive; offsets are America/Chicago.
 * Update these records if the chapter calendar changes; this is not a live sync.
 * Source: https://calendar.google.com/calendar/ical/8044e825ef3d21ef7f04e40477114ffc036233bf224a7a77422f234e9e5bb3ce%40group.calendar.google.com/public/basic.ics
 */
export const competitionDates = [
  {
    id: "regionals-2027",
    name: "Regionals",
    start: "2027-02-12T00:00:00-06:00",
    end: "2027-02-14T00:00:00-06:00",
    dateLabel: "February 12–13, 2027",
  },
  {
    id: "state-2027",
    name: "Texas TSA State",
    start: "2027-03-31T00:00:00-05:00",
    end: "2027-04-04T00:00:00-05:00",
    dateLabel: "March 31–April 3, 2027",
  },
] as const;
