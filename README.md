# CareCircle AI 🩺👵👴
> **Catalyst PromptWars Hackathon Project**  
> *Collaborative Elderly Care & Medication Management Platform*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma)](https://www.prisma.io/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Ready-4285F4?logo=google-cloud)](https://cloud.google.com/run)

---

## 🌟 Overview & Problem Statement

Elderly citizens often face complex medication regimens across multiple chronic conditions (hypertension, diabetes, heart care). For seniors, standard apps have confusing navigation, tiny touch targets, and cognitive overload. For families and caretakers, there is anxiety around whether morning and night pills were taken on time, when appointments are due, or if a critical dose was missed.

**CareCircle AI** bridges this gap through a dual-mode collaborative platform:
1. **Elderly View:** Designed for maximum accessibility — high-contrast WCAG AAA theme, giant touch targets ($\ge 64\text{px}$), 1-click dose recording with cheerful audio-visual feedback, and instant English/Hindi switching.
2. **Family & Caretaker Portal:** Full medication schedule management (CRUD), real-time 7-day adherence rate analytics, doctor appointment scheduling, and automated email alerts.
3. **Passcode-Protected Access:** Secure, role-based entry protected by rate-limited bcrypt-hashed passcodes — zero plaintext passcodes.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Elderly Accessible UI** | High-contrast cards, large typography ($\ge 20\text{px}$), large touch targets, color-coded pills, and digital clock. |
| **1-Click Dose Recording** | Seniors tap **"I Have Taken This Medicine ✓"** to log adherence instantly with confetti and a pleasant synthesized audio chime. |
| **Family Adherence Analytics** | Real-time 7-day adherence rate %, total doses taken vs. missed, and a complete audit trail. |
| **Medication Schedule CRUD** | Family can add, edit, or remove medications, set dosages, instructions, pill colors, and multiple daily times. |
| **Doctor Appointments** | Schedule clinic visits, doctors, medical specialties, and clinical preparation notes. |
| **Passcode Authentication** | Separate Elderly 4-digit PIN (`1234`) and Family Access Code (`CARE2026`) stored hashed with bcrypt (salt 10) with sliding-window rate limiting. |
| **Email Reminders & Alerts** | Transactional templates for upcoming doses, missed medications, and doctor visits. Supports Resend API and verified simulation preview. |
| **Bilingual (English & हिन्दी)** | Instant language toggle right in the header for seniors and families. |

---

## 🔐 Security & Fictional Data Notice

- **Fictional Persona:** All demo data represents a fictional persona (*"Ramesh Patel, Age 72"*). No real patient health information (PHI) or personal data is stored.
- **Passcode Security:** Passcodes are hashed with `bcryptjs`. No plaintext passcodes exist in database tables, network transfers, or client sessions.
- **Brute-Force Rate Limiting:** Consecutive failed passcode attempts are rate-limited per IP and role.

---

## 🛠️ Tech Stack

- **Frontend & Backend:** Next.js 14 App Router, TypeScript, React 18
- **Styling & UI:** Tailwind CSS, Lucide React icons, Canvas Confetti
- **Audio Synthesizer:** HTML5 Web Audio API (zero external sound file dependencies)
- **Database & ORM:** Prisma ORM with SQLite (local fallback) and PostgreSQL support (Google Cloud Run)
- **Security:** `bcryptjs` for passcode hashing, `jsonwebtoken` for secure HTTP-only cookie sessions
- **Testing:** Vitest with unit tests for auth, rate limiting, and adherence logic
- **Deployment:** Multi-stage Docker container optimized for Google Cloud Run

---

## 💻 Local Quickstart

### Prerequisites
- Node.js $\ge 18$
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/carecircle-ai.git
cd carecircle-ai
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
# Default uses local SQLite dev.db (zero external configuration needed)
DATABASE_URL="file:./dev.db"
SESSION_SECRET="carecircle-super-secret-jwt-key-hackathon-2026"
PORT=3000
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Automated Tests
```bash
npm test
```

### 5. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 🔑 Demo Passcodes
- **Elderly View PIN:** `1234` (or click **"Fill Demo Code"**)
- **Family Portal Code:** `CARE2026` (or click **"Fill Demo Code"**)

---

## ☁️ Google Cloud Run Deployment Guide

CareCircle AI is containerized and ready for single-container deployment on Google Cloud Run.

### Step 1: Switch Prisma to PostgreSQL for Cloud Run
In `prisma/schema.prisma`, update the datasource:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Set Cloud Database URL
Obtain a PostgreSQL connection string (from Google Cloud SQL, Neon, or Supabase):
```bash
export DATABASE_URL="postgresql://user:password@host:5432/carecircle?sslmode=require"
```

### Step 3: Deploy with Google Cloud CLI
```bash
# Build and deploy directly to Cloud Run
gcloud run deploy carecircle-ai \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=$DATABASE_URL,SESSION_SECRET=strong-production-random-secret,NODE_ENV=production"
```

Cloud Run will output your live URL:
`https://carecircle-ai-<hash>-uc.a.run.app`

---

## 🧪 Testing Summary

Automated unit tests are located in `tests/`:
- `tests/auth.test.ts`:
  - Bcrypt hashing & validation
  - 5-attempt sliding window brute-force lockout
  - Rate limit reset upon successful login
  - JWT session token generation & verification
- `tests/adherence.test.ts`:
  - 7-day adherence rate percentage calculation
  - Local timezone dose status window classification (`DUE_NOW`, `UPCOMING`, `PAST`)

To run the suite:
```bash
npm test
```

---

## 📜 Catalyst PromptWars Hackathon Checklist

- [x] Elderly-friendly dashboard with large buttons and accessible UI
- [x] Add, edit, and manage medications with dosage and timings (CRUD)
- [x] Track taken and missed medication doses with live timestamps
- [x] Secure family and caretaker access with passcodes (Bcrypt, no plaintext)
- [x] Doctor appointment management
- [x] Email reminders for upcoming doses, missed medications, and appointments
- [x] Family dashboard showing medication adherence statistics
- [x] English and Hindi language support toggle
- [x] Multi-stage Dockerfile and Google Cloud Run deployment configuration
- [x] Clean, secure, tested code with automated test suite
- [x] Strictly fictional patient data only

---

**Built with ❤️ for Catalyst PromptWars Hackathon 2026**
