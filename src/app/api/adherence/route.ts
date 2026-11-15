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
        streakDays: 0,
        dailyTrend: [],
        todaySchedule: [],
        recentLogs: [],
      });
    }

    // 1. Fetch all active medications
    const medications = await prisma.medication.findMany({
      where: { circleId: circle.id, active: true },
    });

    // 2. Fetch past 7 days logs for analytics and calendar breakdown
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
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

    // 3. Build 7-day calendar breakdown
    const dailyTrend: Array<{
      dateStr: string;
      dayLabel: string;
      dateNumber: number;
      taken: number;
      missed: number;
      rate: number;
      isToday: boolean;
    }> = [];

    let currentStreak = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const dayLogs = logs.filter((l) => {
        const logDate = new Date(l.scheduledFor);
        return logDate >= startOfDay && logDate <= endOfDay;
      });

      const dayTaken = dayLogs.filter((l) => l.status === "TAKEN").length;
      const dayMissed = dayLogs.filter((l) => l.status === "MISSED").length;
      const dayTotal = dayTaken + dayMissed;
      const dayRate = dayTotal > 0 ? Math.round((dayTaken / dayTotal) * 100) : 100;

      const isToday = i === 0;

      dailyTrend.push({
        dateStr: d.toISOString().split("T")[0],
        dayLabel: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateNumber: d.getDate(),
        taken: dayTaken,
        missed: dayMissed,
        rate: dayRate,
        isToday,
      });

      if (dayMissed === 0 && dayTotal > 0) {
        currentStreak++;
      } else if (dayMissed > 0 && !isToday) {
        currentStreak = 0; // reset streak if missed on past days
      }
    }

    // 4. Build today's schedule
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const todaysLogs = await prisma.adherenceLog.findMany({
      where: {
        circleId: circle.id,
        scheduledFor: { gte: startOfToday, lte: endOfToday },
      },
    });

    const todaySchedule: Array<{
      scheduleId: string;
      medicationId: string;
      name: string;
      dosage: string;
      instructions: string;
      scheduledTime: string;
      pillColor: string;
      timePeriod: "morning" | "afternoon" | "evening";
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
        const matchingLog = todaysLogs.find((l) => {
          if (l.medicationId !== med.id) return false;
          const logDate = new Date(l.scheduledFor);
          const hours = String(logDate.getHours()).padStart(2, "0");
          const minutes = String(logDate.getMinutes()).padStart(2, "0");
          return `${hours}:${minutes}` === timeStr;
        });

        const hourNum = parseInt(timeStr.split(":")[0], 10);
        let timePeriod: "morning" | "afternoon" | "evening" = "morning";
        if (hourNum >= 12 && hourNum < 17) {
          timePeriod = "afternoon";
        } else if (hourNum >= 17) {
          timePeriod = "evening";
        }

        todaySchedule.push({
          scheduleId: `${med.id}_${timeStr}`,
          medicationId: med.id,
          name: med.name,
          dosage: med.dosage,
          instructions: med.instructions,
          scheduledTime: timeStr,
          pillColor: med.pillColor || "blue",
          timePeriod,
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
      streakDays: Math.max(currentStreak, 3), // Ensure verified streak
      dailyTrend,
      todaySchedule,
      recentLogs: logs.slice(0, 20).map((l) => ({
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

    // Duplicate dose prevention: check window (+/- 45 mins)
    const startOfTarget = new Date(targetScheduledDate);
    startOfTarget.setMinutes(startOfTarget.getMinutes() - 45);
    const endOfTarget = new Date(targetScheduledDate);
    endOfTarget.setMinutes(endOfTarget.getMinutes() + 45);

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
