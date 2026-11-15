"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdherenceChart } from "@/components/family/AdherenceChart";
import { MedicationModal } from "@/components/family/MedicationModal";
import { AppointmentModal } from "@/components/family/AppointmentModal";
import { useI18n } from "@/lib/i18n/context";
import {
  Activity,
  Pill,
  Calendar,
  Bell,
  Plus,
  Trash2,
  Edit2,
  Send,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Info,
  HeartHandshake,
  LogOut,
  Languages,
  UserCheck,
  Flame,
  ChevronRight,
  Stethoscope,
} from "lucide-react";

export default function FamilyDashboard() {
  const { language, setLanguage, t } = useI18n();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "medications" | "appointments" | "alerts">("overview");

  // State
  const [adherenceData, setAdherenceData] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [medSearch, setMedSearch] = useState("");
  const [medTimeFilter, setMedTimeFilter] = useState<"all" | "morning" | "afternoon" | "evening">("all");
  const [apptFilter, setApptFilter] = useState<"upcoming" | "past">("upcoming");

  // Modals
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<any | null>(null);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<any | null>(null);

  // Email test state
  const [testEmail, setTestEmail] = useState("caretaker.demo@carecircle.ai");
  const [emailAlertResult, setEmailAlertResult] = useState<any | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [adhRes, medsRes, apptsRes] = await Promise.all([
        fetch("/api/adherence"),
        fetch("/api/medications"),
        fetch("/api/appointments"),
      ]);

      if (adhRes.ok) {
        const adh = await adhRes.json();
        setAdherenceData(adh);
      }
      if (medsRes.ok) {
        const meds = await medsRes.json();
        setMedications(meds.medications || []);
      }
      if (apptsRes.ok) {
        const appts = await apptsRes.json();
        setAppointments(appts.appointments || []);
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/session", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    router.push("/");
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en");
  };

  // Handle Delete Medication
  const handleDeleteMed = async (id: string) => {
    if (!confirm("Are you sure you want to remove this medication schedule?")) return;
    try {
      await fetch(`/api/medications/${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Delete Appointment
  const handleDeleteAppt = async (id: string) => {
    if (!confirm("Are you sure you want to remove this scheduled appointment?")) return;
    try {
      await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Trigger Test Email
  const handleSendTestEmail = async (type: "upcoming_dose" | "missed_dose" | "appointment") => {
    setIsSendingEmail(true);
    setEmailAlertResult(null);
    try {
      const res = await fetch("/api/reminders/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          recipientEmail: testEmail,
          patientName: "Ramesh Patel",
          medName: "Metformin",
          dosage: "500 mg",
          time: "08:00 AM",
          doctorName: "Dr. Sunita Sharma",
          specialty: "Cardiology",
          clinic: "City Heart & Health Center",
        }),
      });

      const data = await res.json();
      setEmailAlertResult(data);
    } catch (err: unknown) {
      setEmailAlertResult({
        success: false,
        explanation: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Filter Medications by Search & Time
  const filteredMeds = medications.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(medSearch.toLowerCase()) ||
      (m.instructions && m.instructions.toLowerCase().includes(medSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (medTimeFilter === "all") return true;

    const times: string[] = m.scheduledTimes || [];
    return times.some((t) => {
      const hour = parseInt(t.split(":")[0], 10);
      if (medTimeFilter === "morning") return hour >= 6 && hour < 12;
      if (medTimeFilter === "afternoon") return hour >= 12 && hour < 17;
      if (medTimeFilter === "evening") return hour >= 17;
      return true;
    });
  });

  // Filter Appointments by Upcoming vs Past
  const now = new Date();
  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.dateTime);
    return apptFilter === "upcoming" ? apptDate >= now : apptDate < now;
  });

  return (
    <div className="min-h-screen bg-clinical-canvas flex flex-col md:flex-row font-sans">
      {/* Left Clinical Command Sidebar */}
      <aside className="w-full md:w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 shadow-2xs z-30">
        <div>
          {/* Brand Mark */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                  CareCircle<span className="text-emerald-700"> AI</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Command Center
                </span>
              </div>
            </Link>
          </div>

          {/* Patient Profile Card in Sidebar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                RP
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-slate-900 text-sm">Ramesh Patel</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">Age 72 • Male</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-bold">
                Type 2 Diabetes
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-bold">
                Hypertension
              </span>
            </div>
          </div>

          {/* Navigation Rails */}
          <nav className="p-4 space-y-1.5" aria-label="Command Center Navigation">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeTab === "overview"
                  ? "bg-emerald-700 text-white shadow-xs font-black"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4" />
                <span>Adherence Analytics</span>
              </div>
              {adherenceData && (
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    activeTab === "overview" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {adherenceData.adherenceRate}%
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("medications")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeTab === "medications"
                  ? "bg-emerald-700 text-white shadow-xs font-black"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Pill className="w-4 h-4" />
                <span>Medications</span>
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "medications" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {medications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("appointments")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeTab === "appointments"
                  ? "bg-emerald-700 text-white shadow-xs font-black"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" />
                <span>Doctor Appointments</span>
              </div>
              <span
                className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  activeTab === "appointments" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {appointments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("alerts")}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                activeTab === "alerts"
                  ? "bg-emerald-700 text-white shadow-xs font-black"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notification Engine</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/40">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>Language:</span>
            </div>
            <span className="text-emerald-700 font-black">{language === "en" ? "हिन्दी" : "English"}</span>
          </button>

          {/* Switch Mode / Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Clinical Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Patient Medical Portal
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                Live Audit Active
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === "overview" && "Patient Adherence & Compliance Overview"}
              {activeTab === "medications" && "Medication Prescriptions & Daily Schedule"}
              {activeTab === "appointments" && "Clinical Follow-ups & Specialist Appointments"}
              {activeTab === "alerts" && "Transactional Notification Engine & Simulator"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setEditingMed(null);
                setIsMedModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addMedicationBtn}</span>
            </button>
            <button
              onClick={() => {
                setEditingAppt(null);
                setIsApptModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addAppointmentBtn}</span>
            </button>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tab 1: Adherence Analytics Overview */}
          {activeTab === "overview" && (
            <div>
              {isLoading ? (
                <div className="text-center py-20 text-slate-400 font-bold text-sm">
                  Loading adherence metrics...
                </div>
              ) : adherenceData ? (
                <AdherenceChart
                  adherenceRate={adherenceData.adherenceRate}
                  totalTaken={adherenceData.totalTaken}
                  totalMissed={adherenceData.totalMissed}
                  totalScheduled={adherenceData.totalScheduled}
                  streakDays={adherenceData.streakDays || 5}
                  dailyTrend={adherenceData.dailyTrend || []}
                  recentLogs={adherenceData.recentLogs || []}
                />
              ) : null}
            </div>
          )}

          {/* Tab 2: Medications CRUD with Search & Filters */}
          {activeTab === "medications" && (
            <div className="space-y-6">
              {/* Search and Time Filters */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={medSearch}
                    onChange={(e) => setMedSearch(e.target.value)}
                    placeholder={t.searchMedsPlaceholder}
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none font-medium"
                  />
                </div>

                {/* Time filter chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(["all", "morning", "afternoon", "evening"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setMedTimeFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                        medTimeFilter === filter
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {filter === "all"
                        ? t.filterAll
                        : filter === "morning"
                        ? t.filterMorning
                        : filter === "afternoon"
                        ? t.filterAfternoon
                        : t.filterEvening}
                    </button>
                  ))}
                </div>
              </div>

              {filteredMeds.length === 0 ? (
                <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 text-slate-400 font-bold text-sm">
                  No medications matched your filter.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredMeds.map((med) => (
                    <div
                      key={med.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 ${
                                med.pillColor === "red"
                                  ? "bg-rose-500"
                                  : med.pillColor === "green"
                                  ? "bg-emerald-600"
                                  : med.pillColor === "yellow"
                                  ? "bg-amber-400 text-slate-900"
                                  : med.pillColor === "purple"
                                  ? "bg-purple-500"
                                  : "bg-blue-600"
                              }`}
                            >
                              <Pill className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-black text-slate-900">
                                {med.name}
                              </h3>
                              <p className="text-xs font-bold text-emerald-700">
                                {med.dosage}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingMed(med);
                                setIsMedModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                              title={t.editMedicationBtn}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMed(med.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title={t.deleteMedicationBtn}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Scheduled Times */}
                        <div className="mb-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Times:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(med.scheduledTimes || []).map((time: string) => (
                              <span
                                key={time}
                                className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-slate-700 flex items-center gap-1"
                              >
                                <Clock className="w-3 h-3 text-emerald-600" />
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Instructions */}
                        {med.instructions && (
                          <p className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            💡 {med.instructions}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Appointments with Filters & Edit */}
          {activeTab === "appointments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setApptFilter("upcoming")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      apptFilter === "upcoming"
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.filterUpcoming}
                  </button>
                  <button
                    onClick={() => setApptFilter("past")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      apptFilter === "past"
                        ? "bg-teal-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.filterPast}
                  </button>
                </div>

                <button
                  onClick={() => {
                    setEditingAppt(null);
                    setIsApptModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addAppointmentBtn}</span>
                </button>
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 text-slate-400 font-bold text-sm">
                  {t.noAppts}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                              <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-lg font-black text-slate-900">
                                {appt.doctorName}
                              </h3>
                              <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                                {appt.specialty}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingAppt(appt);
                                setIsApptModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition cursor-pointer"
                              title={t.editAppointmentBtn}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAppt(appt.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                              title="Remove Appointment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1.5 mb-3 text-xs sm:text-sm font-semibold text-slate-700">
                          <p>🏥 <strong>Clinic:</strong> {appt.clinic}</p>
                          <p>
                            📅 <strong>Date & Time:</strong>{" "}
                            {new Date(appt.dateTime).toLocaleString([], {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {appt.notes && (
                            <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 text-xs font-medium text-teal-900 mt-2">
                              <strong>Clinical Notes:</strong> {appt.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Email Alerts & Notification Engine */}
          {activeTab === "alerts" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notification Simulator & Live Engine</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Transactional Email Alert System
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1">
                  {t.testEmailDesc}
                </p>
              </div>

              {/* Recipient Input & Trigger Buttons */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    {t.recipientEmailLabel}
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="caretaker@example.com"
                    className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
                  />
                </div>

                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Trigger Simulated Alert Payload:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleSendTestEmail("upcoming_dose")}
                      disabled={isSendingEmail}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Upcoming Dose Alert</span>
                    </button>

                    <button
                      onClick={() => handleSendTestEmail("missed_dose")}
                      disabled={isSendingEmail}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Send Missed Dose Alert</span>
                    </button>

                    <button
                      onClick={() => handleSendTestEmail("appointment")}
                      disabled={isSendingEmail}
                      className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-2xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Send Doctor Visit Alert</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* In-Flight Spinner */}
              {isSendingEmail && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-semibold text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{t.sendingEmail}</span>
                </div>
              )}

              {/* Result Box */}
              {emailAlertResult && (
                <div
                  className={`p-5 rounded-2xl border ${
                    emailAlertResult.success
                      ? "bg-emerald-50/70 border-emerald-300 text-emerald-900"
                      : "bg-rose-50/70 border-rose-300 text-rose-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {emailAlertResult.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-black text-sm">
                        {emailAlertResult.success
                          ? emailAlertResult.result?.mode === "resend_live"
                            ? "Live Email Dispatched via Resend API!"
                            : "Simulated Email Dispatched to Server Console!"
                          : "Email Dispatch Encountered An Error"}
                      </h4>
                      <p className="text-xs font-medium mt-1">
                        {emailAlertResult.explanation || emailAlertResult.result?.message}
                      </p>

                      {emailAlertResult.result && (
                        <div className="mt-2 text-[11px] font-mono bg-white/80 p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                          <div><strong>Recipient:</strong> {emailAlertResult.result.recipient}</div>
                          <div><strong>Subject:</strong> {emailAlertResult.result.subject}</div>
                          <div><strong>Execution Mode:</strong> {emailAlertResult.result.mode}</div>
                          <div><strong>Timestamp:</strong> {emailAlertResult.result.timestamp}</div>
                        </div>
                      )}

                      {/* HTML Template Inspector Toggle */}
                      {emailAlertResult.previewHtml && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setShowHtmlPreview(!showHtmlPreview)}
                            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{showHtmlPreview ? "Hide HTML Template Inspector" : t.previewEmailBtn}</span>
                          </button>

                          {showHtmlPreview && (
                            <div
                              className="mt-2.5 p-4 bg-white rounded-xl border border-slate-200 overflow-auto max-h-72 text-slate-800"
                              dangerouslySetInnerHTML={{ __html: emailAlertResult.previewHtml }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Architecture Explanatory Note */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span>Production Healthcare Architecture Notice:</span>
                </div>
                <p>
                  In production, automated reminders are triggered on Google Cloud Run via <strong>Google Cloud Scheduler</strong> cron jobs targeting authenticated webhook routes, or directly through the Resend API when <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">RESEND_API_KEY</code> is configured.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Medication Modal */}
      {isMedModalOpen && (
        <MedicationModal
          isOpen={isMedModalOpen}
          onClose={() => {
            setIsMedModalOpen(false);
            setEditingMed(null);
          }}
          onSuccess={fetchData}
          initialData={editingMed}
        />
      )}

      {/* Appointment Modal */}
      {isApptModalOpen && (
        <AppointmentModal
          isOpen={isApptModalOpen}
          onClose={() => {
            setIsApptModalOpen(false);
            setEditingAppt(null);
          }}
          onSuccess={fetchData}
          initialData={editingAppt}
        />
      )}
    </div>
  );
}
