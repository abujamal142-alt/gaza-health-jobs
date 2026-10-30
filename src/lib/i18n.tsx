import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";

/**
 * Flat, dotted key dictionary. `ar` is the source of truth for the key set so a
 * missing English string is a type error rather than silent Arabic leaking into
 * the English UI.
 */
const ar = {
  /* brand + navigation */
  "brand.full": "جوني — صيّاد الوظائف بالذكاء الاصطناعي",
  "brand.short": "JOHNNY",
  "brand.tagline": "مساعد توظيف خاص لوظائف التمريض والرعاية الصحية الإنسانية",
  "brand.private": "أداة شخصية خاصة",
  "nav.dashboard": "لوحة التحكم",
  "nav.vacancies": "الوظائف الشاغرة",
  "nav.sources": "مصادر الوظائف",
  "nav.profile": "الملف المهني",
  "nav.home": "الصفحة الرئيسية",
  "nav.signOut": "تسجيل الخروج",
  "nav.menu": "القائمة",
  "nav.language": "اللغة",

  /* common */
  "common.demo": "تجريبي",
  "common.demoLabel": "DEMO",
  "common.demoTitle": "بيانات تجريبية (DEMO)",
  "common.confirmed": "معلومة مؤكدة",
  "common.aiEstimate": "تقدير بالذكاء الاصطناعي",
  "common.officialLink": "الرابط الرسمي",
  "common.closingDate": "تاريخ الإغلاق",
  "common.posted": "تاريخ النشر",
  "common.location": "الموقع",
  "common.organization": "المؤسسة",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.add": "إضافة",
  "common.edit": "تعديل",
  "common.close": "إغلاق",
  "common.search": "بحث",
  "common.all": "الكل",
  "common.loading": "جارٍ التحميل…",
  "common.enabled": "مفعّل",
  "common.disabled": "موقوف",
  "common.details": "التفاصيل",
  "common.viewAll": "عرض الكل",
  "common.new": "جديد",
  "common.open": "فتح",
  "common.none": "لا يوجد",
  "common.required": "حقل مطلوب",
  "common.sample": "عيّنة توضيحية",
  "common.estimateShort": "تقدير",
  "common.sourceOff": "المصدر موقوف",
  "common.profile": "ملفك المهني",

  /* dashboard */
  "dash.title": "لوحة التحكم",
  "dash.sub": "وظائف مطابقة لملفك المهني أولًا، من مصادر التوظيف الرسمية.",
  "dash.demoBody":
    "المراقبة الحية للمصادر غير مفعّلة بعد. السجلات المعروضة عيّنات توضيحية، وروابطها تشير إلى صفحات التوظيف الرسمية لا إلى إعلانات منشورة حاليًا.",
  "dash.newMatching": "وظائف مطابقة جديدة",
  "dash.newMatchingSub": "مرتبة حسب درجة التطابق مع ملفك المهني",
  "dash.noMatching": "لا توجد وظائف مطابقة حتى الآن.",
  "dash.goVacancies": "استكشف كل الوظائف",
  "dash.stats": "لمحة سريعة",
  "dash.statTotal": "سجلات وظائف",
  "dash.statMatching": "مطابقة لملفك",
  "dash.statClosingSoon": "تُغلق خلال ١٤ يومًا",
  "dash.statSources": "مصادر مفعّلة",
  "dash.statNote": "أرقام محسوبة من السجلات المخزّنة فعليًا — لا تقديرات ولا أرقام وهمية.",
  "dash.alerts": "تنبيهات الإغلاق",
  "dash.alertsSub": "وظائف يقترب موعد إغلاقها",
  "dash.alertNone": "لا توجد إغلاقات خلال الـ ١٤ يومًا القادمة.",
  "dash.sourcesStatus": "حالة المصادر",
  "dash.sourcesSub": "المصادر المفعّلة تُفحص في الإصدارات القادمة",
  "dash.lastCheck": "آخر فحص",
  "dash.noLive": "لا يوجد فحص حي بعد",

  /* vacancies */
  "vac.title": "الاكتشاف الوظيفي",
  "vac.sub": "كل سجل يحمل رابطًا رسميًا وتاريخ إغلاق ودرجة تطابق موسومة كتقدير.",
  "vac.searchPlaceholder": "ابحث بعنوان الوظيفة أو المؤسسة أو التخصص",
  "vac.specialty": "التخصص",
  "vac.sort": "الترتيب",
  "vac.sortMatch": "الأعلى تطابقًا",
  "vac.sortClosing": "الأقرب إغلاقًا",
  "vac.sortNewest": "الأحدث نشرًا",
  "vac.results": "النتائج",
  "vac.noResults": "لا توجد نتائج مطابقة لبحثك. جرّب كلمة أخرى أو أزل عوامل التصفية.",
  "vac.closingSoon": "تُغلق قريبًا",
  "vac.closed": "مغلق",
  "vac.daysLeft": "متبقٍ {days} يومًا",
  "vac.viewDetails": "عرض التفاصيل",
  "vac.emptyDemo": "لا توجد سجلات وظائف بعد — قدّم البيانات التجريبية أولًا.",
  "vac.fromSource": "من مصدر",

  /* job detail + approval */
  "job.whyMatch": "لماذا تطابق ملفك؟",
  "job.matchScore": "درجة التطابق",
  "job.factsTitle": "ما المؤكد وما التقدير",
  "job.factConfirmed": "المؤسسة ورابطها الرسمي — تحقّق يدويًا من صفحة المصادر.",
  "job.factDemo": "العنوان والوصف والتواريخ — سجل تجريبي للعرض فقط.",
  "job.factAi": "درجة التطابق وأسبابها — تقدير آلي غير مضمون.",
  "job.demoRecord": "هذا سجل تجريبي (DEMO). الرابط يفتح صفحة التوظيف الرسمية للمؤسسة، لا إعلانًا محددًا.",
  "job.openOfficial": "فتح الإعلان الرسمي",
  "job.approvalTitle": "موافقة مطلوبة قبل فتح موقع خارجي",
  "job.approvalBody":
    "سيتم فتح صفحة التوظيف الرسمية في نافذة جديدة. لن يُرسل هذا التطبيق أي طلب نيابةً عنك، ولن تُنقل أي بيانات من ملفك.",
  "job.approve": "نعم، افتح الرابط الرسمي",
  "job.decline": "إلغاء",
  "job.neverSubmit": "لا يُقدّم هذا التطبيق أي طلبات تلقائيًا — كل إجراء خارجي يتطلب موافقتك.",
  "job.opened": "تم فتح الموقع الرسمي — لم يُرسل أي طلب.",
  "job.officialSite": "الموقع الرسمي للمصدر",

  /* sources */
  "src.title": "مصادر الوظائف الرسمية",
  "src.sub": "أضف روابط توظيف رسمية، وعدّلها، وفعّلها أو أوقفها — التوقف يخفي المصدر من الاكتشاف.",
  "src.add": "إضافة مصدر",
  "src.addTitle": "مصدر جديد",
  "src.editTitle": "تعديل المصدر",
  "src.name": "اسم المصدر",
  "src.nameAr": "اسم المصدر (عربي)",
  "src.nameEn": "اسم المصدر (إنجليزي)",
  "src.namePlaceholder": "مثال: منظمة صحية دولية",
  "src.url": "رابط المصدر",
  "src.urlPlaceholder": "https://example.org/careers",
  "src.urlHint": "يجب أن يبدأ الرابط بـ https://",
  "src.errName": "أدخل اسمًا للمصدر.",
  "src.errUrl": "أدخل رابطًا صحيحًا يبدأ بـ https:// أو http://",
  "src.errExists": "هذا الرابط مسجّل بالفعل كمصدر.",
  "src.saved": "تم حفظ المصدر.",
  "src.updated": "تم تحديث المصدر.",
  "src.toggledOn": "تم تفعيل المصدر.",
  "src.toggledOff": "تم إيقاف المصدر.",
  "src.builtInNote":
    "المصادر الرسمية الستة مُضافة مسبقًا. يمكنك تعديلها أو إيقافها، لكن لا يوجد فحص حي لها في الإصدار الأول.",
  "src.checkNote":
    "سجل الفحص أدناه توضيبي — لا يوجد فاحص يعمل الآن، ولا يُتاح تشغيل فحص من الواجهة.",
  "src.history": "سجل المصدر",
  "src.historyEmpty": "لا يوجد سجل فحص لهذا المصدر.",
  "src.found": "سجلات وجدت",
  "src.fresh": "سجلات جديدة",
  "src.managed": "تُدار يدويًا",

  /* profile */
  "prof.title": "الملف المهني",
  "prof.sub": "المؤهلات المستخدمة في حساب درجة التطابق — قراءة فقط في الإصدار الأول.",
  "prof.diploma": "دبلوم تمريض",
  "prof.year": "سنة التخرج",
  "prof.specialties": "التخصصات المهنية",
  "prof.experience": "الخبرة العملية",
  "prof.experienceValue":
    "تمريض العناية المركزة للخُلّد، رعاية حديثي الولادة، طب الأطفال، الطوارئ، والتريض العام.",
  "prof.privacy": "خصوصية",
  "prof.privacyBody":
    "لا يُخزَّن في هذا الملف أي بيانات شخصية (الاسم، رقم الهاتف، البريد الإلكتروني)، ولا يُعرض لأي جهة خارجية.",
  "prof.noInvented": "لا مؤهلات مُختلقة",
  "prof.noInventedBody":
    "لا يضيف هذا التطبيق أي مؤهل لم يُذكر في ملفك. لا توجد درجة بكالوريوس أو شهادات إضافية في هذا الملف.",
  "prof.matchRules": "كيف تُحتسب درجة التطابق؟",
  "prof.ruleTags": "+٢٠ نقطة عن كل تخصص مشترك مع الوظيفة (بحد أقصى ٦٠).",
  "prof.ruleLocation": "+٢٠ نقطة إذا كان مقر الوظيفة في غزة أو فلسطين.",
  "prof.ruleRole": "+٢٠ نقطة إذا كان الدور تمريضيًا أو سريريًا.",
  "prof.ruleCap": "الدرجة من ١٠٠، وهي تقدير إرشادي لا قرار توظيف.",
  "prof.aiNote": "درجة التطابق وأسبابها تقديرات للذكاء الاصطناعي، وليست وقائع مؤكدة.",

  /* specialties */
  "spec.nicu": "العناية المركزة للخُلّد (NICU)",
  "spec.neonatal": "رعاية حديثي الولادة",
  "spec.pediatrics": "طب الأطفال",
  "spec.emergency": "الطوارئ",
  "spec.general": "التريض العام",
  "spec.publicHealth": "الصحة العامة",

  /* match reasons */
  "match.tag": "يطابق تخصصك: {name}",
  "match.location": "الموقع ضمن نطاق عملك: غزة وفلسطين",
  "match.role": "دور تمريضي/سريري",
  "match.none": "لا يوجد تطابق تخصص مباشر — راجع الوصف الكامل.",
  "match.aiNote": "تقدير آلي من تخصصات ملفك المهني",

  /* auth */
  "auth.signInTitle": "تسجيل الدخول",
  "auth.signInSub": "أدخل بريدك الإلكتروني للوصول إلى مساعدك الخاص.",
  "auth.checkEmail": "تحقّق من بريدك",
  "auth.sentTo": "أرسلنا رمز تحققًا إلى {email}",
  "auth.errSend": "تعذّر إرسال رمز التحقق. حاول مرة أخرى.",
  "auth.errOtp": "الرمز الذي أدخلته غير صحيح.",
  "auth.errGuest": "تعذّر الدخول كضيف. حاول مرة أخرى.",
  "auth.or": "أو",
  "auth.guest": "المتابعة كضيف",
  "auth.tryAgain": "إعادة المحاولة",
  "auth.otherEmail": "استخدام بريد آخر",
  "auth.verify": "تأكيد الرمز",
  "auth.verifying": "جارٍ التحقق…",
  "auth.resend": "لم يصلك رمز؟",
  "auth.blockedTitle": "يلزم تسجيل الدخول للمتابعة",
  "auth.blockedBody": "هذه الصفحة مخصّصة لمستخدم المساعد الخاص.",
  "auth.signIn": "تسجيل الدخول",
  "auth.backHome": "العودة للصفحة الرئيسية",
  "auth.comingBack": "ستعود إلى هذه الصفحة مباشرة بعد تسجيل الدخول.",

  /* landing */
  "land.eyebrow": "الإصدار الأول · بيانات تجريبية",
  "land.heroTitle": "وظائف التمريض والرعاية الإنسانية في غزة وفلسطين — من المصادر الرسمية فقط.",
  "land.heroSub":
    "جوني يجمع الشواغر من مصادر التوظيف الرسمية، يطابقها مع ملفك المهني، ويترك القرار لك: لا إرسال تلقائي، ولا رابط غير موثّق، ولا أرقام غير مؤكدة.",
  "land.cta": "ابدأ الآن",
  "land.ctaDashboard": "افتح لوحة التحكم",
  "land.ctaSources": "تصفّح المصادر الرسمية",
  "land.heroNotice":
    "المراقبة الحية غير مفعّلة بعد — كل السجلات المعروضة تجريبية وموسومة بـ DEMO.",
  "land.showcase": "نموذج بطاقة وظيفة",
  "land.showcaseNote": "رسم توضيحي للواجهة فقط",
  "land.sourcesTitle": "مصادر التوظيف الرسمية",
  "land.sourcesSub": "الإصدار الأول يقرأ من هذه المصادر الرسمية الستة:",
  "land.visit": "زيارة المصدر",
  "land.howTitle": "ثلاث خطوات",
  "land.step1Title": "اربط المصادر",
  "land.step1Body": "أضف روابط التوظيف الرسمية، وعدّلها، وفعّلها أو أوقفها متى شئت.",
  "land.step2Title": "اكتشف الشواغر",
  "land.step2Body": "كل سجل يعرض الرابط الرسمي وتاريخ الإغلاق ودرجة التطابق بجانب أسبابها.",
  "land.step3Title": "طابِق وقرّر",
  "land.step3Body": "التطابق محسوب من تخصصات ملفك المهني فقط، والقرار يبقى قرارك وحدك.",
  "land.principlesTitle": "قواعد لا نتنازل عنها",
  "land.p1Title": "روابط رسمية فقط",
  "land.p1Body": "كل إعلان يفتح على صفحة التوظيف الرسمية للمؤسسة نفسها.",
  "land.p2Title": "موافقة قبل أي إجراء",
  "land.p2Body": "لا يرسل التطبيق أي طلبًا نيابةً عنك؛ أي إجراء خارجي يتوقف على موافقتك.",
  "land.p3Title": "مؤكَّد مقابل تقدير",
  "land.p3Body": "الوقائع تُوسم «معلومة مؤكدة»، وتقديرات الذكاء الاصطناعي تُوسم «تقدير».",
  "land.p4Title": "ملف بلا بيانات شخصية",
  "land.p4Body": "مؤهلات مهنية فقط: بلا اسم، بلا هاتف، بلا بريد، وبلا مؤهلات مُختلقة.",
  "land.limitsTitle": "خارج الإصدار الأول",
  "land.limitsSub": "مخطّطة لاحقًا، وليست جاهزة الآن:",
  "land.limit1": "مراقبة حية للمصادر",
  "land.limit2": "توليد السيرة الذاتية وخطاب التقديم",
  "land.limit3": "تتبّع الطلبات والمواعيد",
  "land.limit4": "تجهيز المقابلات",
  "land.limit5": "الإشعارات والسجل الزمني",
  "land.limitsNote": "لن ندّعي عمل ميزة قبل توفّرها فعلًا.",
  "land.finalTitle": "ابدأ من لوحة التحكم",
  "land.finalSub": "سجّل الدخول لترى الوظائف المطابقة أولًا، ثم رتّب المصادر كما يناسبك.",
  "land.footerNote": "أداة شخصية خاصة · واجهة عربية أولاً",
  "land.principlesSub": "مبنية داخل المنتج، لا في صفحات التسويق فقط.",
} as const;

