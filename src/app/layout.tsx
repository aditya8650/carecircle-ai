import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "CareCircle AI — Elderly Care & Medication Management",
  description:
    "Collaborative elderly care platform for medication adherence, doctor appointments, and family notifications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-200">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
