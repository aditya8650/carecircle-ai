export type Language = "en" | "hi";

export interface Translations {
  appName: string;
  tagline: string;
  selectRole: string;
  elderlyMode: string;
  elderlyDesc: string;
  familyMode: string;
  familyDesc: string;
  enterPin: string;
  enterFamilyCode: string;
  pinPlaceholder: string;
  codePlaceholder: string;
  loginBtn: string;
  logoutBtn: string;
  quickDemoPin: string;
  quickDemoFamily: string;
  demoBadge: string;
  demoNotice: string;
  cancel: string;
  confirm: string;
  loading: string;
  errorInvalidPin: string;
  errorRateLimited: string;

  // Elderly Screen
  elderlyGreeting: string;
  todaysMeds: string;
  nextDoseNow: string;
  noUpcomingDose: string;
  takeDoseBtn: string;
  alreadyTaken: string;
  missedDose: string;
  takeWithFood: string;
  instructions: string;
  emergencyTitle: string;
  emergencyContactLabel: string;
  emergencyNotice: string;
  doctorApptBanner: string;
  congratsTaken: string;
  scheduledAt: string;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  morningMeds: string;
  afternoonMeds: string;
  eveningMeds: string;

  // Family Screen
  familyDashboardTitle: string;
  familyDashboardSubtitle: string;
  adherenceRate: string;
  dosesTaken: string;
  dosesMissed: string;
  totalScheduled: string;
  weeklyTrend: string;
  medicationsTab: string;
  appointmentsTab: string;
  notificationsTab: string;
  addMedicationBtn: string;
  editMedicationBtn: string;
  deleteMedicationBtn: string;
  addAppointmentBtn: string;
  editAppointmentBtn: string;
  sendTestEmailBtn: string;
  sendingEmail: string;
  emailSentSuccess: string;
  testEmailDesc: string;
  recipientEmailLabel: string;
  medName: string;
  dosage: string;
  timesOfDay: string;
  instructionsLabel: string;
  pillColorLabel: string;
  saveBtn: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  dateTime: string;
  notes: string;
  upcomingAppts: string;
  pastAppts: string;
  noAppts: string;
  noMeds: string;

  // Search & Filters
  searchMedsPlaceholder: string;
  filterAll: string;
  filterMorning: string;
  filterAfternoon: string;
  filterEvening: string;
  filterUpcoming: string;
  filterPast: string;
  streakLabel: string;
  streakDaysUnit: string;
  clickDayToFilter: string;
  showingLogsFor: string;
  clearDateFilter: string;
  previewEmailBtn: string;
  simulatedInspectorTitle: string;

  // Landing Page additions
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  previewHeroTitle: string;
  medicalDisclaimer: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "CareCircle AI",
    tagline: "Elderly Care & Collaborative Medication Management",
    selectRole: "Choose a View to Continue",
    elderlyMode: "Elderly Care View",
    elderlyDesc: "High-contrast cards, extra-large touch targets, and 1-tap dose tracking.",
    familyMode: "Family & Caretaker Command Center",
    familyDesc: "Adherence analytics, medication schedules, calendar tracking, and alerts.",
    enterPin: "Enter 4-Digit Elderly PIN",
    enterFamilyCode: "Enter Family Access Code",
    pinPlaceholder: "e.g. 1234",
    codePlaceholder: "e.g. CARE2026",
    loginBtn: "Unlock Dashboard",
    logoutBtn: "Exit / Switch View",
    quickDemoPin: "Demo PIN: 1234",
    quickDemoFamily: "Demo Code: CARE2026",
    demoBadge: "Fictional Patient Persona: Ramesh Patel (Age 72)",
    demoNotice: "Strictly fictional demo data. Passcodes are securely hashed with bcrypt.",
    cancel: "Cancel",
    confirm: "Confirm",
    loading: "Processing...",
    errorInvalidPin: "Invalid passcode. Please try again.",
    errorRateLimited: "Too many failed attempts. Please wait before trying again.",

