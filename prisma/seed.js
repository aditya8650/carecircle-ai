const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CareCircle AI with realistic fictional patient data...");

  // Clean existing records if any
  await prisma.adherenceLog.deleteMany({});
  await prisma.medication.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.emailSetting.deleteMany({});
  await prisma.careCircle.deleteMany({});

  // Hashes for demo passcodes (no plaintext in DB)
  const elderlyPinHash = await bcrypt.hash("1234", 10);
  const familyCodeHash = await bcrypt.hash("CARE2026", 10);

  // 1. Create Patient Circle
  const circle = await prisma.careCircle.create({
    data: {
      patientName: "Ramesh Patel",
      patientAge: 72,
      emergencyContact: "+91 98765 43210",
      elderlyPinHash,
      familyCodeHash,
    },
  });

  console.log(`Created CareCircle for ${circle.patientName} (ID: ${circle.id})`);

  // 2. Create Medications
  const med1 = await prisma.medication.create({
    data: {
      circleId: circle.id,
      name: "Metformin",
      dosage: "500 mg",
      instructions: "Take with breakfast and dinner",
      scheduledTimes: JSON.stringify(["08:00", "20:00"]),
      pillColor: "blue",
      active: true,
    },
  });

  const med2 = await prisma.medication.create({
    data: {
      circleId: circle.id,
      name: "Lisinopril",
      dosage: "10 mg",
      instructions: "Take once daily in the morning with water",
      scheduledTimes: JSON.stringify(["08:00"]),
      pillColor: "red",
      active: true,
    },
  });

  const med3 = await prisma.medication.create({
    data: {
      circleId: circle.id,
      name: "Atorvastatin",
      dosage: "20 mg",
      instructions: "Take at bedtime",
      scheduledTimes: JSON.stringify(["21:00"]),
      pillColor: "yellow",
      active: true,
    },
  });

  const med4 = await prisma.medication.create({
    data: {
      circleId: circle.id,
      name: "Vitamin D3",
      dosage: "1000 IU",
      instructions: "Take with lunch",
      scheduledTimes: JSON.stringify(["13:00"]),
      pillColor: "green",
      active: true,
    },
  });

  // 3. Create Adherence Logs (Past 5 days for rich statistics)
  const now = new Date();
  
  // Past logs:
  const daysAgo = (d, hours, minutes) => {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const sampleLogs = [
    // 3 days ago
    { medId: med1.id, time: daysAgo(3, 8, 0), status: "TAKEN", takenAt: daysAgo(3, 8, 15) },
    { medId: med2.id, time: daysAgo(3, 8, 0), status: "TAKEN", takenAt: daysAgo(3, 8, 15) },
    { medId: med4.id, time: daysAgo(3, 13, 0), status: "TAKEN", takenAt: daysAgo(3, 13, 10) },
    { medId: med1.id, time: daysAgo(3, 20, 0), status: "TAKEN", takenAt: daysAgo(3, 20, 5) },
    { medId: med3.id, time: daysAgo(3, 21, 0), status: "TAKEN", takenAt: daysAgo(3, 21, 20) },

    // 2 days ago
    { medId: med1.id, time: daysAgo(2, 8, 0), status: "TAKEN", takenAt: daysAgo(2, 8, 5) },
    { medId: med2.id, time: daysAgo(2, 8, 0), status: "TAKEN", takenAt: daysAgo(2, 8, 5) },
    { medId: med4.id, time: daysAgo(2, 13, 0), status: "MISSED", takenAt: null, notes: "Forgot after lunch outing" },
    { medId: med1.id, time: daysAgo(2, 20, 0), status: "TAKEN", takenAt: daysAgo(2, 20, 30) },
    { medId: med3.id, time: daysAgo(2, 21, 0), status: "TAKEN", takenAt: daysAgo(2, 21, 10) },

    // Yesterday
    { medId: med1.id, time: daysAgo(1, 8, 0), status: "TAKEN", takenAt: daysAgo(1, 8, 2) },
    { medId: med2.id, time: daysAgo(1, 8, 0), status: "TAKEN", takenAt: daysAgo(1, 8, 2) },
    { medId: med4.id, time: daysAgo(1, 13, 0), status: "TAKEN", takenAt: daysAgo(1, 13, 5) },
    { medId: med1.id, time: daysAgo(1, 20, 0), status: "TAKEN", takenAt: daysAgo(1, 20, 10) },
    { medId: med3.id, time: daysAgo(1, 21, 0), status: "TAKEN", takenAt: daysAgo(1, 21, 15) },
  ];

  for (const log of sampleLogs) {
    await prisma.adherenceLog.create({
      data: {
        circleId: circle.id,
        medicationId: log.medId,
        scheduledFor: log.time,
        status: log.status,
        takenAt: log.takenAt,
        notes: log.notes || null,
      },
    });
  }

  // 4. Create Appointments
  const appt1Date = new Date(now);
  appt1Date.setDate(appt1Date.getDate() + 3);
  appt1Date.setHours(10, 30, 0, 0);

  const appt2Date = new Date(now);
  appt2Date.setDate(appt2Date.getDate() + 10);
  appt2Date.setHours(16, 0, 0, 0);

  await prisma.appointment.create({
    data: {
      circleId: circle.id,
      doctorName: "Dr. Sunita Sharma",
      specialty: "Cardiology",
      clinic: "City Heart & Health Center",
      dateTime: appt1Date,
      notes: "Follow-up for blood pressure. Bring 2-week BP logbook.",
      reminderSent: false,
    },
  });

  await prisma.appointment.create({
    data: {
      circleId: circle.id,
      doctorName: "Dr. Amit Gupta",
      specialty: "Endocrinology",
      clinic: "Metro Diabetes Care Center",
      dateTime: appt2Date,
      notes: "Routine quarterly HbA1c check & kidney panel.",
      reminderSent: false,
    },
  });

  // 5. Create Email Settings
  await prisma.emailSetting.create({
    data: {
      circleId: circle.id,
      recipientEmail: "caretaker.demo@carecircle.ai",
      notifyOnMissed: true,
      notifyOnUpcoming: true,
      notifyOnAppt: true,
    },
  });

  console.log("Seeding complete! 1 patient circle, 4 meds, 15 adherence records, 2 appointments.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
