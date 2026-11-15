import { describe, it, expect } from "vitest";
import { sanitizeScheduledTimes } from "../src/lib/schedule";

describe("Medication Schedule Validation & Sorting", () => {
  it("sanitizes, pads, deduplicates, and chronologically sorts scheduled times", () => {
    // Unsorted, with duplicates and missing padding:
    const input = ["20:00", "08:00", "8:00", "13:00", "20:00"];
    const sanitized = sanitizeScheduledTimes(input);

    expect(sanitized).toEqual(["08:00", "13:00", "20:00"]);
  });

  it("handles comma-separated string inputs cleanly", () => {
    const inputStr = "21:30, 09:15, 09:15, 14:00";
    const sanitized = sanitizeScheduledTimes(inputStr);

    expect(sanitized).toEqual(["09:15", "14:00", "21:30"]);
  });

  it("filters out invalid 24-hour time formats", () => {
    const invalidInputs = ["25:00", "12:65", "abc", "noon", "8-30", "12:00"];
    const sanitized = sanitizeScheduledTimes(invalidInputs);

    expect(sanitized).toEqual(["12:00"]);
  });
});

describe("Appointment Date Filtering", () => {
  it("accurately categorizes upcoming vs past appointments", () => {
    const now = new Date("2026-11-15T12:00:00Z");

    const appts = [
      { id: "1", doctorName: "Dr. Sharma", dateTime: "2026-11-18T10:00:00Z" }, // upcoming
      { id: "2", doctorName: "Dr. Gupta", dateTime: "2026-11-01T15:00:00Z" },  // past
      { id: "3", doctorName: "Dr. Patel", dateTime: "2026-11-15T16:00:00Z" },  // upcoming (later today)
    ];

    const upcoming = appts.filter((a) => new Date(a.dateTime) >= now);
    const past = appts.filter((a) => new Date(a.dateTime) < now);

    expect(upcoming.map((a) => a.id)).toEqual(["1", "3"]);
    expect(past.map((a) => a.id)).toEqual(["2"]);
  });
});
