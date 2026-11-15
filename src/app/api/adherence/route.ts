import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const circle = await prisma.careCircle.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!circle) {
      return NextResponse.json({
        adherenceRate: 100,
        totalTaken: 0,
        totalMissed: 0,
        totalScheduled: 0,
        todaySchedule: [],
        recentLogs: [],
      });
    }

    // 1. Fetch all active medications
    const medications = await prisma.medication.findMany({
      where: { circleId: circle.id, active: true },
    });

    // 2. Fetch past 7 days logs for analytics
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const logs = await prisma.adherenceLog.findMany({
      where: {
        circleId: circle.id,
        scheduledFor: { gte: sevenDaysAgo },
      },
      include: {
        medication: {
          select: { name: true, dosage: true, pillColor: true },
        },
      },
      orderBy: { scheduledFor: "desc" },
    });

    const totalTaken = logs.filter((l) => l.status === "TAKEN").length;
    const totalMissed = logs.filter((l) => l.status === "MISSED").length;
    const totalRecorded = totalTaken + totalMissed;
    const adherenceRate = totalRecorded > 0 ? Math.round((totalTaken / totalRecorded) * 100) : 100;

    // 3. Build today's schedule
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysLogs = await prisma.adherenceLog.findMany({
      where: {
        circleId: circle.id,
        scheduledFor: { gte: startOfToday, lte: endOfToday },
      },
    });

    // Build timeline of doses for today
    const todaySchedule: Array<{
      scheduleId: string;
      medicationId: string;
      name: string;
      dosage: string;
      instructions: string;
      scheduledTime: string;
      pillColor: string;
      status: "PENDING" | "TAKEN" | "MISSED" | "SKIPPED";
      takenAt?: Date | null;
      logId?: string;
    }> = [];

    medications.forEach((med) => {
      let times: string[] = [];
      try {
        times = JSON.parse(med.scheduledTimes);
      } catch {
        times = [med.scheduledTimes];
      }

      times.forEach((timeStr) => {
        // Find existing log for this med and time today
        const matchingLog = todaysLogs.find((l) => {
          if (l.medicationId !== med.id) return false;
          const logDate = new Date(l.scheduledFor);
          const hours = String(logDate.getHours()).padStart(2, "0");
          const minutes = String(logDate.getMinutes()).padStart(2, "0");
          return `${hours}:${minutes}` === timeStr;
        });

        todaySchedule.push({
          scheduleId: `${med.id}_${timeStr}`,
          medicationId: med.id,
          name: med.name,
          dosage: med.dosage,
          instructions: med.instructions,
          scheduledTime: timeStr,
          pillColor: med.pillColor || "blue",
          status: matchingLog ? (matchingLog.status as any) : "PENDING",
          takenAt: matchingLog?.takenAt || null,
          logId: matchingLog?.id,
        });
      });
    });

    // Sort today's schedule chronologically
    todaySchedule.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    return NextResponse.json({
      adherenceRate,
      totalTaken,
      totalMissed,
      totalScheduled: totalRecorded,
      todaySchedule,
      recentLogs: logs.slice(0, 10).map((l) => ({
        id: l.id,
        medicationId: l.medicationId,
        medicationName: l.medication.name,
        dosage: l.medication.dosage,
        scheduledFor: l.scheduledFor.toISOString(),
        status: l.status,
        takenAt: l.takenAt?.toISOString() || null,
        notes: l.notes,
      })),
    });
  } catch (error: unknown) {
    console.error("[Get Adherence Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch adherence data." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicationId, scheduledTime, status = "TAKEN", notes } = body;

    if (!medicationId) {
      return NextResponse.json(
        { error: "Medication ID is required." },
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

    // Determine target scheduled date/time for today
    const now = new Date();
    const targetScheduledDate = new Date(now);

    if (scheduledTime && typeof scheduledTime === "string") {
      const [hours, minutes] = scheduledTime.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        targetScheduledDate.setHours(hours, minutes, 0, 0);
      }
    }

    // Check if a log already exists for this medication and scheduled time today
    const startOfTarget = new Date(targetScheduledDate);
    startOfTarget.setMinutes(startOfTarget.getMinutes() - 30);
    const endOfTarget = new Date(targetScheduledDate);
    endOfTarget.setMinutes(endOfTarget.getMinutes() + 30);

    const existingLog = await prisma.adherenceLog.findFirst({
      where: {
        circleId: circle.id,
        medicationId,
        scheduledFor: {
          gte: startOfTarget,
          lte: endOfTarget,
        },
      },
    });

    let resultLog;

    if (existingLog) {
      resultLog = await prisma.adherenceLog.update({
        where: { id: existingLog.id },
        data: {
          status,
          takenAt: status === "TAKEN" ? new Date() : null,
          notes: notes !== undefined ? notes : existingLog.notes,
        },
      });
    } else {
      resultLog = await prisma.adherenceLog.create({
        data: {
          circleId: circle.id,
          medicationId,
          scheduledFor: targetScheduledDate,
          status,
          takenAt: status === "TAKEN" ? new Date() : null,
          notes: notes || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      log: resultLog,
    });
  } catch (error: unknown) {
    console.error("[Record Adherence Error]", error);
    return NextResponse.json(
      { error: "Failed to record dose adherence." },
      { status: 500 }
    );
  }
}
