"use client";

import React from "react";
import { CheckCircle2, XCircle, TrendingUp, Calendar, AlertTriangle, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface AdherenceChartProps {
  adherenceRate: number;
  totalTaken: number;
  totalMissed: number;
  totalScheduled: number;
  recentLogs: Array<{
    id: string;
    medicationName: string;
    dosage: string;
    scheduledFor: string;
    status: string;
    takenAt?: string | null;
    notes?: string | null;
  }>;
}

export const AdherenceChart: React.FC<AdherenceChartProps> = ({
  adherenceRate,
  totalTaken,
  totalMissed,
  totalScheduled,
  recentLogs,
}) => {
  const { t } = useI18n();

  const getAdherenceBadgeColor = (rate: number) => {
    if (rate >= 85) return "text-emerald-800 bg-emerald-50 border-emerald-300";
    if (rate >= 65) return "text-amber-800 bg-amber-50 border-amber-300";
    return "text-rose-800 bg-rose-50 border-rose-300";
  };

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Metric 1: Overall Adherence % */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.adherenceRate}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900 font-mono">
              {adherenceRate}%
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getAdherenceBadgeColor(
                adherenceRate
              )}`}
            >
              {adherenceRate >= 80 ? "Target Met" : adherenceRate >= 60 ? "Moderate" : "Needs Review"}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3">
            <div
              className={`h-full transition-all duration-300 ${
                adherenceRate >= 80 ? "bg-emerald-500" : adherenceRate >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(adherenceRate, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-2">
            Based on {totalScheduled} logged doses over past 7 days
          </p>
        </div>

        {/* Metric 2: Doses Confirmed */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dosesTaken}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-emerald-600 font-mono">
            {totalTaken}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">
            Confirmed completed by patient
          </p>
        </div>

        {/* Metric 3: Doses Missed */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.dosesMissed}
            </span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-rose-600 font-mono">
            {totalMissed}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">
            {totalMissed === 0 ? "Zero missed doses 🎉" : "Unconfirmed doses flagged"}
          </p>
        </div>
      </div>

      {/* Adherence Audit Trail Table */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{t.weeklyTrend}</h3>
              <p className="text-xs text-slate-500 font-medium">
                Live compliance audit log with exact timestamps
              </p>
            </div>
          </div>
        </div>

        {recentLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium text-sm">
            No adherence logs recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Medicine</th>
                  <th className="py-2.5 px-3">Scheduled For</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Confirmed At</th>
                  <th className="py-2.5 px-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {log.medicationName}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        ({log.dosage})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {new Date(log.scheduledFor).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-3">
                      {log.status === "TAKEN" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Missed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-xs">
                      {log.takenAt
                        ? new Date(log.takenAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-xs italic">
                      {log.notes || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
