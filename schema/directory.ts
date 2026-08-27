import { pgTable, serial, text, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";

export const directoryStores = pgTable(
  "directory_stores",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    website: varchar("website", { length: 500 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    platform: varchar("platform", { length: 50 }).notNull(),
    description: text("description").notNull(),
    logoUrl: varchar("logo_url", { length: 500 }),
    productCount: integer("product_count"),

    // ICP scoring
    apiScore: integer("api_score"),
    tier: varchar("tier", { length: 20 }), // gold, silver, bronze, pending_review
    painSignals: jsonb("pain_signals").$type<string[]>(),
    platformDetected: varchar("platform_detected", { length: 50 }),
    outreachPriority: integer("outreach_priority"),
    shopmateFit: varchar("shopmate_fit", { length: 20 }), // high, medium, low, none

    // Claim status
    isClaimed: boolean("is_claimed").default(false),
    claimedAt: timestamp("claimed_at"),

    // Owner contact (private, not displayed publicly)
    ownerName: varchar("owner_name", { length: 255 }),
    ownerWhatsapp: varchar("owner_whatsapp", { length: 50 }),
    ownerEmail: varchar("owner_email", { length: 255 }),
    ownerInstagram: varchar("owner_instagram", { length: 255 }),

    // Public social links (displayed on listing)
    instagramUrl: varchar("instagram_url", { length: 500 }),
    facebookUrl: varchar("facebook_url", { length: 500 }),
    tiktokUrl: varchar("tiktok_url", { length: 500 }),
    youtubeUrl: varchar("youtube_url", { length: 500 }),
    linkedinUrl: varchar("linkedin_url", { length: 500 }),
    twitterUrl: varchar("twitter_url", { length: 500 }),

    // Owner Magic Edit Token (Passwordless management link)
    editToken: varchar("edit_token", { length: 255 }),

    // Expiry lifecycle for unclaimed stores (e.g. 45 days)
    unclaimedExpiresAt: timestamp("unclaimed_expires_at"),

    // Custom Branding, Theme & Responsive Cover
    themeColor: varchar("theme_color", { length: 32 }).default("#3D7BFF"), // e.g. #10B981, #EC4899, #8B5CF6
    bannerPattern: varchar("banner_pattern", { length: 64 }).default("gradient"), // gradient, grid, dots, minimal
    coverUrl: varchar("cover_url", { length: 500 }), // Desktop Banner (Recommended: 1200x400)
    coverMobileUrl: varchar("cover_mobile_url", { length: 500 }), // Optional Mobile Banner (Recommended: 800x600 or 600x400)
    tagline: varchar("tagline", { length: 255 }), // Brand headline / punchy slogan
    highlights: jsonb("highlights").$type<string[]>(), // e.g. ["Free Nationwide Delivery", "COD Available"]

    // Metadata
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("stores_slug_idx").on(table.slug),
    index("stores_category_idx").on(table.category),
    index("stores_city_idx").on(table.city),
    index("stores_tier_idx").on(table.tier),
    index("stores_claimed_idx").on(table.isClaimed),
  ]
);

export const directoryClaims = pgTable("directory_claims", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id")
    .references(() => directoryStores.id)
    .notNull(),
  claimantName: varchar("claimant_name", { length: 255 }).notNull(),
  claimantEmail: varchar("claimant_email", { length: 255 }).notNull(),
  claimantWhatsapp: varchar("claimant_whatsapp", { length: 50 }).notNull(),
  claimantRole: varchar("claimant_role", { length: 100 }), // owner, manager, etc.
  message: text("message"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const directoryCategories = pgTable("directory_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  storeCount: integer("store_count").default(0),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
});

export const directoryCities = pgTable("directory_cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  storeCount: integer("store_count").default(0),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: varchar("meta_description", { length: 500 }),
});

export type DirectoryStore = typeof directoryStores.$inferSelect;
export type NewDirectoryStore = typeof directoryStores.$inferInsert;
export type DirectoryClaim = typeof directoryClaims.$inferSelect;
export type NewDirectoryClaim = typeof directoryClaims.$inferInsert;
export type DirectoryCategory = typeof directoryCategories.$inferSelect;
export type DirectoryCity = typeof directoryCities.$inferSelect;
