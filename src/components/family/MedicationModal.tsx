"use client";

import React, { useState } from "react";
import { X, Pill, Plus, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id?: string;
    name: string;
    dosage: string;
    instructions: string;
    scheduledTimes: string[];
    pillColor: string;
  } | null;
}

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState(initialData?.name || "");
  const [dosage, setDosage] = useState(initialData?.dosage || "");
  const [instructions, setInstructions] = useState(initialData?.instructions || "");
  const [timesStr, setTimesStr] = useState(
    initialData?.scheduledTimes ? initialData.scheduledTimes.join(", ") : "08:00, 20:00"
  );
  const [pillColor, setPillColor] = useState(initialData?.pillColor || "blue");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      setError("Medication name and dosage are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const scheduledTimes = timesStr
      .split(",")
      .map((t) => t.trim())
      .filter((t) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(t));

    if (scheduledTimes.length === 0) {
      setError("Please provide at least one valid scheduled time (e.g., 08:00).");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = initialData?.id
        ? `/api/medications/${initialData.id}`
        : "/api/medications";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dosage,
          instructions,
          scheduledTimes,
          pillColor,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save medication.");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const pillColors = ["blue", "red", "green", "yellow", "purple"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData?.id ? t.editMedicationBtn : t.addMedicationBtn}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.medName} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Metformin"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-semibold outline-none text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.dosage} *
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500 mg"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-semibold outline-none text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t.pillColorLabel}
              </label>
              <div className="flex items-center gap-2 pt-1" aria-label="Select pill color">
                {pillColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setPillColor(color)}
                    aria-label={`Color ${color}`}
                    className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                      pillColor === color ? "ring-3 ring-blue-300 border-white scale-110" : "border-transparent opacity-80 hover:opacity-100"
                    } ${
                      color === "blue"
                        ? "bg-blue-600"
                        : color === "red"
                        ? "bg-rose-500"
                        : color === "green"
                        ? "bg-emerald-500"
                        : color === "yellow"
                        ? "bg-amber-400"
                        : "bg-purple-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.timesOfDay} *
            </label>
            <input
              type="text"
              required
              value={timesStr}
              onChange={(e) => setTimesStr(e.target.value)}
              placeholder="e.g. 08:00, 20:00"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-semibold outline-none text-sm font-mono text-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">24-hour format, separated by commas (e.g. 08:00, 20:00)</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {t.instructionsLabel}
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take with warm water after breakfast"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 font-semibold outline-none text-sm text-slate-900"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-100 transition cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition shadow-xs cursor-pointer"
            >
              {isLoading ? t.loading : t.saveBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
