# CareCircle AI 🩺👵👴
> **CATALYST Solo AI Hackathon Project**  
> *Collaborative Elderly Care & Medication Management Platform*

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?logo=prisma)](https://www.prisma.io/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Ready-4285F4?logo=google-cloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview & Problem Statement

Millions of elderly citizens manage complex daily medication regimens for chronic conditions such as hypertension, diabetes, and cardiovascular health. Standard health apps are often poorly adapted for older adults: they present small touch targets, cluttered interfaces, tiny text, and difficult navigation. Simultaneously, family members and caretakers carry persistent anxiety regarding whether daily pills were taken on time, whether doctor appointments are approaching, or if a critical dosage was missed.

**CareCircle AI** solves this challenge through a dual-mode, collaborative healthcare system:
1. **Elderly View:** An accessible interface engineered with extra-large touch targets ($\ge 64\text{px}$), high-contrast visual cues, time-of-day medication grouping (Morning, Afternoon, Evening), 1-click dose confirmation with synthesized audio-visual feedback, and instant English/Hindi bilingual switching.
2. **Caregiver Command Center:** A desktop/tablet-optimized management hub featuring medication schedule CRUD, interactive 7-day adherence tracking, doctor appointment scheduling, notification preview engine, and emergency contact details.
3. **Passcode-Protected Access:** Secure, role-separated entry protected by bcrypt-hashed passcodes and sliding-window rate limiting to prevent unauthorized access and brute-force attempts.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Elderly Accessible UI** | High-contrast WCAG-aligned layout, large typography ($\ge 20\text{px}$), large touch targets, color-coded medicine cards, live clock, and date display. |
| **1-Click Dose Recording** | Seniors tap **"I Have Taken This Medicine ✓"** to log adherence immediately with visual celebration and synthesized Web Audio chime. |
| **Time-of-Day Organization** | Doses are automatically grouped into Morning (06:00–12:00), Afternoon (12:00–18:00), and Evening (18:00–24:00). |
| **Family Adherence Analytics** | Interactive 7-day calendar and adherence percentage calculator tracking completed, pending, and missed doses. |
| **Medication Schedule CRUD** | Caregivers can add, edit, activate/deactivate, and delete medications with custom dosages, instructions, pill colors, and multiple daily times. |
| **Doctor Appointment Management** | Track upcoming clinic visits, doctor names, medical specialties, locations, and pre-appointment preparation notes. |
| **Notification Engine** | Transactional email notifications for upcoming doses, missed medications, and doctor visits. Supports live delivery via Resend or verified in-app simulation preview. |
| **Passcode Security** | Role-based authentication using 4-digit PIN for seniors and access code for family, stored as salted bcrypt hashes with rate limiting. |
| **Bilingual Support (English & हिन्दी)** | Instant language switching throughout the interface for seniors and family members. |

---

## 🔐 Security & Fictional Data Notice

> [!IMPORTANT]
> **Fictional Patient Data Only:** All patient records, doctor appointments, and contact numbers in this repository and demo database represent a fictional persona (*"Ramesh Patel, Age 72"*). No real Protected Health Information (PHI) or personal data is collected or stored.

- **Passcode Protection:** Passcodes are never stored or transmitted in plaintext. Authentication uses `bcryptjs` (cost factor 10) on the server.
- **Session Tokens:** Successful authentication sets an `httpOnly`, `SameSite=Lax` signed JWT cookie (`carecircle_session`) valid for 7 days.
- **Brute-Force Rate Limiting:** Failed passcode attempts trigger an in-memory sliding-window lockout (5 attempts per 15-minute window per IP/role).
- **Zero Secrets Committed:** Environment configuration is managed via `.env` (git-ignored). Only `.env.example` with safe placeholder keys is tracked.

---

## 🔑 Demo Access Credentials

The platform is pre-seeded with sample data for hackathon evaluation:

| Portal | Access URL | Demo Credential | Note |
| :--- | :--- | :--- | :--- |
| **Elderly View** | `/elderly` | **PIN:** `1234` | **[DEMO ONLY]** Or click *"Fill Demo Code"* on the modal |
| **Family Portal** | `/family` | **Code:** `CARE2026` | **[DEMO ONLY]** Or click *"Fill Demo Code"* on the modal |

*(These demo credentials hash to the pre-seeded bcrypt hashes stored in the database.)*

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.6
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Database & ORM:** Prisma ORM 5.21 with SQLite (local development fallback) and PostgreSQL (production)
- **Authentication & Security:** `bcryptjs` passcode hashing, `jsonwebtoken` session tokens
- **Audio Feedback:** HTML5 Web Audio API synthesizer (no external audio assets required)
- **Visual Feedback:** Canvas Confetti for senior dose completion celebration
- **Testing:** Vitest 2.1 (Unit tests for authentication, rate limiting, adherence analytics, and schedule validation)
- **Containerization:** Multi-stage Dockerfile optimized for Google Cloud Run

---

## ⚙️ Environment Variables

The application reads configuration from environment variables. A safe template is provided in `.env.example`:

| Variable | Required | Default / Example | Purpose |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | **Yes** | `file:./dev.db` | Database connection string. Uses local SQLite by default; use PostgreSQL connection string for Cloud Run. |
| `SESSION_SECRET` | **Yes** | `carecircle-super-secret-jwt-key-hackathon-2026` | Cryptographic secret used to sign and verify JWT session cookies. |
| `PORT` | No | `3000` | Port on which the HTTP server listens (Google Cloud Run automatically sets this). |
| `RESEND_API_KEY` | No | *(None)* | Optional API key for live transactional email delivery via Resend. If omitted, the app runs in verified simulation preview mode. |
| `EMAIL_FROM` | No | `CareCircle AI <notifications@carecircle.ai>` | Verified sender email address for outgoing alerts. |

---

## 💻 Local Setup & Quickstart

### Prerequisites
- Node.js $\ge 18.17.0$
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/carecircle-ai.git
cd carecircle-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Create a `.env` file based on `.env.example`:
```bash
# On Linux / macOS:
cp .env.example .env

# On Windows PowerShell:
Copy-Item .env.example .env
```

### 4. Initialize Database & Seed Demo Data
```bash
npx prisma db push
node prisma/seed.js
```

### 5. Run Automated Tests
```bash
npm test
```
All 11 unit tests across auth, adherence, and schedule validation should pass.

### 6. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚠️ Known Limitations & Architectural Choices

1. **Local SQLite Fallback:**
   - For local development and hackathon evaluation, the app defaults to a zero-configuration SQLite database (`prisma/dev.db`).
   - SQLite is single-file and does not persist across stateless container restarts on Cloud Run. For production deployment, switch to managed PostgreSQL (e.g., Google Cloud SQL, Supabase, or Neon) as documented below.
2. **Simulated Notification Engine:**
   - Without a paid/verified third-party email API key, automated emails cannot reach real inboxes without risking spam/bounce penalties.
   - CareCircle AI includes a full HTML notification generator with a verified simulation mode: all dispatched notifications are logged with full headers to the console and previewed directly in the Caregiver Command Center UI.
   - Supplying `RESEND_API_KEY` automatically activates live outbound delivery.
3. **Automated Scheduled Reminders in Cloud:**
   - In production on Google Cloud Run, continuous background processes are not recommended due to container scale-to-zero.
   - Automated periodic dose reminders should be triggered by configuring **Google Cloud Scheduler** to send an authorized HTTP POST request to `/api/reminders/send` on a cron schedule (e.g., every hour).

---

## ☁️ Google Cloud Run Deployment Guide

CareCircle AI includes a production-ready multi-stage `Dockerfile` configured for Google Cloud Run.

### Step 1: Switch Prisma Datasource to PostgreSQL
In `prisma/schema.prisma`, update the datasource provider:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Push Database Schema to Managed PostgreSQL
```bash
export DATABASE_URL="postgresql://user:password@your-postgres-host:5432/carecircle?sslmode=require"
npx prisma db push
node prisma/seed.js
```

### Step 3: Deploy to Google Cloud Run
```bash
gcloud run deploy carecircle-ai \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=$DATABASE_URL,SESSION_SECRET=your-strong-production-secret,NODE_ENV=production"
```

Cloud Run will build the container using the provided `Dockerfile` and output your live service URL:
```text
https://carecircle-ai-xxxxx-uc.a.run.app
```

---

## 🧪 Testing Suite Summary

Automated tests are written with Vitest and test core business logic:
- **`tests/auth.test.ts`**:
  - Bcrypt passcode hashing and constant-time comparison
  - Sliding-window rate limiting (lockout after 5 failed attempts)
  - Rate-limit reset on successful authentication
  - JWT session token generation, payload encoding, and tamper rejection
- **`tests/adherence.test.ts`**:
  - 7-day adherence rate calculation algorithm
  - Dose status classification based on time windows (`DUE_NOW`, `UPCOMING`, `PAST`)
- **`tests/schedule-validation.test.ts`**:
  - Medication scheduled time array parsing and normalization
  - Rejection of invalid time strings and malformed payload formats

Run tests at any time with:
```bash
npm test
```

---

## 📁 Project Structure

```text
carecircle-ai/
├── .env.example               # Safe environment variable template
├── .gitignore                 # Exclusion rules (ignores secrets, databases, build artifacts)
├── Dockerfile                 # Multi-stage container build for Cloud Run
├── README.md                  # Project documentation & evaluation guide
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts (dev, build, test, seed)
├── prisma/
│   ├── dev.db                 # Local SQLite database (git-ignored)
│   ├── schema.prisma          # Database schema (CareCircle, Medication, Appointment, etc.)
│   └── seed.js                # Demo data seeder (fictional patient Ramesh Patel)
├── public/                    # Static assets & robots.txt
├── src/
│   ├── app/
│   │   ├── api/               # API Route Handlers (auth, adherence, medications, appointments, reminders)
│   │   ├── elderly/           # Accessible Elderly Portal page
│   │   ├── family/            # Caregiver Command Center page
│   │   ├── globals.css        # Tailwind styles & theme variables
│   │   ├── layout.tsx         # Root layout with language provider
│   │   └── page.tsx           # Split-screen landing page with live interactive preview
│   ├── components/
│   │   ├── common/            # Navbar, PIN/Passcode modal
│   │   ├── elderly/           # Large touch DoseCard component
│   │   └── family/            # AdherenceChart, WeeklyCalendar, MedicationModal, AppointmentModal
│   ├── lib/
│   │   ├── auth.ts            # Bcrypt hashing, JWT sessions, rate limiter
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── email.ts           # Email reminder HTML templates & dispatcher
│   │   ├── schedule.ts        # Time normalization utilities
│   │   └── i18n/              # English/Hindi translation dictionaries & context
│   └── types/                 # Shared TypeScript interfaces
├── tests/                     # Vitest automated test suite
└── vitest.config.ts           # Vitest configuration with TypeScript path alias resolution
```

---

## 📜 Evaluation Checklist (CATALYST Solo AI Hackathon)

- [x] **Accessible Elderly Dashboard:** High-contrast, large touch targets ($\ge 64\text{px}$), time-grouped medications, 1-click adherence logging.
- [x] **Medication Management (CRUD):** Add, edit, activate/deactivate, and delete medications with dosages and schedules.
- [x] **Dose Adherence Tracking:** Real-time logging with 7-day adherence statistics and visual calendar history.
- [x] **Secure Passcode Authentication:** Role-based access with bcrypt hashing, rate limiting, and HTTP-only cookie sessions.
- [x] **Doctor Appointment Management:** Schedule, edit, and track clinic visits with doctor details and preparation notes.
- [x] **Notification Engine:** Email reminder templates for upcoming doses, missed medications, and appointments (with simulation & Resend support).
- [x] **Bilingual Support:** Full English & Hindi localization with instant toggle.
- [x] **Tested & Secure:** Automated Vitest test suite, strict input validation, zero committed secrets.
- [x] **Cloud Run Deployment Ready:** Multi-stage Dockerfile and deployment documentation.
- [x] **Fictional Data Only:** Compliant with privacy standards using simulated demo records.

---

**CareCircle AI — Built for the CATALYST Solo AI Hackathon 2026**
