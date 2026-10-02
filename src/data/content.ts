// Project CALM — centralized content.
// Every string here comes verbatim from the approved brief. Do not rewrite
// medical claims, invent statistics, doctors, patient stories, hospitals, or
// insurance providers. Swap placeholders only when real assets/copy arrive.

export const SITE = {
  name: "PROJECT CALM",
  tagline: "Understand. Decide. Move forward.",
};

export const NAV_LINKS = [
  { label: "Understanding", href: "/" },
  { label: "Treatment", href: "/treatment" },
  { label: "Resources", href: "/resources" },
];

export const VIDEO_SRC = "/assets/calm-artery.mp4";
export const VIDEO_POSTER = "/assets/calm-artery-poster.jpg";
export const VIDEO_DURATION = 31;

// Configurable timestamp markers (seconds) — adjust freely as the cut changes.
export const VIDEO_MARKERS = {
  healthy: 0,
  plaque: 6,
  calcium: 11,
  narrowing: 16,
  treatment: 21,
  recovery: 26,
  ending: 31,
};

export const VIDEO_STORY_BEATS = [
  { from: 0, to: 5, text: "Your arteries carry blood to your heart." },
  { from: 6, to: 10, text: "Over time, plaque can build up." },
  { from: 11, to: 15, text: "Calcium can make that buildup hard and rigid." },
  { from: 16, to: 20, text: "The passage can become significantly narrower." },
  { from: 21, to: 25, text: "That is why some calcium blockages need a different approach." },
  { from: 26, to: 31, text: "Understanding what is happening is the first step." },
];

export const HERO = {
  headline: "Calcium in Your Arteries.\nUnderstand It, Then Act On It.",
  subline: "Clear answers, in plain language, before you decide what comes next.",
  cta: "Explore Your Journey",
  scrollHint: "Scroll to understand",
};

export const HASHTAG_REVEAL = {
  caption: "Every heart is different. So is every blockage.",
};

export const CONDITION_INTRO = {
  title: "Understanding the Condition",
  subtitle: "What Is a Calcium Blockage",
  body: "A healthy artery lets blood flow freely. Over time, fat and cholesterol build up inside the artery wall, and calcium settles on top, hardening it further. This narrows the passage and reduces blood flow to the heart. A calcium blockage isn't the same as a regular one. It's harder, stiffer, and needs a different treatment approach.",
  diagram: {
    plaque: "Fat & cholesterol build-up",
    calcium: "Calcium — hardens the buildup",
    flow: "Blood flow, slowed by the narrowing",
    instruction: "Tap a stage to see how it forms",
    stageHealthy: "Healthy",
    stageBuildup: "Early Buildup",
    stageSevere: "Severe Blockage",
  },
};

export const ANATOMY = {
  title: "Where It Happens",
  body: "Calcium blockages most commonly form in the arteries that feed the heart muscle directly. Doctors measure severity by how much the artery has narrowed; anything above 70% is considered severe and needs treatment.",
  statValue: "70%",
  statLabel: "Narrowing considered severe and in need of treatment.",
};

export const RISK_FACTORS = [
  { key: "age", label: "Age", icon: "CalendarClock" },
  { key: "diabetes", label: "Diabetes or High Blood Pressure", icon: "HeartPulse" },
  { key: "smoking", label: "Smoking", icon: "Cigarette" },
  { key: "family", label: "Family History of Heart Disease", icon: "Users" },
  { key: "cholesterol", label: "High Cholesterol", icon: "Droplet" },
  { key: "kidney", label: "Chronic Kidney Disease", icon: "Activity" },
  { key: "sedentary", label: "Sedentary Lifestyle", icon: "Armchair" },
  { key: "obesity", label: "Obesity or Excess Weight", icon: "Weight" },
];

export const RISK_SECTION_TITLE = "Know Your Risk";
export const RISK_SECTION_SUBTITLE = "A few factors raise the odds of calcium buildup in your arteries:";

// Self-check questions for the "Know Your Risk" cards. This is a simple,
// transparent tally of common general risk factors — NOT a clinical risk
// score or diagnostic tool. `appliesTo` marks which options count toward
// the "factors that apply to you" tally shown after answering.
export const RISK_QUESTIONS: Record<
  string,
  { question: string; options: string[]; appliesTo: string[] }
