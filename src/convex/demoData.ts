/**
 * Seed data for version 1.
 *
 * Every record here is a DEMO record: it exists to exercise the interface
 * before any live crawler exists. Nothing in this file claims to be a real,
 * currently-open vacancy.
 *
 * - `officialUrl` always points at the organization's real, verified careers
 *   page — never at an invented vacancy permalink.
 * - Closing/posted dates are generated relative to seed time so the UI's
 *   "closing soon" logic demonstrates real behaviour instead of stale dates.
 */

export interface SeedSource {
  key: string;
  nameAr: string;
  nameEn: string;
  url: string;
}

/** The six official sources required for version 1 (URLs verified 2026-10-30). */
export const SEED_SOURCES: SeedSource[] = [
  {
    key: "un-palestine",
    nameAr: "الأمم المتحدة في فلسطين",
    nameEn: "United Nations in Palestine",
    url: "https://palestine.un.org/en/jobs",
  },
  {
    key: "unicef",
    nameAr: "اليونيسف — الوظائف",
    nameEn: "UNICEF Careers",
    url: "https://jobs.unicef.org/en-us/listing/",
  },
  {
    key: "unrwa",
    nameAr: "الأونروا — الوظائف الشاغرة",
    nameEn: "UNRWA Vacancies",
    url: "https://www.unrwa.org/careers/vacancies",
  },
  {
    key: "who",
    nameAr: "المنظمة العالمية للصحة — الوظائف",
    nameEn: "WHO Careers",
    url: "https://careers.who.int/careersection/ex/jobsearch.ftl",
  },
  {
    key: "icrc",
    nameAr: "اللجنة الدولية للصليب الأحمر — وظائف",
    nameEn: "ICRC Careers",
    url: "https://careers.icrc.org/",
  },
  {
    key: "nrc",
    nameAr: "مجلس اللاجئين النرويجي — وظائف",
    nameEn: "NRC Careers",
    url: "https://www.nrc.no/careers",
  },
];

export interface SeedJob {
  key: string;
  sourceKey: string;
  titleAr: string;
  titleEn: string;
  locationAr: string;
  locationEn: string;
  summaryAr: string;
  summaryEn: string;
  tags: string[];
  postedDaysAgo: number;
  /** null = the sample record carries no closing date. */
  closesInDays: number | null;
}

