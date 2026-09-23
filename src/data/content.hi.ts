// Project CALM — Hindi content mirror of content.ts.
// Written in modern, conversational Hindi (the register used in everyday
// Hindi health journalism), not formal/Sanskritized "shuddh" Hindi — common
// English loanwords (प्रोसीजर, इंश्योरेंस, रिस्क, आदि) are used where that's
// how people actually speak. Numeric stat values are kept as-is (numbers and
// "lakh" don't need translating, and StatValue's count-up parsing depends on
// the leading digits matching).
// Keep this file's shape identical to content.ts — every key, same order.

export const SITE = {
  name: "PROJECT CALM",
  tagline: "समझें। तय करें। आगे बढ़ें।",
};

export const NAV_LINKS = [
  { label: "समझ", href: "/" },
  { label: "इलाज", href: "/treatment" },
  { label: "संसाधन", href: "/resources" },
];

export const VIDEO_SRC = "/assets/calm-artery.mp4";
export const VIDEO_POSTER = "/assets/calm-artery-poster.jpg";
export const VIDEO_DURATION = 31;

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
  { from: 0, to: 5, text: "आपकी धमनियां दिल तक खून पहुंचाती हैं।" },
  { from: 6, to: 10, text: "समय के साथ, इनमें प्लाक जमा हो सकता है।" },
  { from: 11, to: 15, text: "कैल्शियम इस जमाव को सख्त और कड़ा बना सकता है।" },
  { from: 16, to: 20, text: "इससे रास्ता काफी संकरा हो सकता है।" },
  { from: 21, to: 25, text: "इसीलिए कुछ कैल्शियम ब्लॉकेज के लिए अलग तरीके की ज़रूरत होती है।" },
  { from: 26, to: 31, text: "क्या हो रहा है, यह समझना ही पहला कदम है।" },
];

export const HERO = {
  headline: "आपकी धमनियों में कैल्शियम.\nपहले समझें, फिर कदम उठाएं।",
  subline: "आगे का फैसला लेने से पहले, आसान भाषा में साफ जवाब।",
  cta: "अपना सफर शुरू करें",
  scrollHint: "समझने के लिए स्क्रॉल करें",
};

export const CONDITION_INTRO = {
  title: "इस स्थिति को समझें",
  subtitle: "कैल्शियम ब्लॉकेज क्या है",
  body: "एक सेहतमंद धमनी में खून बिना रुकावट बहता है। समय के साथ, धमनी की दीवार के अंदर फैट और कोलेस्ट्रॉल जमा होने लगता है, और उसके ऊपर कैल्शियम जमकर इसे और सख्त बना देता है। इससे रास्ता संकरा हो जाता है और दिल तक खून का बहाव कम हो जाता है। कैल्शियम ब्लॉकेज एक सामान्य ब्लॉकेज जैसा नहीं होता। यह ज़्यादा सख्त, कड़ा होता है और इसके इलाज का तरीका भी अलग होता है।",
  diagram: {
    plaque: "फैट और कोलेस्ट्रॉल का जमाव",
    calcium: "कैल्शियम — जमाव को सख्त बनाता है",
    flow: "खून का बहाव, संकरे रास्ते से धीमा",
    instruction: "यह कैसे बनता है देखने के लिए किसी स्टेज पर टैप करें",
    stageHealthy: "सेहतमंद",
    stageBuildup: "शुरुआती जमाव",
    stageSevere: "गंभीर ब्लॉकेज",
  },
};

export const ANATOMY = {
  title: "यह कहां होता है",
  body: "कैल्शियम ब्लॉकेज ज़्यादातर उन धमनियों में बनता है जो सीधे दिल की मांसपेशियों तक खून पहुंचाती हैं। डॉक्टर यह देखते हैं कि धमनी कितनी संकरी हुई है; 70% से ज़्यादा संकरापन गंभीर माना जाता है और इसके लिए इलाज ज़रूरी होता है।",
  statValue: "70%",
  statLabel: "इतना संकरापन गंभीर माना जाता है और इलाज की ज़रूरत होती है।",
};

