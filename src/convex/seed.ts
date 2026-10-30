import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import {
  DAY_MS,
  SEED_JOBS,
  SEED_SOURCES,
  dedupeKeyFor,
} from "./demoData";
import { normalizeUrl } from "./sources";

/**
 * Idempotent one-shot setup for a new user:
 *   1. the six official sources (added only if their URL is not registered),
 *   2. the DEMO vacancy records (added only if their dedupe key is missing),
 *   3. a DEMO check-log row per source that has none yet,
 *   4. the candidate profile (nursing diploma 2010 + the five specialties).
 *
 * Running it twice changes nothing, so the client can safely call it whenever
 * the workspace looks empty.
 */
export const run = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const now = Date.now();

    /* 1 — sources ------------------------------------------------------- */
    const existingSources = await ctx.db
      .query("jobSources")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const sourceIdByUrl = new Map(
      existingSources.map((s) => [normalizeUrl(s.url), s._id]),
    );
    let sourcesCreated = 0;
    const sourceIds = new Map<string, (typeof existingSources)[number]["_id"]>();

    for (const source of SEED_SOURCES) {
      const normalized = normalizeUrl(source.url);
      const existingId = sourceIdByUrl.get(normalized);
      if (existingId) {
        sourceIds.set(source.key, existingId);
        continue;
      }
      const id = await ctx.db.insert("jobSources", {
        userId,
        nameAr: source.nameAr,
        nameEn: source.nameEn,
        url: source.url,
        enabled: true,
        isBuiltIn: true,
      });
      sourceIds.set(source.key, id);
      sourceIdByUrl.set(normalized, id);
      sourcesCreated += 1;
    }

    /* 2 — DEMO vacancies ------------------------------------------------ */
    const existingJobs = await ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const knownKeys = new Set(existingJobs.map((j) => j.dedupeKey));
    let jobsCreated = 0;

    for (const job of SEED_JOBS) {
      const dedupeKey = dedupeKeyFor(job.sourceKey, job.key);
      if (knownKeys.has(dedupeKey)) continue;
      const sourceId = sourceIds.get(job.sourceKey);
      if (!sourceId) continue;

      await ctx.db.insert("jobs", {
        userId,
        sourceId,
        dedupeKey,
        titleAr: job.titleAr,
        titleEn: job.titleEn,
        locationAr: job.locationAr,
        locationEn: job.locationEn,
        summaryAr: job.summaryAr,
        summaryEn: job.summaryEn,
        tags: job.tags,
        // Official careers page of the organization, never an invented permalink.
        officialUrl: SEED_SOURCES.find((s) => s.key === job.sourceKey)!.url,
        postedAt: now - job.postedDaysAgo * DAY_MS,
        closingAt:
          job.closesInDays === null ? undefined : now + job.closesInDays * DAY_MS,
        isDemo: true,
      });
      knownKeys.add(dedupeKey);
      jobsCreated += 1;
    }

    /* 3 — DEMO check history ------------------------------------------- */
    const existingChecks = await ctx.db
      .query("sourceChecks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const checkedSourceIds = new Set(existingChecks.map((c) => c.sourceId));
    let checksCreated = 0;

    for (const source of SEED_SOURCES) {
      const sourceId = sourceIds.get(source.key);
      if (!sourceId || checkedSourceIds.has(sourceId)) continue;
      const found = SEED_JOBS.filter((j) => j.sourceKey === source.key).length;
      await ctx.db.insert("sourceChecks", {
        userId,
        sourceId,
        status: "demo",
        isDemo: true,
        foundCount: found,
        newCount: found,
        note: "سجل توضيبي — لم يُجرَ فحص حقيقي لهذه الصفحة.",
      });
      checkedSourceIds.add(sourceId);
      checksCreated += 1;
    }

    /* 4 — candidate profile -------------------------------------------- */
    const existingProfile = await ctx.db
      .query("candidateProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    let profileCreated = false;
    if (!existingProfile) {
      await ctx.db.insert("candidateProfiles", {
        userId,
        diplomaAr: "دبلوم تمريض",
        diplomaEn: "Nursing diploma",
        diplomaYear: 2010,
        specialties: ["nicu", "neonatal", "pediatrics", "emergency", "general"],
        experienceAr:
          "خبرة عملية في العناية المركزة للخُلّد، ورعاية حديثي الولادة، وطب الأطفال، والطوارئ، والتريض العام.",
        experienceEn:
          "Professional experience in NICU, neonatal care, pediatrics, emergency and general nursing.",
      });
      profileCreated = true;
    }

    return { sourcesCreated, jobsCreated, checksCreated, profileCreated };
  },
});
