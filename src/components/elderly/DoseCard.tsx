"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Check, Clock, AlertCircle, Sparkles, Pill } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface DoseCardProps {
  scheduleId: string;
  medicationId: string;
  name: string;
  dosage: string;
  instructions: string;
  scheduledTime: string;
  pillColor: string;
  status: "PENDING" | "TAKEN" | "MISSED" | "SKIPPED";
  takenAt?: string | null;
  onDoseLogged: () => void;
  isHero?: boolean;
}

export const DoseCard: React.FC<DoseCardProps> = ({
  medicationId,
  name,
  dosage,
  instructions,
  scheduledTime,
  pillColor,
  status,
  takenAt,
  onDoseLogged,
  isHero = false,
}) => {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const isTaken = status === "TAKEN";
  const isMissed = status === "MISSED";

  // Web Audio pleasant chime synthesizer (no external audio files needed)
  const playPleasantChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.35); // G5

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.55);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.55);
    } catch {
      // AudioContext not allowed or not supported; gracefully continue
    }
  };

  const handleMarkTaken = async () => {
    if (isTaken || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/adherence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicationId,
          scheduledTime,
          status: "TAKEN",
        }),
      });

      if (res.ok) {
        // Trigger cheerful audio
        playPleasantChime();

        // Trigger confetti only if user hasn't requested reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!prefersReducedMotion) {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
          });
        }

        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2500);
        onDoseLogged();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color mappings
  const getColorClasses = (color: string) => {
    switch (color) {
      case "red":
        return "bg-rose-500 text-white border-rose-600";
      case "green":
        return "bg-emerald-500 text-white border-emerald-600";
      case "yellow":
        return "bg-amber-400 text-slate-900 border-amber-500";
      case "purple":
        return "bg-purple-500 text-white border-purple-600";
      case "blue":
      default:
        return "bg-blue-600 text-white border-blue-700";
    }
  };

  return (
    <article
      className={`relative w-full rounded-3xl p-6 sm:p-7 transition-all duration-150 border-2 shadow-xs ${
        isTaken
          ? "bg-emerald-50/60 border-emerald-300"
          : isMissed
          ? "bg-rose-50/60 border-rose-300"
          : isHero
          ? "bg-white border-blue-500 shadow-md ring-4 ring-blue-50"
          : "bg-white border-slate-200 hover:border-slate-300"
      }`}
      aria-label={`${name} scheduled for ${scheduledTime}`}
    >
      {/* Top Header: Time & Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700 shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block">
              {t.scheduledAt}
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {scheduledTime}
            </div>
          </div>
        </div>

        <div>
          {isTaken ? (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-sm sm:text-base font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                {t.alreadyTaken}{" "}
                {takenAt
                  ? new Date(takenAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "✓"}
              </span>
            </span>
          ) : isMissed ? (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-sm font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <AlertCircle className="w-4 h-4" />
              <span>{t.missedDose}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-sm sm:text-base font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>{t.nextDoseNow}</span>
            </span>
          )}
        </div>
      </div>

      {/* Pill Information */}
      <div className="flex items-start gap-4 mb-5">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-2xs ${getColorClasses(
            pillColor
          )}`}
          title={`Pill Color: ${pillColor}`}
        >
          <Pill className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {name}
          </h3>
          <p className="text-lg sm:text-xl font-bold text-blue-700 mt-0.5">
            {dosage}
          </p>
          {instructions && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-sm sm:text-base font-semibold border border-slate-200/80">
              <span>💡 {instructions}</span>
            </div>
          )}
        </div>
      </div>

      {/* Subtle celebratory confirmation feedback */}
      {showCelebration && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-base font-black flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>{t.congratsTaken}</span>
        </div>
      )}

      {/* Action Button: Accessible touch target $\ge 64$px */}
      {!isTaken ? (
        <button
          onClick={handleMarkTaken}
          disabled={isSubmitting}
          className="w-full touch-target-large rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-lg sm:text-xl shadow-md transition-all flex items-center justify-center gap-2.5 border-2 border-emerald-500 cursor-pointer disabled:opacity-50"
          aria-label={`Mark ${name} as taken`}
        >
          <Check className="w-6 h-6 stroke-[3]" />
          <span>{isSubmitting ? t.loading : t.takeDoseBtn}</span>
        </button>
      ) : (
        <div className="text-center py-2 text-emerald-800 font-bold text-sm sm:text-base flex items-center justify-center gap-1.5">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Completed for this schedule window</span>
        </div>
      )}
    </article>
  );
};