export const RISK_FACTORS = [
  { key: "age", label: "उम्र", icon: "CalendarClock" },
  { key: "diabetes", label: "डायबिटीज या हाई ब्लड प्रेशर", icon: "HeartPulse" },
  { key: "smoking", label: "स्मोकिंग", icon: "Cigarette" },
  { key: "family", label: "दिल की बीमारी का पारिवारिक इतिहास", icon: "Users" },
  { key: "cholesterol", label: "हाई कोलेस्ट्रॉल", icon: "Droplet" },
  { key: "kidney", label: "क्रॉनिक किडनी डिजीज", icon: "Activity" },
  { key: "sedentary", label: "इनएक्टिव लाइफस्टाइल", icon: "Armchair" },
  { key: "obesity", label: "मोटापा या ज़्यादा वज़न", icon: "Weight" },
];

export const RISK_SECTION_TITLE = "अपना जोखिम जानें";
export const RISK_SECTION_SUBTITLE = "कुछ फैक्टर्स आपकी धमनियों में कैल्शियम जमने की आशंका बढ़ा देते हैं:";

export const RISK_QUESTIONS: Record<
  string,
  { question: string; options: string[]; appliesTo: string[] }
> = {
  age: {
    question: "आपकी उम्र किस रेंज में है?",
    options: ["20 से कम", "20–40", "40–60", "60 से ज़्यादा"],
    appliesTo: ["40–60", "60 से ज़्यादा"],
  },
  diabetes: {
    question: "क्या आपको डायबिटीज या हाई ब्लड प्रेशर की पहचान हुई है?",
    options: ["डायबिटीज", "हाई ब्लड प्रेशर", "दोनों", "कोई नहीं"],
    appliesTo: ["डायबिटीज", "हाई ब्लड प्रेशर", "दोनों"],
  },
  smoking: {
    question: "क्या आप अभी स्मोकिंग करते हैं, या पहले करते थे?",
    options: ["हां, अभी करते हैं", "हां, पहले करते थे", "नहीं"],
    appliesTo: ["हां, अभी करते हैं", "हां, पहले करते थे"],
  },
  family: {
    question: "क्या आपके परिवार में किसी को दिल की बीमारी का इतिहास रहा है?",
    options: ["हां", "नहीं", "पता नहीं"],
    appliesTo: ["हां"],
  },
  cholesterol: {
    question: "क्या आपको हाई कोलेस्ट्रॉल की जानकारी दी गई है?",
    options: ["हां", "नहीं", "पता नहीं"],
    appliesTo: ["हां"],
  },
  kidney: {
    question: "क्या आपको क्रॉनिक किडनी डिजीज की पहचान हुई है?",
    options: ["हां", "नहीं"],
    appliesTo: ["हां"],
  },
  sedentary: {
    question: "आपको हफ्ते में कितनी फिजिकल एक्टिविटी मिलती है?",
    options: ["150 मिनट से कम", "150 मिनट या ज़्यादा"],
    appliesTo: ["150 मिनट से कम"],
  },
  obesity: {
    question: "क्या आपको बताया गया है कि आपका वज़न ज़्यादा है या आप मोटापे के शिकार हैं (BMI या डॉक्टर के मुताबिक)?",
    options: ["हां", "नहीं", "पता नहीं"],
    appliesTo: ["हां"],
  },
};

export const STATS_BY_NUMBERS = {
  title: "आंकड़ों में",
  stats: [
    { value: "2 in 3", label: "मरीज़ हार्ट प्रोसीजर से पहले घबराहट महसूस करते हैं।" },
    { value: "4 lakh+", label: "एंजियोप्लास्टी प्रोसीजर हर साल भारत में होते हैं।" },
    { value: "92.4%", label: "IVL ट्रीटमेंट की प्रोसीजरल सक्सेस रेट।" },
  ],
  disclaimer: "स्रोत और रेफरेंस मांगने पर उपलब्ध हैं।",
};

export const MYTH_FACTS = [
  {
    myth: "कोई लक्षण नहीं मतलब कोई ब्लॉकेज नहीं।",
    fact: "यह अक्सर बिना किसी संकेत के, चुपचाप बनता है।",
  },
  {
    myth: "इलाज का मतलब हमेशा ओपन हार्ट सर्जरी होता है।",
    fact: "ज़्यादातर मामलों का इलाज एक छोटे कैथेटर से होता है, सर्जरी की ज़रूरत नहीं पड़ती।",
  },
  {
    myth: "बेहतर महसूस होते ही दवाएं बंद की जा सकती हैं।",
    fact: "जल्दी दवा बंद करना कॉम्प्लिकेशन की एक बड़ी वजह है।",
  },
];

export const MYTH_FACT_TITLE = "मिथ बनाम फैक्ट";