    // Elderly Screen
    elderlyGreeting: "Namaste, Ramesh Ji",
    todaysMeds: "Today's Medication Schedule",
    nextDoseNow: "Dose Due Right Now",
    noUpcomingDose: "All caught up! No more medicines scheduled for right now.",
    takeDoseBtn: "I Have Taken This Medicine ✓",
    alreadyTaken: "Taken at",
    missedDose: "Missed Dose",
    takeWithFood: "Take with food & water",
    instructions: "Special Instructions",
    emergencyTitle: "Designated Caregiver Contact",
    emergencyContactLabel: "Family Caretaker (Demo Placeholder — Non-callable)",
    emergencyNotice: "For real medical emergencies, please dial emergency services immediately.",
    doctorApptBanner: "Upcoming Doctor Appointment",
    congratsTaken: "Dose recorded successfully!",
    scheduledAt: "Scheduled for",
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
    morningMeds: "Morning Medications (06:00 - 12:00)",
    afternoonMeds: "Afternoon Medications (12:00 - 17:00)",
    eveningMeds: "Evening & Bedtime Medications (17:00+)",

    // Family Screen
    familyDashboardTitle: "Caregiver Command Center",
    familyDashboardSubtitle: "Real-time medication adherence & clinical oversight for Ramesh Patel",
    adherenceRate: "7-Day Adherence Rate",
    dosesTaken: "Doses Confirmed",
    dosesMissed: "Doses Missed",
    totalScheduled: "Total Scheduled",
    weeklyTrend: "Adherence Audit Log",
    medicationsTab: "Manage Medications",
    appointmentsTab: "Doctor Appointments",
    notificationsTab: "Notification Engine",
    addMedicationBtn: "Add New Medication",
    editMedicationBtn: "Edit Schedule",
    deleteMedicationBtn: "Remove",
    addAppointmentBtn: "Schedule Doctor Visit",
    editAppointmentBtn: "Edit Appointment",
    sendTestEmailBtn: "Trigger Simulated Email Test",
    sendingEmail: "Processing Dispatch...",
    emailSentSuccess: "Notification test triggered! Check recipient inbox or server log.",
    testEmailDesc: "Test transactional email alerts (Resend API integration or verified local simulation).",
    recipientEmailLabel: "Caretaker Email Address",
    medName: "Medication Name",
    dosage: "Dosage (e.g., 500mg, 1 tablet)",
    timesOfDay: "Scheduled Times (24h format, comma separated)",
    instructionsLabel: "Instructions & Guidance",
    pillColorLabel: "Pill Color Indicator",
    saveBtn: "Save Changes",
    doctorName: "Doctor's Name",
    specialty: "Medical Specialty",
    clinic: "Clinic / Hospital Name",
    dateTime: "Date & Time",
    notes: "Notes for Doctor Visit",
    upcomingAppts: "Scheduled Doctor Appointments",
    pastAppts: "Past Doctor Visits",
    noAppts: "No doctor appointments found.",
    noMeds: "No active medications configured.",

    // Search & Filters
    searchMedsPlaceholder: "Search medications by name or instructions...",
    filterAll: "All Periods",
    filterMorning: "Morning",
    filterAfternoon: "Afternoon",
    filterEvening: "Night",
    filterUpcoming: "Upcoming Visits",
    filterPast: "Completed Visits",
    streakLabel: "Adherence Streak",
    streakDaysUnit: "Consecutive Days",
    clickDayToFilter: "Click any date to inspect daily adherence records:",
    showingLogsFor: "Showing records for:",
    clearDateFilter: "Show All 7 Days",
    previewEmailBtn: "Inspect Email Template HTML",
    simulatedInspectorTitle: "Transactional Email Preview Inspector",

