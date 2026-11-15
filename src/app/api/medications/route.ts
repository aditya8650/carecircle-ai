import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sanitizeScheduledTimes } from "@/lib/schedule";

export async function GET() {
  try {
    const circle = await prisma.careCircle.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!circle) {
      return NextResponse.json({ medications: [] });
    }

    const meds = await prisma.medication.findMany({
      where: { circleId: circle.id, active: true },
      orderBy: { createdAt: "asc" },
    });

    const formattedMeds = meds.map((m) => {
      let times: string[] = [];
      try {
        times = JSON.parse(m.scheduledTimes);
      } catch {
        times = [m.scheduledTimes];
      }
      return {
        ...m,
        scheduledTimes: times,
      };
    });

    return NextResponse.json({
      circle: {
        id: circle.id,
        patientName: circle.patientName,
        patientAge: circle.patientAge,
        emergencyContact: circle.emergencyContact,
      },
      medications: formattedMeds,
    });
  } catch (error: unknown) {
    console.error("[Get Medications Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch medications." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, dosage, instructions, scheduledTimes, pillColor } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Medication name is required." },
        { status: 400 }
      );
    }

    if (!dosage || typeof dosage !== "string" || !dosage.trim()) {
      return NextResponse.json(
        { error: "Dosage is required (e.g., 500 mg, 1 tablet)." },
        { status: 400 }
      );
    }

    const validatedTimes = sanitizeScheduledTimes(scheduledTimes);
    if (validatedTimes.length === 0) {
      return NextResponse.json(
        { error: "At least one valid scheduled time (HH:MM in 24h format) is required." },
        { status: 400 }
      );
    }

    const circle = await prisma.careCircle.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!circle) {
      return NextResponse.json(
        { error: "No active patient circle found." },
        { status: 404 }
      );
    }

    const newMed = await prisma.medication.create({
      data: {
        circleId: circle.id,
        name: name.trim(),
        dosage: dosage.trim(),
        instructions: (instructions || "").trim(),
        scheduledTimes: JSON.stringify(validatedTimes),
        pillColor: pillColor || "blue",
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      medication: {
        ...newMed,
        scheduledTimes: validatedTimes,
      },
    });
  } catch (error: unknown) {
    console.error("[Create Medication Error]", error);
    return NextResponse.json(
      { error: "Failed to create medication." },
      { status: 500 }
    );
  }
}
