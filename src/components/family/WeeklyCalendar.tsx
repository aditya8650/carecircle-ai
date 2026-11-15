"use client";

import React from "react";
import { Check, AlertTriangle, Calendar, Flame, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export interface DayData {
  dateStr: string;
  dayLabel: string;
  dateNumber: number;
  taken: number;
  missed: number;
  rate: number;
  isToday: boolean;
}

interface WeeklyCalendarProps {
  days: DayData[];
  selectedDate: string | null;
  onSelectDate: (dateStr: string | null) => void;
  streakDays: number;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  days,
  selectedDate,
  onSelectDate,
  streakDays,
}) => {
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900">
              7-Day Adherence Calendar
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {t.clickDayToFilter}
          </p>
        </div>

        {/* Streak Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shrink-0">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>
            {streakDays} {t.streakDaysUnit} Streak
          </span>
        </div>
      </div>

      {/* 7 Days Row */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {days.map((day) => {
          const isSelected = selectedDate === day.dateStr;
          const isPerfect = day.missed === 0 && day.taken > 0;
          const hasMissed = day.missed > 0;

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => onSelectDate(isSelected ? null : day.dateStr)}
              className={`p-2 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[90px] sm:min-h-[105px] ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/80 ring-3 ring-emerald-100 shadow-xs"
                  : day.isToday
                  ? "border-blue-300 bg-blue-50/40 hover:bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
              }`}
              aria-label={`Select ${day.dayLabel} ${day.dateNumber}, Adherence: ${day.rate}%`}
            >
              {/* Day Name */}
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {day.dayLabel}
              </span>

              {/* Date Number */}
              <span className="text-base sm:text-xl font-black text-slate-900 font-mono">
                {day.dateNumber}
              </span>

              {/* Status Visual Indicator */}
              <div className="mt-1">
                {isPerfect ? (
                  <div
                    className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xs"
                    title={`${day.taken} doses confirmed`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : hasMissed ? (
                  <div
                    className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xs text-[10px] font-black"
                    title={`${day.missed} dose missed`}
                  >
                    !
                  </div>
                ) : (
                  <div
                    className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] font-bold"
                    title="No doses scheduled"
                  >
                    —
                  </div>
                )}
              </div>

              {/* Percentage */}
              <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                {day.rate}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Date Filter Status / Clear Button */}
      {selectedDate && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {t.showingLogsFor} <strong className="text-emerald-700 font-mono">{selectedDate}</strong>
          </span>
          <button
            type="button"
            onClick={() => onSelectDate(null)}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.clearDateFilter}</span>
          </button>
        </div>
      )}
    </div>
  );
};