> = {
  age: {
    question: "What is your age range?",
    options: ["Under 20", "20–40", "40–60", "Above 60"],
    appliesTo: ["40–60", "Above 60"],
  },
  diabetes: {
    question: "Have you been diagnosed with diabetes or high blood pressure?",
    options: ["Diabetes", "High blood pressure", "Both", "Neither"],
    appliesTo: ["Diabetes", "High blood pressure", "Both"],
  },
  smoking: {
    question: "Do you currently smoke, or have you smoked in the past?",
    options: ["Yes, currently", "Yes, in the past", "No"],
    appliesTo: ["Yes, currently", "Yes, in the past"],
  },
  family: {
    question: "Does anyone in your immediate family have a history of heart disease?",
    options: ["Yes", "No", "Not sure"],
    appliesTo: ["Yes"],
  },
  cholesterol: {
    question: "Have you been told you have high cholesterol?",
    options: ["Yes", "No", "Not sure"],
    appliesTo: ["Yes"],
  },
  kidney: {
    question: "Have you been diagnosed with chronic kidney disease?",
    options: ["Yes", "No"],
    appliesTo: ["Yes"],
  },
  sedentary: {
    question: "How much physical activity do you get in a typical week?",
    options: ["Less than 150 minutes", "150 minutes or more"],
    appliesTo: ["Less than 150 minutes"],
  },
  obesity: {
    question: "Have you been told you're overweight or obese (by BMI or a doctor)?",
    options: ["Yes", "No", "Not sure"],
    appliesTo: ["Yes"],
  },
};

export const STATS_BY_NUMBERS = {
  title: "By the Numbers",
  stats: [
    { value: "2 in 3", label: "Patients feel anxious before a cardiac procedure." },
    { value: "4 lakh+", label: "Angioplasty procedures happen in India every year." },
    { value: "92.4%", label: "Procedural success rate with IVL treatment." },
  ],
  disclaimer: "Sources and references available on request.",
};

export const MYTH_FACTS = [
  {
    myth: "No symptoms means no blockage.",
    fact: "It often develops silently, with no warning signs.",
  },
  {
    myth: "Treatment always means open heart surgery.",
    fact: "Many patients can receive treatment through a simple catheter procedure, avoiding open-heart surgery.",
  },
  {
    myth: "Once you feel better, you can stop your medicines.",
    fact: "Stopping too early is a leading cause of complications.",
  },
];

export const MYTH_FACT_TITLE = "Myth vs Fact";

// ── Treatment page ──────────────────────────────────────────────────────

export const TREATMENT_HERO = {
  headline: "Your Path Through Treatment,\nStep by Step.",
  subline: "For you, and for the person walking this with you.",
};

export const TREATMENT_SECTION_TITLE = "When a Standard Balloon Isn't Enough";

export const TREATMENTS = [
  {
    key: "ivl",
    title: "Intravascular Lithotripsy",
    body: "sonic pressure waves break up the calcium from inside",
  },
  {
    key: "balloons",
    title: "Specialized Balloons",
    body: "higher pressure, or blades that score the calcium first",
  },
  {
    key: "atherectomy",
    title: "Atherectomy",
    body: "a device that shaves or drills away the calcium",
  },
];

export const CAD_PAD = {
  cad: {
    title: "Coronary Artery Disease",
    body: "affects the arteries feeding the heart.",
  },
  pad: {
    title: "Peripheral Artery Disease",
    body: "affects arteries elsewhere in the body, most often the legs, and can cause pain or cramping while walking.",
  },
};

export const PROVEN_OUTCOMES = {
  title: "Proven Outcomes",
  stats: [
    { value: "92.4%", label: "Procedural success rate" },
    { value: "98%", label: "Successful therapy delivery" },
    { value: "92.2%", label: "Patients free of major cardiac events at 30 days post-procedure" },
  ],
  disclaimer: "Sources and references available on request.",
};

export const JOURNEY_TITLE = "Your Journey to a Healthy Heart";

