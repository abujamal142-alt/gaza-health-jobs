/**
 * Transparent, deterministic match scoring.
 *
 * Every input is a stored fact (profile specialties, job tags, duty station) —
 * nothing here invents data, and the same inputs always produce the same
 * score. The result is presented in the UI as an AI estimate, never as a
 * confirmed fact.
 */

/** Specialties present in the candidate profile (nursing diploma, 2010). */
export const PROFILE_TAGS = [
  "nicu",
  "neonatal",
  "pediatrics",
  "emergency",
  "general",
] as const;

/** Full tag vocabulary a vacancy record may carry. */
export const ALL_TAGS = [
  "nicu",
  "neonatal",
  "pediatrics",
  "emergency",
  "general",
  "publicHealth",
] as const;

export interface MatchableJob {
  tags: string[];
  locationAr: string;
  locationEn: string;
}

export interface MatchResult {
  score: number;
  matchedTags: string[];
  inRegion: boolean;
  clinicalRole: boolean;
  /** A vacancy counts as "matching" only with a real specialty overlap. */
  isMatching: boolean;
}

const REGION_TERMS = ["غزة", "فلسطين", "gaza", "palestine"];

export function scoreMatch(
  job: MatchableJob,
  profile: { specialties: string[] },
): MatchResult {
  const profileSet = new Set(profile.specialties);
  const matchedTags = job.tags.filter((tag) => profileSet.has(tag));

  const location = `${job.locationAr} ${job.locationEn}`.toLowerCase();
  const inRegion = REGION_TERMS.some((term) => location.includes(term));
  const clinicalRole = job.tags.some((tag) =>
    (PROFILE_TAGS as readonly string[]).includes(tag),
  );

  const score = Math.min(
    100,
    Math.min(60, matchedTags.length * 20) +
      (inRegion ? 20 : 0) +
      (clinicalRole ? 20 : 0),
  );

  return {
    score,
    matchedTags,
    inRegion,
    clinicalRole,
    isMatching: matchedTags.length > 0 && score >= 60,
  };
}

export type MatchReason =
  | { type: "tag"; tag: string }
  | { type: "location" }
  | { type: "role" };

/** Ordered, human-readable reasons behind a score. */
export function matchReasons(result: MatchResult): MatchReason[] {
  const reasons: MatchReason[] = result.matchedTags.map((tag) => ({
    type: "tag",
    tag,
  }));
  if (result.inRegion) reasons.push({ type: "location" });
  if (result.clinicalRole) reasons.push({ type: "role" });
  return reasons;
}

const DAY_MS = 86_400_000;

export type ClosingState = "none" | "closed" | "soon" | "open";

export function closingState(closingAt?: number): ClosingState {
  if (closingAt === undefined) return "none";
  const diff = closingAt - Date.now();
  if (diff < 0) return "closed";
  if (diff <= 14 * DAY_MS) return "soon";
  return "open";
}

export function daysLeft(closingAt?: number): number | null {
  if (closingAt === undefined) return null;
  return Math.max(0, Math.ceil((closingAt - Date.now()) / DAY_MS));
}
