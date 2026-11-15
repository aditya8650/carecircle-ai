import { describe, it, expect, beforeEach } from "vitest";
import {
  hashPasscode,
  verifyPasscode,
  checkRateLimit,
  resetRateLimit,
  createSessionToken,
  verifySessionToken,
} from "../src/lib/auth";

describe("CareCircle AI Auth & Security", () => {
  beforeEach(() => {
    resetRateLimit("test-ip:elderly");
    resetRateLimit("test-ip:family");
  });

  it("should securely hash passcodes with bcrypt and verify them", async () => {
    const rawPin = "1234";
    const hashed = await hashPasscode(rawPin);

    // Hash must not equal the raw PIN (never store plaintext)
    expect(hashed).not.toBe(rawPin);
    expect(hashed.startsWith("$2a$") || hashed.startsWith("$2b$")).toBe(true);

    // Correct verification
    const isMatch = await verifyPasscode(rawPin, hashed);
    expect(isMatch).toBe(true);

    // Incorrect verification
    const isWrong = await verifyPasscode("9999", hashed);
    expect(isWrong).toBe(false);
  });

  it("should enforce rate limiting after 5 consecutive failed attempts", () => {
    const key = "test-ip:elderly";

    // First 5 attempts are allowed
    for (let i = 1; i <= 5; i++) {
      const res = checkRateLimit(key);
      expect(res.allowed).toBe(true);
      expect(res.remainingAttempts).toBe(5 - i);
    }

    // 6th attempt is blocked
    const blockedRes = checkRateLimit(key);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remainingAttempts).toBe(0);
    expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("should reset rate limit when explicitly instructed", () => {
    const key = "test-ip:elderly";
    checkRateLimit(key);
    checkRateLimit(key);
    resetRateLimit(key);

    const freshRes = checkRateLimit(key);
    expect(freshRes.allowed).toBe(true);
    expect(freshRes.remainingAttempts).toBe(4);
  });

  it("should generate and verify JWT session tokens", () => {
    const sessionPayload = {
      circleId: "test-circle-123",
      patientName: "Ramesh Patel",
      role: "elderly" as const,
    };

    const token = createSessionToken(sessionPayload);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const decoded = verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.circleId).toBe("test-circle-123");
    expect(decoded?.patientName).toBe("Ramesh Patel");
    expect(decoded?.role).toBe("elderly");

    // Invalid token returns null
    const invalid = verifySessionToken("invalid.corrupted.token");
    expect(invalid).toBeNull();
  });
});
