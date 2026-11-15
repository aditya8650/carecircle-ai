"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartHandshake, Languages, LogOut, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface NavbarProps {
  currentRole?: "elderly" | "family";
  patientName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole, patientName }) => {
  const { language, setLanguage, t } = useI18n();
  const router = useRouter();

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link
          href="/"
          className="flex items-center gap-3.5 group focus:outline-none"
          aria-label="CareCircle AI Home"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                CareCircle<span className="text-emerald-700"> AI</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                Healthcare SaaS
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </Link>

        {/* Center: Patient Context Badge (when active) */}
        {patientName && (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 font-medium">Monitoring:</span>
            <span>{patientName} (Age 72)</span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-400 text-slate-700 font-bold text-xs sm:text-sm transition-all focus:ring-2 focus:ring-emerald-100 shadow-2xs cursor-pointer"
            title="Switch Language / भाषा बदलें"
            aria-label="Toggle language between English and Hindi"
          >
            <Languages className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{language === "en" ? "हिन्दी" : "English"}</span>
          </button>

          {/* Mode Switcher / Logout */}
          {currentRole ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 font-bold text-xs sm:text-sm text-slate-700 transition-all focus:ring-2 focus:ring-rose-100 shadow-2xs cursor-pointer"
              title={t.logoutBtn}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t.logoutBtn}</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bcrypt Secured</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
