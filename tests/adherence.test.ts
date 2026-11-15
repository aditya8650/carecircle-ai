import { describe, it, expect } from "vitest";

export function calculateAdherenceRate(taken: number, missed: number): number {
  const total = taken + missed;
  if (total === 0) return 100;
  return Math.round((taken / total) * 100);
}

export function determineDoseStatus(scheduledTimeStr: string, currentTime: Date): "UPCOMING" | "DUE_NOW" | "PAST" {
  const [hours, minutes] = scheduledTimeStr.split(":").map(Number);
  const scheduled = new Date(currentTime);
  scheduled.setHours(hours, minutes, 0, 0);

  const diffMinutes = (scheduled.getTime() - currentTime.getTime()) / (1000 * 60);

  if (diffMinutes > 60) return "UPCOMING";
  if (diffMinutes >= -60 && diffMinutes <= 60) return "DUE_NOW";
  return "PAST";
}

describe("CareCircle AI Adherence & Scheduling Logic", () => {
  it("calculates 100% adherence when no missed doses exist", () => {
    expect(calculateAdherenceRate(5, 0)).toBe(100);
    expect(calculateAdherenceRate(0, 0)).toBe(100);
  });

  it("calculates exact adherence percentage correctly", () => {
    // 8 taken out of 10 total = 80%
    expect(calculateAdherenceRate(8, 2)).toBe(80);

    // 14 taken out of 15 total = 93%
    expect(calculateAdherenceRate(14, 1)).toBe(93);

    // 0 taken out of 5 total = 0%
    expect(calculateAdherenceRate(0, 5)).toBe(0);
  });

  it("identifies when a dose is due now within 1-hour window", () => {
    // Construct local date time (8:15 AM)
    const fixedNow = new Date(2026, 10, 15, 8, 15, 0);

    // 08:00 is within 15 mins -> DUE_NOW
    expect(determineDoseStatus("08:00", fixedNow)).toBe("DUE_NOW");

    // 08:45 is within 30 mins ahead -> DUE_NOW
    expect(determineDoseStatus("08:45", fixedNow)).toBe("DUE_NOW");

    // 21:00 is hours ahead -> UPCOMING
    expect(determineDoseStatus("21:00", fixedNow)).toBe("UPCOMING");

    // 05:00 was hours ago -> PAST
    expect(determineDoseStatus("05:00", fixedNow)).toBe("PAST");
  });
});
