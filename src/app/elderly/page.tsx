"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/common/Navbar";
import { DoseCard } from "@/components/elderly/DoseCard";
import { useI18n } from "@/lib/i18n/context";
import {
  Heart,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

interface ScheduleItem {
  scheduleId: string;
  medicationId: string;
  name: string;
  dosage: string;
  instructions: string;
  scheduledTime: string;
  pillColor: string;
  timePeriod: "morning" | "afternoon" | "evening";
  status: "PENDING" | "TAKEN" | "MISSED" | "SKIPPED";
  takenAt?: string | null;
}

interface AppointmentItem {
  id: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  dateTime: string;
  notes?: string;
}

export default function ElderlyDashboard() {
  const { t } = useI18n();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  // Live digital clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [adherenceRes, apptsRes] = await Promise.all([
        fetch("/api/adherence"),
        fetch("/api/appointments"),
      ]);

      if (adherenceRes.ok) {
        const data = await adherenceRes.json();
        setSchedule(data.todaySchedule || []);
      }

      if (apptsRes.ok) {
        const apptData = await apptsRes.json();
        setAppointments(apptData.appointments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Find next pending dose
  const nextPendingDose = schedule.find((s) => s.status === "PENDING");
  const completedDoses = schedule.filter((s) => s.status === "TAKEN").length;

  // Upcoming appointment within next 7 days
  const nextAppt = appointments.length > 0 ? appointments[0] : null;

  // Group medications by time of day
  const morningMeds = schedule.filter((s) => s.timePeriod === "morning");
  const afternoonMeds = schedule.filter((s) => s.timePeriod === "afternoon");
  const eveningMeds = schedule.filter((s) => s.timePeriod === "evening");

  return (
    <div className="min-h-screen bg-clinical-canvas flex flex-col font-sans">
      <Navbar currentRole="elderly" patientName="Ramesh Patel" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
        {/* Top Elderly Header: Large Greeting & Digital Clock */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200/90 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-900 font-extrabold text-xs mb-2.5 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.elderlyGreeting}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t.todaysMeds}
            </h1>
            <p className="text-base sm:text-lg font-bold text-slate-500 mt-1">
              {currentDate}
            </p>
          </div>

          <div className="flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
            <span className="text-[11px] uppercase font-black tracking-widest text-slate-400">
              Current Time
            </span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-700 font-mono tracking-tight">
              {currentTime}
            </div>
          </div>
        </div>

        {/* Doctor Appointment Notice Card (if any upcoming) */}
        {nextAppt && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-teal-50/80 border-2 border-teal-300 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-900">
                {t.doctorApptBanner}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {nextAppt.doctorName} ({nextAppt.specialty})
              </h2>
              <p className="text-sm sm:text-base font-bold text-teal-900 mt-0.5">
                🏥 {nextAppt.clinic} —{" "}
                {new Date(nextAppt.dateTime).toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Progress Summary Strip */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span className="text-base sm:text-lg font-black text-slate-800">
              Today's Confirmed Doses:
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
            {completedDoses} / {schedule.length}
          </span>
        </div>

        {/* Next Dose Hero Card (Highlight if pending) */}
        {nextPendingDose && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
              <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                {t.nextDoseNow}
              </h2>
            </div>
            <DoseCard
              key={nextPendingDose.scheduleId}
              scheduleId={nextPendingDose.scheduleId}
              medicationId={nextPendingDose.medicationId}
              name={nextPendingDose.name}
              dosage={nextPendingDose.dosage}
              instructions={nextPendingDose.instructions}
              scheduledTime={nextPendingDose.scheduledTime}
              pillColor={nextPendingDose.pillColor}
              status={nextPendingDose.status}
              takenAt={nextPendingDose.takenAt}
              onDoseLogged={fetchData}
              isHero={true}
            />
          </div>
        )}

        {/* Medication Schedule Grouped Chronologically by Morning, Afternoon, Evening */}
        <div className="space-y-8">
          {isLoading ? (
            <div className="text-center py-16 text-slate-400 font-bold text-lg">
              Loading medication timeline...
            </div>
          ) : schedule.length === 0 ? (
            <div className="text-center py-14 rounded-3xl bg-white border border-slate-200 text-slate-500 font-bold text-lg">
              {t.noUpcomingDose}
            </div>
          ) : (
            <>
              {/* Morning Group */}
              {morningMeds.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      {t.morningMeds}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {morningMeds.map((item) => (
                      <DoseCard
                        key={item.scheduleId}
                        scheduleId={item.scheduleId}
                        medicationId={item.medicationId}
                        name={item.name}
                        dosage={item.dosage}
                        instructions={item.instructions}
                        scheduledTime={item.scheduledTime}
                        pillColor={item.pillColor}
                        status={item.status}
                        takenAt={item.takenAt}
                        onDoseLogged={fetchData}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Afternoon Group */}
              {afternoonMeds.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Sunset className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      {t.afternoonMeds}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {afternoonMeds.map((item) => (
                      <DoseCard
                        key={item.scheduleId}
                        scheduleId={item.scheduleId}
                        medicationId={item.medicationId}
                        name={item.name}
                        dosage={item.dosage}
                        instructions={item.instructions}
                        scheduledTime={item.scheduledTime}
                        pillColor={item.pillColor}
                        status={item.status}
                        takenAt={item.takenAt}
                        onDoseLogged={fetchData}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Evening Group */}
              {eveningMeds.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                      {t.eveningMeds}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {eveningMeds.map((item) => (
                      <DoseCard
                        key={item.scheduleId}
                        scheduleId={item.scheduleId}
                        medicationId={item.medicationId}
                        name={item.name}
                        dosage={item.dosage}
                        instructions={item.instructions}
                        scheduledTime={item.scheduledTime}
                        pillColor={item.pillColor}
                        status={item.status}
                        takenAt={item.takenAt}
                        onDoseLogged={fetchData}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Caregiver Assistance / Demo Emergency Contact (Non-callable placeholder) */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {t.emergencyTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {t.emergencyContactLabel}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {t.emergencyNotice}
              </p>
            </div>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold shrink-0">
            Caretaker Notified on Missed Doses
          </div>
        </div>
      </main>
    </div>
  );
}
