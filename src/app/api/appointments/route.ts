import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const circle = await prisma.careCircle.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!circle) {
      return NextResponse.json({ appointments: [] });
    }

    const appointments = await prisma.appointment.findMany({
      where: { circleId: circle.id },
      orderBy: { dateTime: "asc" },
    });

    return NextResponse.json({ appointments });
  } catch (error: unknown) {
    console.error("[Get Appointments Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorName, specialty, clinic, dateTime, notes } = body;

    if (!doctorName || !clinic || !dateTime) {
      return NextResponse.json(
        { error: "Doctor name, clinic, and date/time are required." },
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

    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format." },
        { status: 400 }
      );
    }

    const newAppt = await prisma.appointment.create({
      data: {
        circleId: circle.id,
        doctorName: doctorName.trim(),
        specialty: (specialty || "General Medicine").trim(),
        clinic: clinic.trim(),
        dateTime: parsedDate,
        notes: (notes || "").trim(),
        reminderSent: false,
      },
    });

    return NextResponse.json({
      success: true,
      appointment: newAppt,
    });
  } catch (error: unknown) {
    console.error("[Create Appointment Error]", error);
    return NextResponse.json(
      { error: "Failed to schedule appointment." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is required." },
        { status: 400 }
      );
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Appointment removed." });
  } catch (error: unknown) {
    console.error("[Delete Appointment Error]", error);
    return NextResponse.json(
      { error: "Failed to delete appointment." },
      { status: 500 }
    );
  }
}
