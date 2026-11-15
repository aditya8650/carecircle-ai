import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SessionUser, Role } from "@/types";

const JWT_SECRET = process.env.SESSION_SECRET || "carecircle-super-secret-jwt-key-hackathon-2026";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// In-memory rate limiting map for passcode verification attempts:
// Key: `${ipOrIdentifier}:${role}` -> { count: number, resetAt: number }
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout window

/**
 * Validates and limits passcode verification attempts.
 * Returns { allowed: boolean, remainingAttempts: number, retryAfterSeconds?: number }
 */
export function checkRateLimit(key: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  record.count += 1;
  rateLimitMap.set(key, record);
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.count };
}

/**
 * Resets rate limit for a key upon successful passcode verification.
 */
export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}

/**
 * Hashes a plaintext passcode/PIN with bcrypt (salt 10).
 */
export async function hashPasscode(passcode: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(passcode, salt);
}

/**
 * Compares plaintext passcode with stored bcrypt hash.
 */
export async function verifyPasscode(passcode: string, hash: string): Promise<boolean> {
  return bcrypt.compare(passcode, hash);
}

/**
 * Creates a signed JWT session token.
 */
export function createSessionToken(user: SessionUser): string {
  return jwt.sign(
    {
      circleId: user.circleId,
      patientName: user.patientName,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_MAX_AGE_SECONDS }
  );
}

/**
 * Verifies a JWT session token and returns decoded session payload or null.
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    if (decoded && decoded.circleId && decoded.role) {
      return {
        circleId: decoded.circleId,
        patientName: decoded.patientName,
        role: decoded.role as Role,
      };
    }
    return null;
  } catch {
    return null;
  }
}
