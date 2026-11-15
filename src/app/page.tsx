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
  Check,
  ArrowUpRight,
  Stethoscope,
  Smile,
  Shield,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();
  const [activeModalRole, setActiveModalRole] = useState<"elderly" | "family" | null>(null);
  const [demoPillTaken, setDemoPillTaken] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-clinical-canvas">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 w-full">
        {/* Asymmetric Split-Screen Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-24">
          {/* Left Column: Authoritative Messaging & Immediate Access (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Persona & Security Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t.demoBadge}</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-700 font-medium">Bcrypt Protected</span>
            </div>

            {/* Asymmetric Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12]">
                Care That Connects <br className="hidden sm:inline" />
                <span className="text-emerald-700">Elderly Autonomy</span> with{" "}
                <span className="text-blue-700">Family Peace of Mind.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                A dual-experience healthcare management platform. High-contrast, 1-tap medication confirmation for seniors meets real-time clinical adherence tracking for family caregivers.
              </p>
            </div>

            {/* Dual Primary Action Panels: Distinctive and Immediately Actionable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              {/* Button 1: Elderly Portal Trigger */}
              <button
                type="button"
                onClick={() => setActiveModalRole("elderly")}
                className="group p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white shadow-md hover:shadow-lg transition-all text-left cursor-pointer flex flex-col justify-between min-h-[140px] border border-emerald-500/30"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                    <Heart className="w-5 h-5 fill-white/20" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono font-bold">
                    PIN: 1234
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-base sm:text-lg font-black tracking-tight">
                    <span>{t.elderlyMode}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-emerald-100 font-medium mt-0.5">
                    Large touch targets & 1-tap dose logging
                  </p>
                </div>
              </button>

              {/* Button 2: Caregiver Command Center Trigger */}
              <button
                type="button"
                onClick={() => setActiveModalRole("family")}
                className="group p-5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white shadow-md hover:shadow-lg transition-all text-left cursor-pointer flex flex-col justify-between min-h-[140px] border border-slate-700/80"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-purple-300 text-[11px] font-mono font-bold">
                    Code: CARE2026
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-base sm:text-lg font-black tracking-tight">
                    <span>{t.familyMode}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    7-day calendar, CRUD schedules & alerts
                  </p>
                </div>
              </button>
            </div>

            {/* Trust & Compliance Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Bilingual English & हिन्दी</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Zero Plaintext Passcodes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <span>Google Cloud Run Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Healthcare Command & Senior Mockup Preview (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            {/* Subtle decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 rounded-3xl blur-xl -z-10" />

            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
              {/* Mockup Titlebar */}
              <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                    CareCircle AI • Live Telemetry
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  93% Adherence
                </span>
              </div>

              {/* Mockup Body: Realistic Clinical Preview */}
              <div className="p-5 sm:p-6 space-y-4 bg-slate-50/50">
                {/* Patient Context Banner */}
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="font-black text-slate-900 text-sm block">Ramesh Patel (72)</span>
                    <span className="text-slate-500 font-medium">Type 2 Diabetes • Hypertension</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 font-bold text-[11px] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    5-Day Streak
                  </span>
                </div>

                {/* Hero Dose Confirmation Card */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold font-mono text-slate-700">08:00 AM • Morning</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Due Right Now
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">Metformin</h4>
                      <p className="text-xs font-bold text-blue-700">500 mg • 1 Tablet with Breakfast</p>
                    </div>
                  </div>

                  {!demoPillTaken ? (
                    <button
                      type="button"
                      onClick={() => setDemoPillTaken(true)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-xs sm:text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>Take Dose ✓ (Click to test 1-tap UX)</span>
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-100/90 rounded-xl text-emerald-900 text-center font-bold text-xs flex items-center justify-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Confirmed! Synced to Caregiver Command Center.</span>
                    </div>
                  )}
                </div>

                {/* Upcoming Clinic Visit Widget */}
                <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-200/80 flex items-center justify-between text-xs text-teal-950 font-semibold">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
                    <div>
                      <span className="font-bold text-teal-900 block">Dr. Sunita Sharma (Cardiology)</span>
                      <span className="text-teal-700 text-[11px]">Wed, Nov 18 • 10:30 AM</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-teal-200/60 text-teal-900 font-bold text-[10px]">
                    In 3 Days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Ecosystem Grid: "Two Dedicated Experiences. One Cohesive Loop." */}
        <section className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-black tracking-widest text-emerald-700">
              The CareCircle Loop
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              Purpose-Built for Both Senior & Caregiver
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Designed to eliminate friction for seniors while giving families deep visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Elderly Accessibility First
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Seniors are welcomed by large buttons ($\ge 64$px), high contrast cards, time-of-day groupings, and positive audio confirmation without confusing sub-menus.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Clinical Adherence Analytics
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Caregivers monitor an interactive 7-day adherence calendar, consecutive compliance streaks, and an audit trail with exact timestamps.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Proactive Notification Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Transactional alerts dispatch for upcoming doses, missed medications, and clinic dates, with live Resend integration or verified simulation preview.
              </p>
            </div>
          </div>
        </section>

        {/* 3-Step How It Works Section */}
        <section className="mb-20 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.howItWorksTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
              {t.howItWorksSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                1
              </div>
              <h4 className="text-base font-black text-slate-900">
                {t.step1Title}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                2
              </div>
              <h4 className="text-base font-black text-slate-900">
                {t.step2Title}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                3
              </div>
              <h4 className="text-base font-black text-slate-900">
                {t.step3Title}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </section>

        {/* Security & Disclaimer Footer */}
        <section className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black">Hackathon Verification Standards</h4>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Bcrypt passcodes • Fictional patient data • Single-container Cloud Run ready • 100% automated test coverage
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModalRole("elderly")}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            Launch Demo View
          </button>
        </section>

        <p className="text-center text-[11px] text-slate-400 font-medium max-w-2xl mx-auto">
          {t.medicalDisclaimer}
        </p>
      </main>

      {/* Authentication Passcode Modal */}
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
