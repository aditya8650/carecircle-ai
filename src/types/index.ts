export type DoseStatus = "TAKEN" | "MISSED" | "SKIPPED";

export interface CareCircleInfo {
  id: string;
  patientName: string;
  patientAge: number;
  emergencyContact?: string | null;
}

export interface MedicationItem {
  id: string;
  circleId: string;
  name: string;
  dosage: string;
  instructions: string;
  scheduledTimes: string[]; // parsed from JSON array
  pillColor: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdherenceLogItem {
  id: string;
  circleId: string;
  medicationId: string;
  medicationName?: string;
  dosage?: string;
  scheduledFor: string;
  status: DoseStatus;
  takenAt?: string | null;
  notes?: string | null;
}

export interface AppointmentItem {
  id: string;
  circleId: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  dateTime: string;
  notes?: string | null;
  reminderSent: boolean;
}

export interface EmailSettingsItem {
  recipientEmail: string;
  notifyOnMissed: boolean;
  notifyOnUpcoming: boolean;
  notifyOnAppt: boolean;
}

export type Role = "elderly" | "family";

export interface SessionUser {
  circleId: string;
  patientName: string;
  role: Role;
}