    // Landing Page
    howItWorksTitle: "How CareCircle AI Works",
    howItWorksSubtitle: "A continuous loop of care designed for elderly independence and family peace of mind",
    step1Title: "1. Family Sets the Schedule",
    step1Desc: "Caretakers configure medications, dosages, times of day, and upcoming clinic visits in the web portal.",
    step2Title: "2. Elderly 1-Tap Confirmation",
    step2Desc: "Seniors receive large visual cues and tap once to log their medication with instant reassuring feedback.",
    step3Title: "3. Real-Time Adherence & Alerts",
    step3Desc: "Families monitor adherence metrics and receive alerts if doses are missed or appointments are near.",
    previewHeroTitle: "Live Interactive Dashboard Preview",
    medicalDisclaimer: "Medical Notice: CareCircle AI is a collaborative routine scheduling aid featuring fictional patient data for hackathon evaluation. Always consult licensed medical practitioners for healthcare decisions.",
  },
  hi: {
    appName: "केयरसर्कल AI (CareCircle AI)",
    tagline: "बुजुर्गों की देखभाल और दवा प्रबंधन का सुरक्षित मंच",
    selectRole: "जारी रखने के लिए दृश्य चुनें",
    elderlyMode: "बुजुर्ग सहायता व्यू (Elderly View)",
    elderlyDesc: "बड़े बटन, उच्च कंट्रास्ट और 1-क्लिक दवा ट्रैकिंग।",
    familyMode: "परिवार व देखभालकर्ता पोर्टल (Family View)",
    familyDesc: "दवा का रिकॉर्ड, कैलेंडर, शेड्यूल, डॉक्टर अपॉइंटमेंट और ईमेल अलर्ट।",
    enterPin: "4-अंकों का पिन दर्ज करें",
    enterFamilyCode: "परिवार एक्सेस कोड दर्ज करें",
    pinPlaceholder: "उदा. 1234",
    codePlaceholder: "उदा. CARE2026",
    loginBtn: "डैशबोर्ड खोलें",
    logoutBtn: "बाहर निकलें / मोड बदलें",
    quickDemoPin: "डेमो पिन: 1234",
    quickDemoFamily: "डेमो कोड: CARE2026",
    demoBadge: "काल्पनिक मरीज: रमेश पटेल (उम्र 72 वर्ष)",
    demoNotice: "यह केवल काल्पनिक डेमो डेटा है। पासकोड सुरक्षित रूप से एन्क्रिप्टेड हैं।",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    loading: "प्रक्रिया जारी है...",
    errorInvalidPin: "अमान्य पासकोड। कृपया पुनः प्रयास करें।",
    errorRateLimited: "बहुत अधिक गलत प्रयास। कृपया कुछ देर प्रतीक्षा करें।",

    // Elderly Screen
    elderlyGreeting: "नमस्ते, रमेश जी",
    todaysMeds: "आज की दवाइयों की समय-सारणी",
    nextDoseNow: "दवा लेने का समय हो गया है",
    noUpcomingDose: "शाबाश! इस समय कोई दवा बाकी नहीं है।",
    takeDoseBtn: "मैंने यह दवा ले ली ✓",
    alreadyTaken: "दवा ली गई समय:",
    missedDose: "दवा छूट गई",
    takeWithFood: "खाने और पानी के साथ लें",
    instructions: "विशेष निर्देश",
    emergencyTitle: "नामित देखभालकर्ता संपर्क",
    emergencyContactLabel: "परिवार का देखभालकर्ता (डेमो प्लेसहोल्डर — कॉल करने योग्य नहीं)",
    emergencyNotice: "वास्तविक आपात स्थिति में कृपया तुरंत आपातकालीन नंबर पर कॉल करें।",
    doctorApptBanner: "डॉक्टर से मिलने का समय",
    congratsTaken: "दवा लेने की पुष्टि हो गई!",
    scheduledAt: "निर्धारित समय",
    morning: "सुबह",
    afternoon: "दोपहर",
    evening: "शाम",
    night: "रात",
    morningMeds: "सुबह की दवाइयाँ (06:00 - 12:00)",
    afternoonMeds: "दोपहर की दवाइयाँ (12:00 - 17:00)",
    eveningMeds: "शाम और रात की दवाइयाँ (17:00+)",

    // Family Screen
    familyDashboardTitle: "देखभालकर्ता कमांड सेंटर",
    familyDashboardSubtitle: "रमेश पटेल जी की दवा और स्वास्थ्य दिनचर्या की रीयल-टाइम निगरानी",
    adherenceRate: "7-दिवसीय दवा अनुपालन दर",
    dosesTaken: "पुष्टि की गई खुराक",
    dosesMissed: "छूटी हुई खुराक",
    totalScheduled: "कुल निर्धारित",
    weeklyTrend: "दवा अनुपालन ऑडिट लॉग",
    medicationsTab: "दवाइयाँ प्रबंधित करें",
    appointmentsTab: "डॉक्टर अपॉइंटमेंट",
    notificationsTab: "नोटिफिकेशन इंजन",
    addMedicationBtn: "नई दवा जोड़ें",
    editMedicationBtn: "संपादित करें",
    deleteMedicationBtn: "हटाएं",
    addAppointmentBtn: "डॉक्टर अपॉइंटमेंट जोड़ें",
    editAppointmentBtn: "अपॉइंटमेंट बदलें",
    sendTestEmailBtn: "सिम्युलेटेड ईमेल टेस्ट भेजें",
    sendingEmail: "प्रक्रिया जारी है...",
    emailSentSuccess: "ईमेल टेस्ट भेजा गया! इनबॉक्स या सर्वर लॉग जांचें।",
    testEmailDesc: "ट्रांसेक्शनल ईमेल अलर्ट का परीक्षण करें (Resend API या लोकल सिमुलेशन)।",
    recipientEmailLabel: "देखभालकर्ता का ईमेल पता",
    medName: "दवा का नाम",
    dosage: "खुराक (उदा. 500mg, 1 गोली)",
    timesOfDay: "दवा लेने का समय (उदा. 08:00, 20:00)",
    instructionsLabel: "निर्देश और सलाह",
    pillColorLabel: "गोली का रंग",
    saveBtn: "सुरक्षित करें",
    doctorName: "डॉक्टर का नाम",
    specialty: "विशेषज्ञता",
    clinic: "क्लीनिक / अस्पताल",
    dateTime: "दिनांक और समय",
    notes: "आवश्यक नोट्स",
    upcomingAppts: "आगामी डॉक्टर अपॉइंटमेंट",
    pastAppts: "पूर्व अपॉइंटमेंट",
    noAppts: "कोई अपॉइंटमेंट नहीं मिली।",
    noMeds: "वर्तमान में कोई दवा सक्रिय नहीं है।",

    // Search & Filters
    searchMedsPlaceholder: "दवा का नाम या निर्देश खोजें...",
    filterAll: "सभी समय",
    filterMorning: "सुबह",
    filterAfternoon: "दोपहर",
    filterEvening: "रात",
    filterUpcoming: "आगामी विज़िट",
    filterPast: "पूर्ण विज़िट",
    streakLabel: "नियमितता स्ट्रीक",
    streakDaysUnit: "लगातार दिन",
    clickDayToFilter: "दैनिक रिकॉर्ड देखने के लिए किसी भी तारीख पर क्लिक करें:",
    showingLogsFor: "इस दिन का रिकॉर्ड दिख रहा है:",
    clearDateFilter: "सभी 7 दिन देखें",
    previewEmailBtn: "ईमेल टेम्प्लेट HTML देखें",
    simulatedInspectorTitle: "ईमेल पूर्वावलोकन इंस्पेक्टर",

    // Landing Page
    howItWorksTitle: "केयरसर्कल AI कैसे काम करता है",
    howItWorksSubtitle: "बुजुर्गों की स्वतंत्रता और परिवार की शांति के लिए तैयार किया गया मंच",
    step1Title: "1. परिवार शेड्यूल सेट करता है",
    step1Desc: "देखभालकर्ता पोर्टल पर दवाइयाँ, खुराक और डॉक्टर अपॉइंटमेंट दर्ज करते हैं।",
    step2Title: "2. बुजुर्ग 1-टैप में पुष्टि करते हैं",
    step2Desc: "बुजुर्गों को बड़े बटन दिखते हैं और वे दवा लेने के बाद एक क्लिक में पुष्टि करते हैं।",
    step3Title: "3. रीयल-टाइम अलर्ट और समीक्षा",
    step3Desc: "परिवार को रीयल-टाइम रिकॉर्ड दिखता है और दवा छूटने पर तुरंत अलर्ट मिलता है।",
    previewHeroTitle: "इंटरैक्टिव डैशबोर्ड पूर्वावलोकन",
    medicalDisclaimer: "चिकित्सीय सूचना: केयरसर्कल AI एक सहायक शेड्यूलिंग मंच है जो काल्पनिक डेमो डेटा पर चलता है। किसी भी चिकित्सीय निर्णय के लिए हमेशा योग्य डॉक्टर से सलाह लें।",
  },
};
