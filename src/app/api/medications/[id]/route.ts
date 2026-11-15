import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

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

    const timesArray = Array.isArray(scheduledTimes)
      ? scheduledTimes
      : scheduledTimes ? [scheduledTimes] : JSON.parse(existing.scheduledTimes);

    const updated = await prisma.medication.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(dosage && { dosage: dosage.trim() }),
        ...(instructions !== undefined && { instructions: instructions.trim() }),
        ...(scheduledTimes !== undefined && { scheduledTimes: JSON.stringify(timesArray) }),
        ...(pillColor && { pillColor }),
        ...(active !== undefined && { active: Boolean(active) }),
      },
    });

    return NextResponse.json({
      success: true,
      medication: {
        ...updated,
        scheduledTimes: timesArray,
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

    // Soft delete by marking inactive or cascade delete
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
