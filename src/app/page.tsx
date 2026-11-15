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
} from "lucide-react";

export default function HomePage() {
  const { t } = useI18n();
  const [activeModalRole, setActiveModalRole] = useState<"elderly" | "family" | null>(null);

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
                  <span>7-Day medication adherence analytics</span>
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
              <span>Launch Caretaker Portal</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Live Visual Dashboard Preview Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-6">
            <span className="text-xs uppercase font-black tracking-widest text-slate-400">
              Live Product Experience
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {t.previewHeroTitle}
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">
                  Simulated Active Circle: Ramesh Patel (72)
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                Today: 08:00 AM — Morning Window
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Preview: Elderly Dose Card */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Elderly View Preview
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    Due Right Now
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900">Metformin</h4>
                    <p className="text-xs font-bold text-blue-600">500 mg • 1 Tablet with Breakfast</p>
                  </div>
                </div>
                <div className="py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Taken This Medicine ✓</span>
                </div>
              </div>

              {/* Right Preview: Family Adherence Gauge */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Caretaker View Preview
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      93% Weekly Rate
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black text-slate-900">93%</span>
                    <span className="text-xs font-bold text-slate-500">Adherence Score</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "93%" }} />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    14 of 15 scheduled doses confirmed in past 7 days.
                  </p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-semibold text-slate-500 flex items-center justify-between">
                  <span>Next Doctor Visit:</span>
                  <span className="text-teal-700 font-bold">Dr. Sunita Sharma (Cardiology)</span>
                </div>
              </div>
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
