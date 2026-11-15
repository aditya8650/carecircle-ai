import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkRateLimit, resetRateLimit, verifyPasscode, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pinOrCode, role } = body;

    if (!pinOrCode || typeof pinOrCode !== "string") {
      return NextResponse.json(
        { error: "Passcode is required." },
        { status: 400 }
      );
    }

    if (role !== "elderly" && role !== "family") {
      return NextResponse.json(
        { error: "Invalid role specified." },
        { status: 400 }
      );
    }

    // Rate Limiting by IP + Role
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const rateLimitKey = `${ip}:${role}`;
    const rateCheck = checkRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed passcode attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
          remainingAttempts: 0,
        },
        { status: 429 }
      );
    }

    // Fetch the primary CareCircle (first record for demo / single patient circle)
    const circle = await prisma.careCircle.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!circle) {
      return NextResponse.json(
        { error: "No patient circle found. Please seed the database." },
        { status: 404 }
      );
    }

    const hashToVerify = role === "elderly" ? circle.elderlyPinHash : circle.familyCodeHash;
    const isValid = await verifyPasscode(pinOrCode.trim(), hashToVerify);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "Incorrect passcode. Please check and try again.",
          remainingAttempts: rateCheck.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Reset rate limit on success
    resetRateLimit(rateLimitKey);

    // Create session token
    const token = createSessionToken({
      circleId: circle.id,
      patientName: circle.patientName,
      role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        circleId: circle.id,
        patientName: circle.patientName,
        patientAge: circle.patientAge,
        role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set("carecircle_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("[Auth Verify Error]", error);
    return NextResponse.json(
      { error: "Internal authentication error." },
      { status: 500 }
    );
  }
}
