import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("carecircle_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const circle = await prisma.careCircle.findUnique({
      where: { id: session.circleId },
      select: {
        id: true,
        patientName: true,
        patientAge: true,
        emergencyContact: true,
      },
    });

    if (!circle) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        circleId: circle.id,
        patientName: circle.patientName,
        patientAge: circle.patientAge,
        emergencyContact: circle.emergencyContact,
        role: session.role,
      },
    });
  } catch (error: unknown) {
    console.error("[Session Check Error]", error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function POST() {
  // Logout endpoint
  const response = NextResponse.json({ success: true, message: "Logged out." });
  response.cookies.delete("carecircle_session");
  return response;
}