// ── Treatment page ──────────────────────────────────────────────────────

export const TREATMENT_HERO = {
  headline: "इलाज का रास्ता,\nएक-एक कदम।",
  subline: "आपके लिए, और आपके साथ चलने वाले के लिए भी।",
};

export const TREATMENT_SECTION_TITLE = "जब एक सामान्य बैलून काफी नहीं होता";

export const TREATMENTS = [
  {
    key: "ivl",
    title: "इंट्रावस्कुलर लिथोट्रिप्सी",
    body: "सोनिक प्रेशर वेव्स अंदर से कैल्शियम को तोड़ती हैं",
  },
  {
    key: "balloons",
    title: "स्पेशलाइज्ड बैलून",
    body: "ज़्यादा प्रेशर वाले, या ब्लेड जो पहले कैल्शियम पर निशान डालते हैं",
  },
  {
    key: "atherectomy",
    title: "एथेरेक्टॉमी",
    body: "एक डिवाइस जो कैल्शियम को शेव या ड्रिल करके हटाती है",
  },
];

export const CAD_PAD = {
  cad: {
    title: "कोरोनरी आर्टरी डिजीज",
    body: "यह दिल तक खून पहुंचाने वाली धमनियों को प्रभावित करती है।",
  },
  pad: {
    title: "पेरिफेरल आर्टरी डिजीज",
    body: "यह शरीर के बाकी हिस्सों की धमनियों को प्रभावित करती है, ज़्यादातर पैरों की, और चलते समय दर्द या ऐंठन पैदा कर सकती है।",
  },
};

export const PROVEN_OUTCOMES = {
  title: "साबित नतीजे",
  stats: [
    { value: "92.4%", label: "प्रोसीजरल सक्सेस रेट" },
    { value: "98%", label: "सक्सेसफुल थेरेपी डिलीवरी" },
    { value: "92.2%", label: "प्रोसीजर के 30 दिन बाद बड़ी हार्ट प्रॉब्लम से मुक्त मरीज़" },
  ],
  disclaimer: "स्रोत और रेफरेंस मांगने पर उपलब्ध हैं।",
};

export const JOURNEY_TITLE = "सेहतमंद दिल की तरफ आपका सफर";

export const JOURNEY_STEPS = [
  { num: "01", title: "डायग्नोसिस", body: "कुछ अलग महसूस होता है, और डॉक्टर जांच शुरू करते हैं।" },
  { num: "02", title: "एंजियोग्राफी", body: "इमेजिंग से पता चलता है कि ब्लॉकेज ठीक कहां है।" },
  { num: "03", title: "इलाज का फैसला", body: "आप और आपके डॉक्टर मिलकर सही तरीका तय करते हैं।" },
  { num: "04", title: "प्रोसीजर", body: "मिनिमली इनवेसिव, कोई ओपन सर्जरी नहीं।" },
  { num: "05", title: "रिकवरी", body: "आराम, दवाएं, और धीरे-धीरे रोज़मर्रा की एक्टिविटी में वापसी।" },
  { num: "06", title: "सेहतमंद ज़िंदगी", body: "वापस अपनी रूटीन में, अपनी वॉक में, अपने परिवार के साथ।" },
];

export const CHECKLIST_TITLE = "प्रोसीजर से पहले";

export const CHECKLIST_ITEMS = [
  "डॉक्टर की फास्टिंग से जुड़ी सलाह का पालन करें",
  "आप जो भी दवाएं ले रहे हैं, उनके बारे में केयर टीम को बताएं",
  "किसी को अपने साथ घर लाने के लिए तैयार रखें",
  "अपने रिपोर्ट्स, आईडी और इंश्योरेंस डिटेल्स साथ रखें",
  "अपने सवाल पहले से लिखकर रखें",
];

export const EMOTIONAL_SECTION = {
  title: "जो आप महसूस कर रहे हैं, वो नॉर्मल है।",
  body: "ऐसी डायग्नोसिस सिर्फ मेडिकल चुनौती नहीं लाती; डर, उलझन और अनिश्चितता पूरे परिवार के लिए इसका हिस्सा होते हैं। ऐसा महसूस करने वाले आप अकेले नहीं हैं, और सपोर्ट जितना दूर लगता है, उतना है नहीं।",
};