export const JOURNEY_STEPS = [
  { num: "01", title: "Diagnosis", body: "Something feels different, and your doctor investigates." },
  { num: "02", title: "Angiography", body: "Imaging pinpoints exactly where the blockage is." },
  { num: "03", title: "Treatment Decision", body: "You and your doctor choose the right approach together." },
  { num: "04", title: "The Procedure", body: "Minimally invasive, no open surgery." },
  { num: "05", title: "Recovery", body: "Rest, medicines, and a gradual return to activity." },
  { num: "06", title: "Healthy Life", body: "Back to your routine, your walks, your family." },
];

export const CHECKLIST_TITLE = "Before Your Procedure";

export const CHECKLIST_ITEMS = [
  "Follow your doctor's fasting instructions",
  "Tell your care team about every medicine you're currently on",
  "Arrange for someone to bring you home",
  "Carry your reports, ID, and insurance details",
  "Write down your questions in advance",
];

export const EMOTIONAL_SECTION = {
  title: "What You're Feeling Is Normal.",
  body: "A diagnosis like this brings more than a medical challenge; fear, confusion, and uncertainty are part of it for the whole family. You're not the first to feel this way, and support is closer than it feels right now.",
};

export const CAREGIVER_SECTION = {
  title: "For the Caregiver",
  body: "You don't need every answer; being present is often enough. Help gently with medicine and follow-up reminders. Watch for warning signs. And look after your own energy too; too many opinions in the room can add pressure rather than ease it. Let the medical team guide the decisions.",
};

export const QUESTIONS_TITLE = "Questions Worth Asking Before You Go In";

export const QUESTIONS = [
  "What type of blockage do I have, and is calcium involved?",
  "Is standard angioplasty right for my case? What do you recommend, and why?",
  "Will I need open heart surgery?",
  "How long will the procedure and hospital stay take?",
  "What medicines will I need afterward, and when's my follow-up?",
];

export const WATCH_TITLE = "After the Procedure — What to Watch";

export const WATCH_CARDS = [
  {
    key: "normal",
    title: "Normal",
    items: ["Mild discomfort", "Slight fatigue", "Soreness at the site", "Feeling emotional"],
  },
  {
    key: "call",
    title: "Call Your Doctor",
    items: [
      "Discomfort that isn't easing",
      "Swelling or redness at the site",
      "Fever above 100°F",
      "Breathlessness during light activity",
    ],
  },
  {
    key: "emergency",
    title: "Emergency",
    items: [
      "Severe chest pain",
      "Sudden breathlessness at rest",
      "Fainting",
      "One-sided weakness",
      "Rapid or irregular heartbeat with dizziness",
    ],
  },
];

export const INSURANCE_SECTION = {
  title: "Cost & Insurance",
  insurer: {
    title: "Ask Your Insurer",
    questions: [
      "Is this procedure covered under my policy?",
      "What's my sum insured, and is there a cap?",
      "Is cashless treatment available here?",
      "Any exclusions I should know about?",
    ],
  },
  billing: {
    title: "Ask the Billing Desk",
    questions: [
      "What's the estimated total cost?",
      "Is cashless insurance accepted here?",
      "Are any government schemes applicable to me?",
    ],
  },
};

export const LIFE_AFTER = {
  title: "Life After Treatment",
  items: [
    "Keep taking your medicines, even once you feel fine",
    "Don't skip follow-ups",
    "Build up activity gradually",
    "Eat for your heart: more dal, sabzi, and whole grains, less oil, salt, and sugar",
    "Manage stress and stay connected to your support system",
  ],
};

// ── Resources page ──────────────────────────────────────────────────────

export const RESOURCES_HERO = {
  headline: "You're Not Navigating This Alone.",
  subline: "Real experiences, real answers, and tools to help you decide.",
};

export const DOCTOR_INSIGHTS = {
  title: "Hear It From Your Doctors",
  subtitle: "Straight answers from the people who treat this every day.",
  // The videos themselves live in data/doctor-videos.json, managed from /admin.
  hashtag: "#HarBlockageSameNahiHota",
  searchPlaceholder: "Search by doctor or keyword",
  sortLabel: "Sort videos",
  sorts: { recent: "Recently Uploaded", views: "Most Viewed" },
  views: (n: number) => `${n} ${n === 1 ? "view" : "views"}`,
  likes: (n: number) => `${n} ${n === 1 ? "like" : "likes"}`,
  noResults: "No videos match your search.",
  clearSearch: "Clear search",
  clearFilter: "Clear Filter",
  dateLocale: "en-IN",
};