type Dict = Record<keyof typeof ar, string>;

const en: Dict = {
  "brand.full": "JOHNNY AI JOB HUNTER",
  "brand.short": "JOHNNY",
  "brand.tagline": "A private recruitment assistant for nursing and humanitarian healthcare jobs",
  "brand.private": "Private personal tool",
  "nav.dashboard": "Dashboard",
  "nav.vacancies": "Vacancies",
  "nav.sources": "Job sources",
  "nav.profile": "Profile",
  "nav.home": "Home",
  "nav.signOut": "Sign out",
  "nav.menu": "Menu",
  "nav.language": "Language",

  "common.demo": "Demo",
  "common.demoLabel": "DEMO",
  "common.demoTitle": "Demo data (DEMO)",
  "common.confirmed": "Confirmed fact",
  "common.aiEstimate": "AI estimate",
  "common.officialLink": "Official link",
  "common.closingDate": "Closing date",
  "common.posted": "Posted",
  "common.location": "Location",
  "common.organization": "Organization",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.add": "Add",
  "common.edit": "Edit",
  "common.close": "Close",
  "common.search": "Search",
  "common.all": "All",
  "common.loading": "Loading…",
  "common.enabled": "Enabled",
  "common.disabled": "Disabled",
  "common.details": "Details",
  "common.viewAll": "View all",
  "common.new": "New",
  "common.open": "Open",
  "common.none": "None",
  "common.required": "Required",
  "common.sample": "Sample",
  "common.estimateShort": "Estimate",
  "common.sourceOff": "Source paused",
  "common.profile": "Your profile",

  "dash.title": "Dashboard",
  "dash.sub": "Vacancies matching your profile first, from official recruitment sources.",
  "dash.demoBody":
    "Live source monitoring is not enabled yet. The records shown are sample entries, and their links point to official careers pages rather than currently published postings.",
  "dash.newMatching": "New matching vacancies",
  "dash.newMatchingSub": "Ranked by match score against your profile",
  "dash.noMatching": "No matching vacancies yet.",
  "dash.goVacancies": "Explore all vacancies",
  "dash.stats": "At a glance",
  "dash.statTotal": "Vacancy records",
  "dash.statMatching": "Matching your profile",
  "dash.statClosingSoon": "Closing within 14 days",
  "dash.statSources": "Active sources",
  "dash.statNote": "Counts computed from stored records — no estimates, no invented numbers.",
  "dash.alerts": "Closing alerts",
  "dash.alertsSub": "Vacancies approaching their closing date",
  "dash.alertNone": "Nothing closes in the next 14 days.",
  "dash.sourcesStatus": "Source status",
  "dash.sourcesSub": "Active sources are checked in a future release",
  "dash.lastCheck": "Last check",
  "dash.noLive": "No live check yet",

  "vac.title": "Vacancy discovery",
  "vac.sub": "Every record carries an official link, a closing date, and a match score labelled as an estimate.",
  "vac.searchPlaceholder": "Search by title, organization, or specialty",
  "vac.specialty": "Specialty",
  "vac.sort": "Sort",
  "vac.sortMatch": "Best match",
  "vac.sortClosing": "Closing soonest",
  "vac.sortNewest": "Newest",
  "vac.results": "Results",
  "vac.noResults": "No results match your search. Try another word or clear the filters.",
  "vac.closingSoon": "Closing soon",
  "vac.closed": "Closed",
  "vac.daysLeft": "{days} days left",
  "vac.viewDetails": "View details",
  "vac.emptyDemo": "No vacancy records yet — load the demo data first.",
  "vac.fromSource": "From",

  "job.whyMatch": "Why it matches",
  "job.matchScore": "Match score",
  "job.factsTitle": "Confirmed vs estimated",
  "job.factConfirmed": "Organization and its official link — verified on the source's own site.",
  "job.factDemo": "Title, description and dates — a demo record for display only.",
  "job.factAi": "Match score and reasons — a machine estimate.",
  "job.demoRecord":
    "This is a demo record (DEMO). The link opens the organization's official careers page, not a specific posting.",
  "job.openOfficial": "Open official vacancy page",
  "job.approvalTitle": "Approval required before opening an external site",
  "job.approvalBody":
    "The official careers page will open in a new tab. This app will not submit anything on your behalf, and no profile data is sent.",
  "job.approve": "Yes, open the official link",
  "job.decline": "Cancel",
  "job.neverSubmit": "This app never submits applications automatically — every external action needs your approval.",
  "job.opened": "Official site opened — nothing was submitted.",
  "job.officialSite": "Source's official site",

  "src.title": "Official job sources",
  "src.sub": "Add, edit, enable, or disable recruitment links — disabling hides a source from discovery.",
  "src.add": "Add source",
  "src.addTitle": "New source",
  "src.editTitle": "Edit source",
  "src.name": "Source name",
  "src.nameAr": "Source name (Arabic)",
  "src.nameEn": "Source name (English)",
  "src.namePlaceholder": "e.g. International health organization",
  "src.url": "Source URL",
  "src.urlPlaceholder": "https://example.org/careers",
  "src.urlHint": "The URL must start with https://",
  "src.errName": "Enter a name for the source.",
  "src.errUrl": "Enter a valid URL starting with https:// or http://",
  "src.errExists": "This URL is already registered as a source.",
  "src.saved": "Source saved.",
  "src.updated": "Source updated.",
  "src.toggledOn": "Source enabled.",
  "src.toggledOff": "Source disabled.",
  "src.builtInNote":
    "The six official sources come pre-added. You can edit or disable them, but there is no live checking for them in version 1.",
  "src.checkNote":
    "The check log below is illustrative — no crawler is running, and the UI offers no way to run one.",
  "src.history": "Source log",
  "src.historyEmpty": "No check log for this source yet.",
  "src.found": "records found",
  "src.fresh": "new records",
  "src.managed": "Managed manually",

  "prof.title": "Candidate profile",
  "prof.sub": "The qualifications used to compute match scores — read-only in version 1.",
  "prof.diploma": "Nursing diploma",
  "prof.year": "Graduation year",
  "prof.specialties": "Professional specialties",
  "prof.experience": "Professional experience",
  "prof.experienceValue":
    "NICU nursing, neonatal care, pediatrics, emergency nursing, and general nursing.",
  "prof.privacy": "Privacy",
  "prof.privacyBody":
    "No personal data (name, phone, email) is stored in this profile, and it is never exposed to any external party.",
  "prof.noInvented": "No invented qualifications",
  "prof.noInventedBody":
    "This app adds no qualification you did not provide. There is no bachelor's degree or extra certification in this profile.",
  "prof.matchRules": "How is the match score calculated?",
  "prof.ruleTags": "+20 points per specialty shared with the vacancy (max 60).",
  "prof.ruleLocation": "+20 points when the duty station is Gaza or Palestine.",
  "prof.ruleRole": "+20 points when the role is nursing or clinical.",
  "prof.ruleCap": "Scored out of 100 — an indicative estimate, not a hiring decision.",
  "prof.aiNote": "Match scores and reasons are AI estimates, not confirmed facts.",

  "spec.nicu": "NICU / intensive neonatal care",
  "spec.neonatal": "Neonatal care",
  "spec.pediatrics": "Pediatrics",
  "spec.emergency": "Emergency",
  "spec.general": "General nursing",
  "spec.publicHealth": "Public health",

  "match.tag": "Matches your specialty: {name}",
  "match.location": "Within your target area: Gaza and Palestine",
  "match.role": "Nursing / clinical role",
  "match.none": "No direct specialty match — read the full description.",
  "match.aiNote": "Estimated from your professional profile",

  "auth.signInTitle": "Sign in",
  "auth.signInSub": "Enter your email to reach your private assistant.",
  "auth.checkEmail": "Check your email",
  "auth.sentTo": "We've sent a code to {email}",
  "auth.errSend": "Failed to send verification code. Please try again.",
  "auth.errOtp": "The verification code you entered is incorrect.",
  "auth.errGuest": "Could not sign in as a guest. Please try again.",
  "auth.or": "Or",
  "auth.guest": "Continue as guest",
  "auth.tryAgain": "Try again",
  "auth.otherEmail": "Use a different email",
  "auth.verify": "Verify code",
  "auth.verifying": "Verifying…",
  "auth.resend": "Didn't receive a code?",
  "auth.blockedTitle": "Sign in to continue",
  "auth.blockedBody": "This page belongs to the private assistant workspace.",
  "auth.signIn": "Sign in",
  "auth.backHome": "Back to home",
  "auth.comingBack": "You'll come straight back here once you're signed in.",

  "land.eyebrow": "Version 1 · Demo data",
  "land.heroTitle": "Nursing and humanitarian healthcare jobs in Gaza and Palestine — official sources only.",
  "land.heroSub":
    "Johnny gathers vacancies from official recruitment sources, matches them against your profile, and leaves the decision to you: no auto-submit, no unverified links, no unconfirmed numbers.",
  "land.cta": "Get started",
  "land.ctaDashboard": "Open dashboard",
  "land.ctaSources": "Browse official sources",
  "land.heroNotice": "Live monitoring is not enabled yet — every record shown is demo data labelled DEMO.",
  "land.showcase": "Sample vacancy card",
  "land.showcaseNote": "Interface illustration only",
  "land.sourcesTitle": "Official recruitment sources",
  "land.sourcesSub": "Version 1 reads from these six official sources:",
  "land.visit": "Visit source",
  "land.howTitle": "Three steps",
  "land.step1Title": "Connect the sources",
  "land.step1Body": "Add recruitment URLs, edit them, and enable or disable them whenever you want.",
  "land.step2Title": "Discover vacancies",
  "land.step2Body": "Each record shows the official link, the closing date, and the match score with its reasons.",
  "land.step3Title": "Match and decide",
  "land.step3Body": "Matching uses your profile specialties only, and the decision stays entirely yours.",
  "land.principlesTitle": "Rules we do not bend",
  "land.p1Title": "Official links only",
  "land.p1Body": "Every vacancy opens the organization's own official careers page.",
  "land.p2Title": "Approval before action",
  "land.p2Body": "The app never submits for you; every external action waits for your approval.",
  "land.p3Title": "Confirmed vs estimated",
  "land.p3Body": "Facts are labelled “confirmed”, AI reasoning is labelled “estimate”.",
  "land.p4Title": "A profile with no personal data",
  "land.p4Body": "Professional qualifications only: no name, no phone, no email, no invented credentials.",
  "land.limitsTitle": "Out of scope for version 1",
  "land.limitsSub": "Planned later, not available now:",
  "land.limit1": "Live source monitoring",
  "land.limit2": "CV and cover letter generation",
  "land.limit3": "Application and deadline tracking",
  "land.limit4": "Interview preparation",
  "land.limit5": "Notifications and activity history",
  "land.limitsNote": "We won't claim a feature works before it actually does.",
  "land.finalTitle": "Start at the dashboard",
  "land.finalSub": "Sign in to see matching vacancies first, then arrange the sources the way you like.",
  "land.footerNote": "Private personal tool · Arabic-first interface",
  "land.principlesSub": "Built into the product, not just the marketing page.",
};

