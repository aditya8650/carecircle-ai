import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sanitizeScheduledTimes } from "@/lib/schedule";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, dosage, instructions, scheduledTimes, pillColor, active } = body;

    const existing = await prisma.medication.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Medication not found." },
        { status: 404 }
      );
    }

    let validatedTimes: string[] | undefined;
    if (scheduledTimes !== undefined) {
      validatedTimes = sanitizeScheduledTimes(scheduledTimes);
      if (validatedTimes.length === 0) {
        return NextResponse.json(
          { error: "At least one valid scheduled time (HH:MM in 24h format) is required." },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.medication.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(dosage && { dosage: dosage.trim() }),
        ...(instructions !== undefined && { instructions: instructions.trim() }),
        ...(validatedTimes && { scheduledTimes: JSON.stringify(validatedTimes) }),
        ...(pillColor && { pillColor }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    return NextResponse.json({
      success: true,
      medication: {
        ...updated,
        scheduledTimes: validatedTimes || JSON.parse(updated.scheduledTimes),
      },
    });
  } catch (error: unknown) {
    console.error("[Update Medication Error]", error);
    return NextResponse.json(
      { error: "Failed to update medication." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const existing = await prisma.medication.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Medication not found." },
        { status: 404 }
      );
    }

    await prisma.medication.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Medication removed." });
  } catch (error: unknown) {
    console.error("[Delete Medication Error]", error);
    return NextResponse.json(
      { error: "Failed to delete medication." },
      { status: 500 }
    );
  }
}
