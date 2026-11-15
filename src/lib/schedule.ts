/**
 * Helper function to sanitize, deduplicate, and chronologically sort scheduled medication times.
 * e.g. ["20:00", "8:00", "20:00"] -> ["08:00", "20:00"]
 */
export function sanitizeScheduledTimes(input: any): string[] {
  let times: string[] = [];
  if (Array.isArray(input)) {
    times = input;
  } else if (typeof input === "string") {
    times = input.split(",");
  }

  const validTimes = times
    .map((t) => t.trim())
    .filter((t) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t))
    .map((t) => {
      const [h, m] = t.split(":");
      return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
    });

  // Deduplicate and sort chronologically
  return Array.from(new Set(validTimes)).sort();
}