export const SEED_JOBS: SeedJob[] = [
  {
    key: "unicef-nicu-nurse-gaza",
    sourceKey: "unicef",
    titleAr: "ممرضة/ممرض وحدة العناية المركزة للخُلّد (NICU)",
    titleEn: "Nurse — Neonatal Intensive Care (NICU)",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "دور تمريضي ضمن فريق الصحة لدعم وحدة العناية المركزة لحديثي الولادة: متابعة يومية للحالات الحرجة، دعم الأسر، وتوثيق الحالة السريرية.",
    summaryEn:
      "Nursing role within a health team supporting a neonatal intensive care unit: daily follow-up of critical cases, family support, and clinical documentation.",
    tags: ["nicu", "neonatal"],
    postedDaysAgo: 6,
    closesInDays: 12,
  },
  {
    key: "unicef-emergency-health-officer",
    sourceKey: "unicef",
    titleAr: "أخصائي/ة صحة الطوارئ",
    titleEn: "Health Emergency Officer",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "دعم استجابة الطوارئ الصحية في الميدان، وتنسيق دعم المرافق الصحية الأولية ضمن فريق الطوارئ.",
    summaryEn:
      "Supporting field health emergency response and coordinating primary health facility support within the emergency team.",
    tags: ["emergency", "general"],
    postedDaysAgo: 11,
    closesInDays: 21,
  },
  {
    key: "unicef-child-health-consultant",
    sourceKey: "unicef",
    titleAr: "استشاري/ة صحة الأطفال",
    titleEn: "Child Health Consultant",
    locationAr: "فلسطين (عمل جزئيًا عن بُعد)",
    locationEn: "Palestine (partly remote)",
    summaryAr:
      "استشارات لدعم برامج صحة الأطفال: متابعة مؤشرات التغذية واللقاحات، ودعم خطط الطوارئ الصحية.",
    summaryEn:
      "Consultancy supporting child health programmes: nutrition and immunization indicators, and health emergency planning.",
    tags: ["pediatrics", "publicHealth"],
    postedDaysAgo: 4,
    closesInDays: 30,
  },
  {
    key: "unrwa-neonatal-nurse",
    sourceKey: "unrwa",
    titleAr: "ممرض/ة وحدة العناية المركزة لحديثي الولادة",
    titleEn: "Nurse — Neonatal Intensive Care Unit",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "تمريض سريري في وحدة حديثي الولادة ضمن خدمات الرعاية الصحية الأولية، بدوام كامل، مع متابعة الحرارة والوزن وأعراض الاختناق.",
    summaryEn:
      "Clinical nursing in a neonatal unit within primary health care services, full time, covering temperature, weight, and distress monitoring.",
    tags: ["nicu", "neonatal"],
    postedDaysAgo: 9,
    closesInDays: 9,
  },
  {
    key: "unrwa-emergency-room-nurse",
    sourceKey: "unrwa",
    titleAr: "ممرض/ة غرفة الطوارئ",
    titleEn: "Emergency Room Nurse",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "إسعافات أولية وفرز الحالات في غرفة الطوارئ، وإدارة الأدوية والمحاليل ضمن فريق الطوارئ.",
    summaryEn:
      "First response and triage in the emergency room, managing medications and IV therapy within the emergency team.",
    tags: ["emergency"],
    postedDaysAgo: 7,
    closesInDays: 16,
  },
  {
    key: "unrwa-primary-health-supervisor",
    sourceKey: "unrwa",
    titleAr: "مشرف/ة الرعاية الصحية الأولية",
    titleEn: "Primary Health Care Supervisor",
    locationAr: "فلسطين",
    locationEn: "Palestine",
    summaryAr:
      "إشراف على فرق الرعاية الصحية الأولية، وجدولة العمل، ومتابعة جودة الزيارات السريرية.",
    summaryEn:
      "Supervising primary health care teams, scheduling work, and monitoring the quality of clinical visits.",
    tags: ["general", "publicHealth"],
    postedDaysAgo: 15,
    closesInDays: 27,
  },
  {
    key: "who-newborn-care-consultant",
    sourceKey: "who",
    titleAr: "استشاري/ة رعاية حديثي الولادة",
    titleEn: "Newborn Care Consultant",
    locationAr: "فلسطين",
    locationEn: "Palestine",
    summaryAr:
      "استشارة فنية لبرامج رعاية حديثي الولادة: إرشادات الرعاية الأساسية، وتدريب الفرق السريرية، ومراجعة البروتوكولات.",
    summaryEn:
      "Technical consultancy for newborn care programmes: essential care guidance, clinical team training, and protocol review.",
    tags: ["neonatal", "nicu"],
    postedDaysAgo: 12,
    closesInDays: 5,
  },
  {
    key: "who-clinical-health-officer",
    sourceKey: "who",
    titleAr: "أخصائي/ة صحة سريرية",
    titleEn: "Clinical Health Officer",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "دعم الخدمات السريرية في المرافق الصحية، وتنسيق الإحالة بين المستشفيات والعيادات.",
    summaryEn:
      "Supporting clinical services in health facilities and coordinating referrals between hospitals and clinics.",
    tags: ["emergency", "general"],
    postedDaysAgo: 8,
    closesInDays: 18,
  },
  {
    key: "who-immunization-nurse",
    sourceKey: "who",
    titleAr: "ممرضة/ممرض برنامج التلقيح",
    titleEn: "Immunization Programme Nurse",
    locationAr: "فلسطين",
    locationEn: "Palestine",
    summaryAr:
      "دعم حملات التلقيح: التحضير والتخزين البارد، والتسجيل، ومتابعة الحالات بعد التطعيم.",
    summaryEn:
      "Supporting immunization campaigns: preparation and cold chain, registration, and post-vaccination follow-up.",
    tags: ["publicHealth", "general"],
    postedDaysAgo: 3,
    closesInDays: 25,
  },
  {
    key: "icrc-supported-hospital-nurse",
    sourceKey: "icrc",
    titleAr: "ممرض/ة في مستشفى مدعوم",
    titleEn: "Nurse — Supported Hospital",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "تمريض سريري في مرفق صحي مدعوم: إعطاء العلاجات، ومتابعة المرضى، والمساهمة في جداول المناوبات.",
    summaryEn:
      "Clinical nursing in a supported health facility: administering treatments, patient follow-up, and contributing to shift rotas.",
    tags: ["general", "emergency"],
    postedDaysAgo: 10,
    closesInDays: 14,
  },
  {
    key: "icrc-mobile-clinic-nurse",
    sourceKey: "icrc",
    titleAr: "ممرض/ة عيادة متنقلة",
    titleEn: "Mobile Clinic Nurse",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "رعاية تمريضية متنقلة للمجتمعات المتأثرة: فحوص أولية، توزيع الأدوية، وتسجيل البيانات اليومية.",
    summaryEn:
      "Mobile nursing care for affected communities: initial checks, medicine distribution, and daily data logging.",
    tags: ["emergency", "general"],
    postedDaysAgo: 5,
    closesInDays: 24,
  },
  {
    key: "nrc-health-project-coordinator",
    sourceKey: "nrc",
    titleAr: "منسق/ة مشروع الصحة",
    titleEn: "Health Project Coordinator",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "تنسيق أنشطة مشروع صحي ميداني: جدولة الفعاليات، متابعة الشريكاء، وإعداد التقارير الدورية.",
    summaryEn:
      "Coordinating a field health project: activity scheduling, partner follow-up, and periodic reporting.",
    tags: ["general", "publicHealth"],
    postedDaysAgo: 13,
    closesInDays: 11,
  },
  {
    key: "nrc-health-services-officer",
    sourceKey: "nrc",
    titleAr: "أخصائي/ة خدمات صحية",
    titleEn: "Health Services Officer",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "متابعة وصول الأفراد إلى الخدمات الصحية، وتوثيق الحالات، والتحاور مع الفرق الميدانية.",
    summaryEn:
      "Following up individuals' access to health services, documenting cases, and liaising with field teams.",
    tags: ["general"],
    postedDaysAgo: 16,
    closesInDays: 26,
  },
  {
    key: "unp-health-programme-nurse",
    sourceKey: "un-palestine",
    titleAr: "ممرض/ة برنامج الصحة",
    titleEn: "Nurse — Health Programme",
    locationAr: "فلسطين",
    locationEn: "Palestine",
    summaryAr:
      "دعم تنفيذ برنامج الصحة: متابعة الحالات، وتنسيق مواعيد الإحالة، وإعداد ملخصات سريرية مختصرة.",
    summaryEn:
      "Supporting health programme delivery: case follow-up, referral scheduling, and preparing brief clinical summaries.",
    tags: ["general", "pediatrics"],
    postedDaysAgo: 6,
    closesInDays: 20,
  },
  {
    key: "unp-emergency-response-nurse",
    sourceKey: "un-palestine",
    titleAr: "ممرض/ة استجابة الطوارئ",
    titleEn: "Emergency Response Nurse",
    locationAr: "غزة، فلسطين",
    locationEn: "Gaza, Palestine",
    summaryAr:
      "دعم فريق استجابة الطوارئ: تقييم الحالات الأولي، الإسعافات التمريضية، وتنسيق النقل للمستشفيات.",
    summaryEn:
      "Supporting the emergency response team: initial case assessment, nursing first aid, and hospital transfer coordination.",
    tags: ["emergency", "neonatal"],
    postedDaysAgo: 2,
    closesInDays: 7,
  },
];

export const DAY_MS = 86_400_000;

/** Canonical dedupe key: one vacancy can only exist once per user + source. */
export function dedupeKeyFor(sourceKey: string, jobKey: string): string {
  return `${sourceKey}::${jobKey}`;
}