export const CAREGIVER_SECTION = {
  title: "केयरगिवर के लिए",
  body: "आपके पास हर जवाब होना ज़रूरी नहीं; बस साथ होना अक्सर काफी होता है। दवाओं और फॉलो-अप रिमाइंडर में धीरे से मदद करें। वॉर्निंग साइन पर नज़र रखें। और अपनी एनर्जी का भी ख्याल रखें; कमरे में बहुत ज़्यादा राय दबाव बढ़ा सकती है, कम नहीं करती। फैसले मेडिकल टीम को लेने दें।",
};

export const QUESTIONS_TITLE = "अंदर जाने से पहले पूछने लायक सवाल";

export const QUESTIONS = [
  "मुझे किस तरह का ब्लॉकेज है, और क्या इसमें कैल्शियम शामिल है?",
  "क्या मेरे केस के लिए स्टैंडर्ड एंजियोप्लास्टी सही है? आप क्या सुझाते हैं, और क्यों?",
  "क्या मुझे ओपन हार्ट सर्जरी की ज़रूरत पड़ेगी?",
  "प्रोसीजर और हॉस्पिटल में रहना कितने समय का होगा?",
  "बाद में मुझे कौन सी दवाएं चाहिए होंगी, और मेरा फॉलो-अप कब है?",
];

export const WATCH_TITLE = "प्रोसीजर के बाद — किन बातों पर नज़र रखें";

export const WATCH_CARDS = [
  {
    key: "normal",
    title: "नॉर्मल",
    items: ["हल्की तकलीफ", "थोड़ी थकान", "जगह पर हल्का दर्द", "इमोशनल महसूस होना"],
  },
  {
    key: "call",
    title: "डॉक्टर को कॉल करें",
    items: [
      "तकलीफ जो कम नहीं हो रही",
      "जगह पर सूजन या लालपन",
      "38°C से ज़्यादा बुखार",
      "हल्की एक्टिविटी में सांस फूलना",
    ],
  },
  {
    key: "emergency",
    title: "इमरजेंसी",
    items: [
      "तेज़ सीने में दर्द",
      "आराम की हालत में अचानक सांस फूलना",
      "बेहोश होना",
      "शरीर के एक तरफ कमज़ोरी",
      "चक्कर के साथ तेज़ या अनियमित दिल की धड़कन",
    ],
  },
];

export const INSURANCE_SECTION = {
  title: "खर्च और इंश्योरेंस",
  insurer: {
    title: "अपनी इंश्योरेंस कंपनी से पूछें",
    questions: [
      "क्या यह प्रोसीजर मेरी पॉलिसी में कवर होता है?",
      "मेरा सम इंश्योर्ड कितना है, और क्या कोई कैप है?",
      "क्या यहां कैशलेस इलाज उपलब्ध है?",
      "क्या कोई एक्सक्लूज़न है जो मुझे पता होना चाहिए?",
    ],
  },
  billing: {
    title: "बिलिंग डेस्क से पूछें",
    questions: [
      "कुल अनुमानित खर्च कितना है?",
      "क्या यहां कैशलेस इंश्योरेंस स्वीकार होता है?",
      "क्या मुझ पर कोई सरकारी योजना लागू होती है?",
    ],
  },
};

export const LIFE_AFTER = {
  title: "इलाज के बाद की ज़िंदगी",
  items: [
    "ठीक महसूस होने के बाद भी दवाएं लेते रहें",
    "फॉलो-अप मिस न करें",
    "धीरे-धीरे अपनी एक्टिविटी बढ़ाएं",
    "दिल के लिए खाएं: ज़्यादा दाल, सब्ज़ी और साबुत अनाज, कम तेल, नमक और चीनी",
    "स्ट्रेस मैनेज करें और अपने सपोर्ट सिस्टम से जुड़े रहें",
  ],
};

// ── Resources page ──────────────────────────────────────────────────────

export const RESOURCES_HERO = {
  headline: "यह सफर आप अकेले नहीं तय कर रहे।",
  subline: "असली अनुभव, असली जवाब, और फैसला लेने में मदद करने वाले टूल्स।",
};

export const DOCTOR_INSIGHTS = {
  title: "डॉक्टरों से सीधे सुनें",
  subtitle: "उन लोगों से सीधे जवाब, जो हर दिन इसका इलाज करते हैं।",
  placeholders: [1, 2, 3, 4],
  note: "[वीडियो जल्द जोड़े जाएंगे]",
};

