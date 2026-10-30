import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // ---- JOHNNY AI JOB HUNTER ------------------------------------------------
    // Every table is scoped by userId: this is a private, personal assistant.

    /** Official recruitment sources the assistant reads vacancies from. */
    jobSources: defineTable({
      userId: v.id("users"),
      nameAr: v.string(),
      nameEn: v.string(),
      url: v.string(),
      enabled: v.boolean(),
      /** The six pre-seeded official sources keep their identity in v1. */
      isBuiltIn: v.boolean(),
    })
      .index("by_user", ["userId"])
      .index("by_user_url", ["userId", "url"]),

    /** Vacancy records. `dedupeKey` prevents the same vacancy being stored twice. */
    jobs: defineTable({
      userId: v.id("users"),
      sourceId: v.id("jobSources"),
      dedupeKey: v.string(),
      titleAr: v.string(),
      titleEn: v.string(),
      locationAr: v.string(),
      locationEn: v.string(),
      summaryAr: v.string(),
      summaryEn: v.string(),
      /** Specialty keys: nicu | neonatal | pediatrics | emergency | general | publicHealth */
      tags: v.array(v.string()),
      /** Always the official page of the publishing organization. */
      officialUrl: v.string(),
      /** Absent when the source publishes no closing date. */
      closingAt: v.optional(v.number()),
      postedAt: v.optional(v.number()),
      /** true = sample record shown as DEMO, never presented as a live vacancy. */
      isDemo: v.boolean(),
    })
      .index("by_user", ["userId"])
      .index("by_user_dedupe", ["userId", "dedupeKey"])
      .index("by_user_source", ["userId", "sourceId"]),

    /** Source check history. No live crawler runs in v1, so rows are marked demo. */
    sourceChecks: defineTable({
      userId: v.id("users"),
      sourceId: v.id("jobSources"),
      status: v.string(),
      isDemo: v.boolean(),
      foundCount: v.number(),
      newCount: v.number(),
      note: v.optional(v.string()),
    })
      .index("by_source", ["sourceId"])
      .index("by_user", ["userId"]),

    /** Professional facts only — never personal contact details. */
    candidateProfiles: defineTable({
      userId: v.id("users"),
      diplomaAr: v.string(),
      diplomaEn: v.string(),
      diplomaYear: v.number(),
      specialties: v.array(v.string()),
      experienceAr: v.string(),
      experienceEn: v.string(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
