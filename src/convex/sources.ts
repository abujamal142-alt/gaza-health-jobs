import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

/** Lower-case, trim and drop a trailing slash so URLs dedupe reliably. */
export function normalizeUrl(raw: string): string {
  const url = raw.trim().toLowerCase().replace(/\/+$/, "");
  return url;
}

function isValidHttpUrl(raw: string): boolean {
  const trimmed = raw.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

async function requireUserId(
  ctx: Parameters<typeof getAuthUserId>[0],
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Not authenticated");
  return userId;
}

/** All sources of the signed-in user, plus their check history. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const sources = await ctx.db
      .query("jobSources")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const checks = await ctx.db
      .query("sourceChecks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    checks.sort((a, b) => b._creationTime - a._creationTime);
    return { sources, checks };
  },
});

export const add = mutation({
  args: {
    nameAr: v.string(),
    nameEn: v.string(),
    url: v.string(),
  },
  handler: async (ctx, { nameAr, nameEn, url }) => {
    const userId = await requireUserId(ctx);
    const name = nameAr.trim();
    if (!name) return { ok: false as const, reason: "name" as const };
    if (!isValidHttpUrl(url)) return { ok: false as const, reason: "url" as const };

    const normalized = normalizeUrl(url);
    const existing = await ctx.db
      .query("jobSources")
      .withIndex("by_user_url", (q) =>
        q.eq("userId", userId).eq("url", normalized),
      )
      .unique();
    if (existing) return { ok: false as const, reason: "exists" as const };

    await ctx.db.insert("jobSources", {
      userId,
      nameAr: name,
      nameEn: nameEn.trim() || name,
      url: url.trim(),
      enabled: true,
      isBuiltIn: false,
    });
    return { ok: true as const };
  },
});

export const update = mutation({
  args: {
    id: v.id("jobSources"),
    nameAr: v.string(),
    nameEn: v.string(),
    url: v.string(),
  },
  handler: async (ctx, { id, nameAr, nameEn, url }) => {
    const userId = await requireUserId(ctx);
    const source = await ctx.db.get(id);
    if (!source || source.userId !== userId) {
      return { ok: false as const, reason: "missing" as const };
    }
    const name = nameAr.trim();
    if (!name) return { ok: false as const, reason: "name" as const };
    if (!isValidHttpUrl(url)) return { ok: false as const, reason: "url" as const };

    const normalized = normalizeUrl(url);
    const clash = await ctx.db
      .query("jobSources")
      .withIndex("by_user_url", (q) =>
        q.eq("userId", userId).eq("url", normalized),
      )
      .unique();
    if (clash && clash._id !== id) {
      return { ok: false as const, reason: "exists" as const };
    }

    await ctx.db.patch(id, {
      nameAr: name,
      nameEn: nameEn.trim() || name,
      url: url.trim(),
    });
    return { ok: true as const };
  },
});

/** Enable / disable a source. Disabled sources are excluded from discovery. */
export const setEnabled = mutation({
  args: { id: v.id("jobSources"), enabled: v.boolean() },
  handler: async (ctx, { id, enabled }) => {
    const userId = await requireUserId(ctx);
    const source = await ctx.db.get(id);
    if (!source || source.userId !== userId) return { ok: false as const };
    await ctx.db.patch(id, { enabled });
    return { ok: true as const, enabled };
  },
});