export const PATIENT_STORIES = {
  title: "आप अकेले नहीं हैं",
  subtitle: "असली मरीज़, असली सफर, उन्हीं की ज़ुबानी।",
  placeholders: [1, 2, 3],
  note: "[मरीज़ों की कहानियां जल्द जोड़ी जाएंगी]",
};

export const COFFEE_TABLE_BOOK = {
  title: "कॉफी टेबल बुक, अब ऑनलाइन",
  body: "किताब में जो कुछ है, वो सब और उससे भी ज़्यादा। इस साइट पर Project CALM किताब की हर जानकारी है, हर कदम पर ज़्यादा डिटेल और सपोर्ट के साथ।",
  qrTitle: "किताब से कोई कोड स्कैन किया?\nआप सही जगह पर हैं।",
};

export const TOOLS = [
  {
    key: "watch",
    title: "किन बातों पर नज़र रखें, जानें",
    body: "पक्का नहीं कि कितना अर्जेंट है? यहां चेक करें।",
  },
  {
    key: "find-care",
    title: "अपने पास केयर ढूंढें",
    body: "अपनी लोकेशन के आधार पर डॉक्टर और सपोर्ट देखें।",
  },
  {
    key: "language",
    title: "भाषा",
    body: "इस साइट को अपनी भाषा में पढ़ें।",
  },
  {
    key: "talk",
    title: "किसी से बात करें",
    body: "कभी भी केयर काउंसलर से जुड़ें।",
  },
];

export const CLOSING = {
  headline: "एक बार में एक कदम।",
  body: "इस राह पर चला हर मरीज़ कभी वही महसूस करता था, जो अभी आप कर रहे हैं — अनिश्चित, थोड़ा डरा हुआ, यह न जानते हुए कि आगे क्या होगा। उन सबने अपना रास्ता ढूंढ लिया। आपको यह अकेले संभालने की ज़रूरत नहीं; आपके डॉक्टर, आपका परिवार, और आपकी केयर टीम, हर कदम पर आपके साथ हैं।",
  cta: "अगला कदम देखें",
  secondaryCta: "अपने नज़दीकी डॉक्टर से बात करें",
};

export const DISCLAIMER =
  "यह जानकारी सिर्फ सामान्य शिक्षा के मकसद से दी गई है और इसे मेडिकल सलाह नहीं माना जाना चाहिए। हर मरीज़ की स्थिति अलग होती है; अपनी डायग्नोसिस और इलाज से जुड़ी सही सलाह के लिए अपने डॉक्टर से सलाह लें।";

export const REFERENCES_TITLE = "संदर्भ";

// Citations are kept in their original published (English) form rather than
// translated — standard practice for bibliographic references regardless of
// the site's display language.
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

// Kept in English pending an approved Hindi translation of this legal
// notice — not translating it ourselves since a mistranslated medical/legal
// disclaimer is worse than none.
export const FOOTER_LEGAL_NOTICE =
  "This content is intended solely for informational and educational purposes and should not be construed as medical advice, diagnosis, treatment, or product promotion. Healthcare professionals should exercise their independent clinical judgment and refer to approved prescribing information, applicable guidelines, and local regulations when making clinical decisions. Any views expressed are those of the respective speakers and do not necessarily reflect those of an organization.\nIssued in Public Interest.";