export const PATIENT_STORIES = {
  title: "You Are Not Alone",
  subtitle: "Real patients, real journeys, in their own words.",
  placeholders: [1, 2, 3],
  note: "[Client to provide patient stories]",
};

export const COFFEE_TABLE_BOOK = {
  title: "The Coffee Table Book, Online",
  body: "Everything in the book, and more. This site carries everything from the Project CALM book, with more detail and support at every step.",
  qrTitle: "Scanned a code from the book?\nYou're in the right place.",
};

export const TOOLS = [
  {
    key: "watch",
    title: "Know What to Watch",
    body: "Not sure how urgent it is? Check here.",
  },
  {
    key: "find-care",
    title: "Find Care Near You",
    body: "See doctors and support based on your location.",
  },
  {
    key: "language",
    title: "Language",
    body: "Read this site in your language.",
  },
  {
    key: "talk",
    title: "Talk to Someone",
    body: "Connect with a care counsellor, anytime.",
  },
];

export const CLOSING = {
  headline: "One Step at a Time.",
  body: "Every patient who's walked this path once felt exactly what you feel now, uncertain, a little afraid, unsure what comes next. Every one of them found their way through it. You don't have to manage this alone; your doctors, your family, and your care team are with you, one step at a time.",
  cta: "Explore Your Next Step",
  secondaryCta: "Talk to your Nearest Doctor",
};

export const DISCLAIMER =
  "This content is for general educational purposes only and is not intended as medical advice. Every patient's condition is different; please consult your doctor for guidance specific to your diagnosis and treatment plan.";

export const REFERENCES_TITLE = "References";

// Citations are kept in their original published form (author names, journal
// titles) rather than translated — standard practice for bibliographic
// references regardless of the site's display language.
export const REFERENCES = [
  "Barbato E, Gallinoro E, Abdel-Wahab M, et al. Management strategies for heavily calcified coronary stenoses: an EAPCI clinical consensus statement in collaboration with the EURO4C-PCR group. Eur Heart J. 2023;44(41):4340-4356.",
  "Lawton JS, Tamis-Holland JE, Bangalore S, et al. 2021 ACC/AHA/SCAI Guideline for Coronary Artery Revascularization. J Am Coll Cardiol. 2021;79(2):e21-e129.",
  "Hill JM, Kereiakes DJ, Shlofmitz RA, et al. Intravascular Lithotripsy for Treatment of Severely Calcified Coronary Artery Disease (DISRUPT CAD III). J Am Coll Cardiol. 2020;76(22):2635-2646.",
  "Afrassa N, Kassa RN, Legesse TG. Preoperative anxiety and its associated factors among patients undergoing cardiac catheterization at Saint Peter Specialized Hospital and Addis Cardiac Center, Addis Ababa, Ethiopia. Int J Afr Nurs Sci. 2022;17:100430.",
  "National Interventional Council. National interventional council data for the year 2018-India. Indian Heart J. 2020;72(5):351-355.",
  "After Your Interventional Procedure (Angioplasty & Heart Stent). Cleveland Clinic Patient Education.",
  "Mehran R, Baber U, Steg PG, et al. Cessation of dual antiplatelet treatment and cardiac events after percutaneous coronary intervention (PARIS): 2 year results from a prospective observational study. Lancet. 2013;382(9906):1714-1722.",
  "Czarny MJ, Nathan AS, Yeh RW, Mauri L. Adherence to dual antiplatelet therapy after coronary stenting: a systematic review. Clin Cardiol. 2014;37(8):505-513.",
];

export const FOOTER = {
  name: SITE.name,
  tagline: SITE.tagline,
};

// Shown above the logo/controls row in the footer on every page.
export const FOOTER_LEGAL_NOTICE =
  "This content is intended solely for informational and educational purposes and should not be construed as medical advice, diagnosis, treatment, or product promotion. Healthcare professionals should exercise their independent clinical judgment and refer to approved prescribing information, applicable guidelines, and local regulations when making clinical decisions. Any views expressed are those of the respective speakers and do not necessarily reflect those of an organization.\nIssued in Public Interest.";

