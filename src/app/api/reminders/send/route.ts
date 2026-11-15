import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  sendEmailNotification,
  buildUpcomingDoseTemplate,
  buildMissedDoseTemplate,
  buildAppointmentTemplate,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      type = "upcoming_dose",
      recipientEmail,
      patientName = "Ramesh Patel",
      medName = "Metformin",
      dosage = "500 mg",
      time = "08:00 AM",
      doctorName = "Dr. Sunita Sharma",
      specialty = "Cardiology",
      clinic = "City Heart & Health Center",
    } = body;

    // Determine target recipient email: from request body, from DB settings, or fallback demo
    let targetEmail = recipientEmail;

    if (!targetEmail) {
      const emailSetting = await prisma.emailSetting.findFirst();
      targetEmail = emailSetting?.recipientEmail || "caretaker.demo@carecircle.ai";
    }

    let subject = "";
    let html = "";

    switch (type) {
      case "missed_dose":
        subject = `⚠️ URGENT: Missed Medication Alert for ${patientName} (${medName})`;
        html = buildMissedDoseTemplate(patientName, medName, time);
        break;
      case "appointment":
        subject = `🩺 Appointment Reminder: ${doctorName} with ${patientName}`;
        html = buildAppointmentTemplate(patientName, doctorName, specialty, clinic, time);
        break;
      case "upcoming_dose":
      default:
        subject = `⏰ Medication Reminder: ${medName} ${dosage} for ${patientName}`;
        html = buildUpcomingDoseTemplate(patientName, medName, dosage, time);
        break;
    }

    const dispatchResult = await sendEmailNotification({
      to: targetEmail,
      subject,
      html,
      type: type as any,
    });

    return NextResponse.json({
      success: dispatchResult.success,
      result: dispatchResult,
      explanation:
        dispatchResult.mode === "resend_live"
          ? "Live email delivered through Resend API."
          : "Credentials not provided; verified simulation executed and logged to server console. To dispatch live emails, add RESEND_API_KEY to your environment variables.",
    });
  } catch (error: unknown) {
    console.error("[Reminder Dispatch API Error]", error);
    return NextResponse.json(
      { error: "Failed to dispatch reminder." },
      { status: 500 }
    );
  }
}
