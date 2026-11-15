"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, X, AlertCircle, Sparkles, KeyRound, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

interface PinModalProps {
  role: "elderly" | "family";
  isOpen: boolean;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ role, isOpen, onClose }) => {
  const { t } = useI18n();
  const router = useRouter();

  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const isElderly = role === "elderly";
  const defaultDemoCode = isElderly ? "1234" : "CARE2026";

  const handleQuickFill = () => {
    setPasscode(defaultDemoCode);
    setError(null);
  };

  const handleKeypadPress = (val: string) => {
    if (passcode.length < 6) {
      setPasscode((prev) => prev + val);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setPasscode((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setError(isElderly ? t.enterPin : t.enterFamilyCode);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinOrCode: passcode.trim(), role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.errorInvalidPin);
        setIsLoading(false);
        return;
      }

      // Success: redirect to role screen
      if (isElderly) {
        router.push("/elderly");
      } else {
        router.push("/family");
      }
      onClose();
    } catch {
      setError("Network or verification error. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isElderly ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
              }`}
            >
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isElderly ? t.enterPin : t.enterFamilyCode}
              </h3>
              <p className="text-xs font-medium text-slate-500">
                {isElderly ? "4-Digit PIN Access" : "Role-Based Passcode Access"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Demo Credential Pill */}
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isElderly ? t.quickDemoPin : t.quickDemoFamily}</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer shrink-0"
            >
              Autofill Demo
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs sm:text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="passcodeInput"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 text-center"
              >
                {isElderly ? "Enter PIN Below" : "Enter Passcode"}
              </label>
              <div className="relative">
                <input
                  id="passcodeInput"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={isElderly ? "••••" : t.codePlaceholder}
                  maxLength={isElderly ? 4 : 12}
                  className="w-full text-center tracking-[0.4em] text-3xl font-mono font-black py-3.5 px-4 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition outline-none text-slate-900 bg-slate-50/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Elderly Accessible Keypad */}
            {isElderly && (
              <div className="grid grid-cols-3 gap-2 pt-2" aria-label="PIN numeric keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypadPress(String(num))}
                    className="touch-target-accessible text-2xl font-black bg-slate-100 hover:bg-slate-200 active:bg-blue-100 text-slate-900 rounded-2xl transition border border-slate-200/80 flex items-center justify-center cursor-pointer shadow-2xs"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="touch-target-accessible text-sm font-bold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 rounded-2xl transition border border-slate-200/80 flex items-center justify-center cursor-pointer"
                  aria-label="Backspace"
                >
                  ⌫ Delete
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress("0")}
                  className="touch-target-accessible text-2xl font-black bg-slate-100 hover:bg-slate-200 active:bg-blue-100 text-slate-900 rounded-2xl transition border border-slate-200/80 flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={() => setPasscode("")}
                  className="touch-target-accessible text-sm font-bold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 rounded-2xl transition border border-slate-200/80 flex items-center justify-center cursor-pointer"
                  aria-label="Clear all"
                >
                  Clear
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || passcode.length === 0}
              className={`w-full mt-4 py-3.5 rounded-2xl font-bold text-base text-white shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                isElderly
                  ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? t.loading : t.loginBtn}</span>
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Rate-limited brute force protection active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
