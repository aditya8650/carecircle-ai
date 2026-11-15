"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { PinModal } from "@/components/common/PinModal";
import { useI18n } from "@/lib/i18n/context";
import {
  Heart,
  Users,
  ShieldCheck,
  BellRing,
  CalendarCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Pill,
  TrendingUp,
  Activity,
  CheckCircle2,
  Calendar,
  Flame,
  Info,
} from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();
  const [activeModalRole, setActiveModalRole] = useState<"elderly" | "family" | null>(null);
  const [previewTab, setPreviewTab] = useState<"elderly" | "caretaker">("elderly");
  const [previewDoseTaken, setPreviewDoseTaken] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-healthcare-gradient">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Fictional Demo Patient Notice Banner */}
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.demoBadge}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1.5">
            {t.demoNotice}
          </p>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Care That Connects <span className="text-blue-600">Generations</span>
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            A collaborative healthcare platform built for elderly independence and family peace of mind.
            Accessible 1-tap dose tracking meets real-time adherence oversight.
          </p>
        </div>

        {/* Above-The-Fold: Two Distinct Portal Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
          {/* Card 1: Elderly Mode */}
          <div
            onClick={() => setActiveModalRole("elderly")}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-blue-200/90 hover:border-blue-600 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActiveModalRole("elderly");
            }}
            aria-label="Open Elderly Care View"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono">
                  {t.quickDemoPin}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {t.elderlyMode}
              </h2>
              <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                {t.elderlyDesc}
              </p>

              <div className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Extra-large touch targets ($\ge 64$px)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Click "I Have Taken This Medicine"</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bilingual audio-visual feedback (English / हिन्दी)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-sm group-hover:translate-x-0.5 transition-transform">
              <span>Launch Elderly View</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Family Mode */}
          <div
            onClick={() => setActiveModalRole("family")}
            className="group cursor-pointer rounded-3xl bg-white border-2 border-indigo-200/90 hover:border-indigo-600 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setActiveModalRole("family");
            }}
            aria-label="Open Family and Caretaker Portal"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold font-mono">
                  {t.quickDemoFamily}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                {t.familyMode}
              </h2>
              <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                {t.familyDesc}
              </p>

              <div className="mt-5 space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>7-Day interactive adherence calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Medication schedule management (CRUD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Doctor appointments & email alerts</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold text-sm group-hover:translate-x-0.5 transition-transform">
              <span>Launch Caregiver Portal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Live Interactive Dual-Mode Preview Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-black tracking-widest text-slate-400">
              Interactive Product Experience
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.previewHeroTitle}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            {/* Preview Interactive Tab Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewTab("elderly")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === "elderly"
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  Senior Mode Preview
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("caretaker")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    previewTab === "caretaker"
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "text-slate-600 hover:bg-slate-200/60"
                  }`}
                >
                  Caregiver Portal Preview
                </button>
              </div>

              <span className="text-xs font-mono font-bold text-slate-500 hidden sm:block">
                Patient: Ramesh Patel (72)
              </span>
            </div>

            <div className="p-6 sm:p-8">
              {previewTab === "elderly" ? (
                <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Scheduled Dose
                        </span>
                        <span className="text-xl font-black text-slate-900 font-mono">08:00 AM</span>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Due Right Now
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900">Metformin</h4>
                      <p className="text-sm font-bold text-blue-700">500 mg • Take after breakfast</p>
                    </div>
                  </div>

                  {!previewDoseTaken ? (
                    <button
                      type="button"
                      onClick={() => setPreviewDoseTaken(true)}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      <span>I Have Taken This Medicine ✓ (Try Clicking)</span>
                    </button>
                  ) : (
                    <div className="p-3 bg-emerald-100/90 rounded-2xl text-emerald-900 text-center font-bold text-sm flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>Dose confirmed at 08:15 AM! Logged to family audit trail.</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Weekly Adherence</span>
                      <span className="text-2xl font-black text-emerald-600 font-mono">93%</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Confirmed Doses</span>
                      <span className="text-2xl font-black text-slate-900 font-mono">14 / 15</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Adherence Streak</span>
                      <span className="text-2xl font-black text-amber-600 font-mono">5 Days 🔥</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between text-xs font-semibold text-teal-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span>Next Visit: <strong>Dr. Sunita Sharma (Cardiology)</strong> — City Heart Center</span>
                    </div>
                    <span className="text-teal-700 font-bold">In 3 Days</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.howItWorksTitle}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-2 max-w-xl mx-auto">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm mb-4">
                1
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1.5">
                {t.step1Title}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm mb-4">
                2
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1.5">
                {t.step2Title}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm mb-4">
                3
              </div>
              <h4 className="text-base font-black text-slate-900 mb-1.5">
                {t.step3Title}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Security & Hackathon Standards Banner */}
        <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-black">Secure & Hackathon Compliant</h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Bcrypt-hashed credentials • Sliding window rate limiting • Fictional data only • Cloud Run containerized
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModalRole("elderly")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            Try Demo View
          </button>
        </div>

        {/* Medical Notice */}
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <p className="text-[11px] text-slate-400 font-medium max-w-2xl mx-auto">
            {t.medicalDisclaimer}
          </p>
        </div>
      </main>

      {/* Passcode Modal */}
      {activeModalRole && (
        <PinModal
          role={activeModalRole}
          isOpen={Boolean(activeModalRole)}
          onClose={() => setActiveModalRole(null)}
        />
      )}
    </div>
  );
}
