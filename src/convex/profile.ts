import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

/**
 * The candidate profile backing match scores.
 *
 * Professional facts only — diploma, year, specialties. No name, phone, email
 * or any other personal identifier lives here, and nothing is ever written
 * back to an external service.
 */
export const mine = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db
      .query("candidateProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});