export const dict: Record<Lang, Dict> = { ar, en };

export type TKey = keyof typeof ar;

type Vars = Record<string, string | number>;

interface I18nValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  isAr: boolean;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: TKey, vars?: Vars) => string;
  formatDate: (value: number | Date) => string;
  /** Human "3 days ago" style label, localized. */
  formatRelative: (value: number | Date) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "johnny.lang";

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "ar";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") return stored;
  } catch {
    /* storage unavailable — fall back to Arabic default */
  }
  return "ar";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang, dir]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(
    () => setLangState((current) => (current === "ar" ? "en" : "ar")),
    [],
  );

  const value = useMemo<I18nValue>(() => {
    const locale = lang === "ar" ? "ar" : "en-GB";
    const dateFormatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      numberingSystem: "latn",
    });
    const relativeFormatter = new Intl.RelativeTimeFormat(locale, {
      numeric: "auto",
      // `latn` keeps digits consistent with the date formatter above.
      numberingSystem: "latn",
    } as Intl.RelativeTimeFormatOptions);

    const t = (key: TKey, vars?: Vars) => {
      let text: string = dict[lang][key] ?? key;
      if (vars) {
        for (const [name, val] of Object.entries(vars)) {
          text = text.split(`{${name}}`).join(String(val));
        }
      }
      return text;
    };

    const formatDate = (input: number | Date) =>
      dateFormatter.format(typeof input === "number" ? new Date(input) : input);

    const formatRelative = (input: number | Date) => {
      const date = typeof input === "number" ? new Date(input) : input;
      const diffMs = date.getTime() - Date.now();
      const abs = Math.abs(diffMs);
      const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ["day", 86_400_000],
        ["hour", 3_600_000],
        ["minute", 60_000],
      ];
      for (const [unit, ms] of units) {
        if (abs >= ms || unit === "minute") {
          return relativeFormatter.format(Math.round(diffMs / ms), unit);
        }
      }
      return relativeFormatter.format(0, "minute");
    };

    return { lang, dir, isAr: lang === "ar", setLang, toggleLang, t, formatDate, formatRelative };
  }, [lang, dir, setLang, toggleLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}

/** Convenience: label for a specialty key, with a graceful fallback. */
export function specialtyLabel(
  lang: Lang,
  key: string,
): string {
  const full = `${key}` as TKey;
  const known: TKey[] = [
    "spec.nicu",
    "spec.neonatal",
    "spec.pediatrics",
    "spec.emergency",
    "spec.general",
    "spec.publicHealth",
  ];
  if ((known as string[]).includes(full)) return dict[lang][full];
  return key;
}
