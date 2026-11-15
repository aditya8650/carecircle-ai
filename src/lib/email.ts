/**
 * CareCircle AI Email Notification Service
 * 
 * Secure reminder dispatch mechanism supporting:
 * 1. Live Resend API delivery (when RESEND_API_KEY is configured).
 * 2. Verified Simulation / Preview mode (when credentials are not yet set).
 * 
 * SCHEDULING NOTE:
 * Automatic cron-based triggering on Google Cloud Run requires Google Cloud Scheduler
 * targeting the authenticated endpoint `/api/reminders/send?scheduled=true`.
 * Manual on-demand test triggers are supported directly from the Family Dashboard.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  type: "upcoming_dose" | "missed_dose" | "appointment";
}

export interface EmailDispatchResult {
  success: boolean;
  mode: "resend_live" | "simulated_preview";
  message: string;
  recipient: string;
  subject: string;
  timestamp: string;
}

export function buildUpcomingDoseTemplate(patientName: string, medName: string, dosage: string, time: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb; margin-top: 0;">CareCircle AI — Medication Reminder</h2>
      <p style="font-size: 16px; color: #334155;">Hello Caregiver,</p>
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <h3 style="margin: 0 0 10px 0; color: #0f172a;">${patientName} has a scheduled dose</h3>
        <p style="margin: 4px 0;"><strong>Medicine:</strong> ${medName}</p>
        <p style="margin: 4px 0;"><strong>Dosage:</strong> ${dosage}</p>
        <p style="margin: 4px 0;"><strong>Scheduled Time:</strong> ${time}</p>
      </div>
      <p style="color: #64748b; font-size: 14px;">Please remind them or check the CareCircle AI dashboard to confirm adherence.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">This is an automated notification from CareCircle AI (Fictional Demo).</p>
    </div>
  `;
}

export function buildMissedDoseTemplate(patientName: string, medName: string, scheduledTime: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #fecaca; border-radius: 8px; background-color: #fef2f2;">
      <h2 style="color: #dc2626; margin-top: 0;">CareCircle AI — Missed Dose Alert ⚠️</h2>
      <p style="font-size: 16px; color: #7f1d1d;">Attention Caregiver,</p>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #fee2e2; margin: 15px 0;">
        <p style="margin: 4px 0; color: #991b1b;"><strong>Patient:</strong> ${patientName}</p>
        <p style="margin: 4px 0; color: #991b1b;"><strong>Medicine:</strong> ${medName}</p>
        <p style="margin: 4px 0; color: #991b1b;"><strong>Scheduled For:</strong> ${scheduledTime}</p>
        <p style="margin: 8px 0 0 0; color: #b91c1c; font-weight: bold;">Status: Dose was not marked as taken within the grace period.</p>
      </div>
      <p style="color: #991b1b; font-size: 14px;">Please verify with ${patientName} to ensure their safety and medication routine.</p>
      <hr style="border: 0; border-top: 1px solid #fee2e2; margin: 20px 0;" />
      <p style="font-size: 12px; color: #f87171;">CareCircle AI Emergency & Adherence Monitoring System.</p>
    </div>
  `;
}

export function buildAppointmentTemplate(patientName: string, doctorName: string, specialty: string, clinic: string, dateTime: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 8px;">
      <h2 style="color: #0d9488; margin-top: 0;">CareCircle AI — Upcoming Doctor Appointment</h2>
      <p style="font-size: 16px; color: #334155;">Hello,</p>
      <div style="background-color: #f0fdfa; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #ccfbf1;">
        <p style="margin: 4px 0;"><strong>Patient:</strong> ${patientName}</p>
        <p style="margin: 4px 0;"><strong>Doctor:</strong> ${doctorName} (${specialty})</p>
        <p style="margin: 4px 0;"><strong>Clinic / Hospital:</strong> ${clinic}</p>
        <p style="margin: 4px 0;"><strong>Date & Time:</strong> ${dateTime}</p>
      </div>
      <p style="color: #64748b; font-size: 14px;">Remember to bring prior medical reports, prescription cards, and insurance information.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">CareCircle AI Healthcare Assistant.</p>
    </div>
  `;
}

/**
 * Dispatches an email notification.
 * Uses Resend API if RESEND_API_KEY is present; otherwise falls back to a verified simulation.
 */
export async function sendEmailNotification(payload: EmailPayload): Promise<EmailDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "CareCircle AI <onboarding@resend.dev>";
  const timestamp = new Date().toISOString();

  if (apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend API error (${response.status}): ${errorText}`);
      }

      return {
        success: true,
        mode: "resend_live",
        message: `Email successfully delivered to ${payload.to} via Resend API.`,
        recipient: payload.to,
        subject: payload.subject,
        timestamp,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("[Email Dispatch Error]", errorMessage);
      return {
        success: false,
        mode: "resend_live",
        message: `Failed to deliver email: ${errorMessage}`,
        recipient: payload.to,
        subject: payload.subject,
        timestamp,
      };
    }
  }

  // Simulation mode (Credentials not configured yet)
  console.log("===============================================================================");
  console.log(`[SIMULATED EMAIL DISPATCH] Type: ${payload.type}`);
  console.log(`Recipient: ${payload.to}`);
  console.log(`Subject: ${payload.subject}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log("Note: To send real external emails, configure RESEND_API_KEY in .env");
  console.log("===============================================================================");

  return {
    success: true,
    mode: "simulated_preview",
    message: `[Simulated Preview] Notification logged to server console. Configure RESEND_API_KEY to send real emails to ${payload.to}.`,
    recipient: payload.to,
    subject: payload.subject,
    timestamp,
  };
}