export const UI = {
  navbar: {
    openMenu: "मेन्यू खोलें",
    closeMenu: "मेन्यू बंद करें",
    talkToSomeone: "डॉक्टर से बात करें",
  },
  footer: {
    medicalDisclaimer: "मेडिकल डिस्क्लेमर",
    privacyPolicy: "प्राइवेसी पॉलिसी",
    terms: "टर्म्स",
    contact: "कॉन्टैक्ट",
    rights: "सर्वाधिकार सुरक्षित।",
  },
  mythFact: {
    eyebrow: "सच जानिए",
    hint: "हर बात सही है या गलत? जवाब चुनकर जानें।",
    trueOrFalse: "सही या गलत?",
    true: "सही",
    false: "गलत",
    myth: "मिथ",
    fact: "फैक्ट",
    score: (correct: number, total: number) => `स्कोर: ${correct} / ${total}`,
    perfect: "पूरे अंक! आपने सही पहचान लिया।",
    tryAgain: "फिर से कोशिश करें",
  },
  questions: {
    hint: "इसे अपनी अपॉइंटमेंट पर ले जाएं, और डॉक्टर का जवाब नोट कर लें।",
    addToList: "मेरी लिस्ट में जोड़ें",
    added: "जोड़ा गया",
    copy: "मेरे सवाल कॉपी करें",
    copied: "कॉपी हो गया",
  },
  treatmentExplorer: {
    hint: "यह धमनी के अंदर कैसे काम करता है, देखने के लिए किसी इलाज पर टैप करें।",
    howItWorks: "यह कैसे काम करता है",
    replay: "फिर से देखें",
    legendCalcium: "कैल्शियम",
    legendDevice: "डिवाइस",
    legendFlow: "खून का बहाव",
  },
  bodyMap: {
    hint: "शरीर के किसी हिस्से पर टैप करें",
    heart: "दिल",
    legs: "पैर",
  },
  journey: {
    progress: (step: number, total: number) => `${total} में से कदम ${step}`,
  },
  checklist: {
    progress: (done: number, total: number) => `${total} में से ${done} हो गए`,
    complete: "सब तैयार है। आप उस दिन के लिए तैयार हैं।",
  },
  breathing: {
    cta: "एक शांत सांस लें",
    stop: "रोकें",
    inhale: "सांस अंदर लें",
    hold: "थामें",
    exhale: "सांस छोड़ें",
    hint: "गोले के साथ चलें। एक मिनट काफी है।",
  },
  symptomChecker: {
    hint: "पता नहीं कितना ज़रूरी है? जो महसूस हो रहा है उस पर टैप करें।",
    clear: "साफ़ करें",
    fallsUnder: "यह इस श्रेणी में आता है",
  },
  insurance: {
    hint: "पूछ लेने के बाद सवाल पर टैप करें।",
    asked: (n: number, total: number) => `${total} में से ${n} पूछे गए`,
  },
  book: {
    openHint: "पढ़ने के लिए टैप करें",
    downloadCta: "किताब डाउनलोड करें",
    downloadHint: "डाउनलोड करने से पहले टैप करके पढ़ें",
    readerTitle: "कॉफ़ी टेबल बुक",
    prev: "पिछला पेज",
    next: "अगला पेज",
    page: (i: number, total: number) => `${total} में से पेज ${i}`,
  },
  caregiver: {
    prev: "पिछला",
    next: "अगला",
    counter: (i: number, total: number) => `${total} में से ${i}`,
  },
  media: {
    close: "बंद करें",
  },
  tools: {
    title: "फैसला लेने में मदद करने वाले टूल्स",
    watchLink: '"प्रोसीजर के बाद — किन बातों पर नज़र रखें" पर जाएं',
    findCarePlaceholder: "[लोकेशन के आधार पर डायरेक्टरी जल्द जोड़ी जाएगी]",
    languageLabel: "भाषा",
    languageCurrent: "हिंदी",
    languageComingSoon: "और भाषाएं जल्द आ रही हैं",
    talkPlaceholder: "[केयर काउंसलर की कॉन्टैक्ट डिटेल्स जल्द जोड़ी जाएंगी]",
  },
  riskCards: {
    doodleLabel: "ज़रूर आज़माएं!",
    sectionHint: "जवाब देने के लिए किसी कार्ड पर टैप करें — पूरा होने पर अपना सेल्फ-चेक स्कोर देखें।",
    tapToAnswer: "जवाब देने के लिए टैप करें",
    appliesToYou: "आप पर लागू होता है",
    doesntApply: "लागू नहीं होता",
    summary: (applicable: number, answered: number) =>
      `${answered} में से ${applicable} जवाब दिए गए फैक्टर्स आप पर लागू होते हैं`,
    selfCheckLevel: "जनरल सेल्फ-चेक लेवल",
    tierLower: "कम",
    tierModerate: "मध्यम",
    tierHigher: "ज़्यादा",
    selfCheckDisclaimer: "यह सिर्फ एक आसान सेल्फ-चेक है, क्लिनिकल रिस्क स्कोर नहीं। अपने जवाब डॉक्टर के साथ शेयर करें।",
    resetAnswers: "जवाब रीसेट करें",
    modalDisclaimer: "यह एक सामान्य सेल्फ-चेक है, डायग्नोसिस नहीं — अपने जवाब डॉक्टर के साथ शेयर करें।",
    calculateCta: "अपना स्कोर जानें",
    calculating: "कैलकुलेट हो रहा है…",
    recalculate: "फिर से कैलकुलेट करें",
  },
  theme: {
    switchToLight: "लाइट मोड में जाएं",
    switchToDark: "डार्क मोड में जाएं",
  },
};