// ── Small interface strings not tied to a single content section ────────
export const UI = {
  navbar: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    talkToSomeone: "Talk to Doctor",
  },
  footer: {
    medicalDisclaimer: "Medical Disclaimer",
    privacyPolicy: "Privacy Policy",
    terms: "Terms",
    contact: "Contact",
    rights: "All rights reserved.",
  },
  mythFact: {
    eyebrow: "Set the Record Straight",
    hint: "Is each statement true or false? Pick an answer to find out.",
    trueOrFalse: "True or false?",
    true: "True",
    false: "False",
    myth: "Myth",
    fact: "Fact",
    score: (correct: number, total: number) => `Score: ${correct} / ${total}`,
    perfect: "Perfect score! You've got it.",
    tryAgain: "Try Again",
  },
  questions: {
    hint: "Bring this to your appointment, and note down your doctor's answer.",
    addToList: "Add to my list",
    added: "Added",
    copy: "Copy my questions",
    copied: "Copied",
  },
  treatmentExplorer: {
    hint: "Tap a treatment to see how it works inside the artery.",
    howItWorks: "How it works",
    replay: "Replay",
    legendCalcium: "Calcium",
    legendDevice: "Device",
    legendFlow: "Blood flow",
  },
  bodyMap: {
    hint: "Tap a region of the body",
    heart: "Heart",
    legs: "Legs",
  },
  journey: {
    progress: (step: number, total: number) => `Step ${step} of ${total}`,
  },
  checklist: {
    progress: (done: number, total: number) => `${done} of ${total} done`,
    complete: "All set. You're ready for the day.",
  },
  breathing: {
    cta: "Try a calming breath",
    stop: "Stop",
    inhale: "Breathe in",
    hold: "Hold",
    exhale: "Breathe out",
    hint: "Follow the circle. A minute is enough.",
  },
  symptomChecker: {
    hint: "Not sure how urgent it is? Tap what you're noticing.",
    clear: "Clear",
    fallsUnder: "This falls under",
  },
  insurance: {
    hint: "Tap a question once you've asked it.",
    asked: (n: number, total: number) => `${n} of ${total} asked`,
  },
  book: {
    openHint: "Tap to Read",
    downloadCta: "Download the Book",
    downloadHint: "Tap and read before downloading",
    readerTitle: "The Coffee Table Book",
    prev: "Previous page",
    next: "Next page",
    page: (i: number, total: number) => `Page ${i} of ${total}`,
  },
  caregiver: {
    prev: "Previous",
    next: "Next",
    counter: (i: number, total: number) => `${i} of ${total}`,
  },
  media: {
    close: "Close",
  },
  tools: {
    title: "Tools to Help You Decide",
    watchLink: 'Jump to "After the Procedure — What to Watch"',
    findCarePlaceholder: "[Location-based directory to be added]",
    languageLabel: "Language",
    languageCurrent: "English",
    languageComingSoon: "More languages coming soon",
    talkPlaceholder: "[Care counsellor contact details to be added]",
  },
  riskCards: {
    doodleLabel: "must try!",
    sectionHint: "Tap a card to answer — see your self-check score once you're done.",
    tapToAnswer: "Tap to answer",
    appliesToYou: "applies to you",
    doesntApply: "doesn't apply",
    summary: (applicable: number, answered: number) =>
      `${applicable} of ${answered} answered factor${answered === 1 ? "" : "s"} apply to you`,
    selfCheckLevel: "General self-check level",
    tierLower: "Lower",
    tierModerate: "Moderate",
    tierHigher: "Higher",
    selfCheckDisclaimer: "This is a simple self-check, not a clinical risk score. Share your answers with your doctor.",
    resetAnswers: "Reset answers",
    modalDisclaimer: "A general self-check, not a diagnosis — share your answers with your doctor.",
    calculateCta: "Know Your Score",
    calculating: "Calculating…",
    recalculate: "Recalculate",
  },
  theme: {
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
  },
};
