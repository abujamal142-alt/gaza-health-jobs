import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

export type JobWithSource = Doc<"jobs"> & {
  source: {
    nameAr: string;
    nameEn: string;
    url: string;
    enabled: boolean;
  } | null;
};

async function requireUserId(
  ctx: Parameters<typeof getAuthUserId>[0],
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  return userId;
}

/**
 * The signed-in user's vacancy records joined with their source. A job whose
 * source has been disabled is still returned so history is never lost, and the
 * UI flags it through `source.enabled`.
 */
export const list = query({
  args: {},
  handler: async (ctx): Promise<JobWithSource[]> => {
    const userId = await requireUserId(ctx);
    const [jobs, sources] = await Promise.all([
      ctx.db
        .query("jobs")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("jobSources")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);

    const byId = new Map<Id<"jobSources">, Doc<"jobSources">>(
      sources.map((s) => [s._id, s]),
    );

    return jobs.map((job) => {
      const source = byId.get(job.sourceId) ?? null;
      return {
        ...job,
        source: source
          ? {
              nameAr: source.nameAr,
              nameEn: source.nameEn,
              url: source.url,
              enabled: source.enabled,
            }
          : null,
      };
    });
  },
});

/** Counts used by the dashboard — computed from stored rows, never estimated. */
export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const [jobs, sources, checks] = await Promise.all([
      ctx.db
        .query("jobs")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("jobSources")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
      ctx.db
        .query("sourceChecks")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect(),
    ]);
    const now = Date.now();
    const dayMs = 86_400_000;
    return {
      totalJobs: jobs.length,
      demoJobs: jobs.filter((j) => j.isDemo).length,
      activeSources: sources.filter((s) => s.enabled).length,
      totalSources: sources.length,
      closingSoon: jobs.filter(
        (j) =>
          j.closingAt !== undefined &&
          j.closingAt >= now &&
          j.closingAt - now <= 14 * dayMs,
      ).length,
      checkCount: checks.length,
      lastCheckAt: checks.reduce<number | null>(
        (acc, c) =>
          acc === null ? c._creationTime : Math.max(acc, c._creationTime),
        null,
      ),
    };
  },
});

/**
 * Insert a vacancy exactly once per user: the dedupe index is checked first so
 * re-running a discovery pass never doubles a record.
 */
export const addUnique = mutation({
  args: {
    sourceId: v.id("jobSources"),
    dedupeKey: v.string(),
    titleAr: v.string(),
    titleEn: v.string(),
    locationAr: v.string(),
    locationEn: v.string(),
    summaryAr: v.string(),
    summaryEn: v.string(),
    tags: v.array(v.string()),
    officialUrl: v.string(),
    closingAt: v.optional(v.number()),
    postedAt: v.optional(v.number()),
    isDemo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const source = await ctx.db.get(args.sourceId);
    if (!source || source.userId !== userId) return { ok: false as const };

    const existing = await ctx.db
      .query("jobs")
      .withIndex("by_user_dedupe", (q) =>
        q.eq("userId", userId).eq("dedupeKey", args.dedupeKey),
      )
      .unique();
    if (existing) {
      return { ok: true as const, id: existing._id, created: false as const };
    }

    const id = await ctx.db.insert("jobs", {
      userId,
      sourceId: args.sourceId,
      dedupeKey: args.dedupeKey,
      titleAr: args.titleAr,
      titleEn: args.titleEn,
      locationAr: args.locationAr,
      locationEn: args.locationEn,
      summaryAr: args.summaryAr,
      summaryEn: args.summaryEn,
      tags: args.tags,
      officialUrl: args.officialUrl,
      closingAt: args.closingAt,
      postedAt: args.postedAt,
      isDemo: args.isDemo,
    });
    return { ok: true as const, id, created: true as const };
  },
});
