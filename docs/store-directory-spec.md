# Directory Website

**Purpose:** Build the public-facing store directory on `owaisabdullah.dev/stores` that serves as both a discovery platform and a ShopMate lead generation engine.

**Stack:** Next.js 15 (App Router), Drizzle ORM, Neon Postgres, Tailwind CSS, shadcn/ui.

**Principle:** Build only what validates the claim funnel. No auth, no dashboard, no automation.

---

## 1. Database Schema (Drizzle)

Add these tables to your existing ShopMate Neon database:

```typescript
// schema/directory.ts
import { pgTable, serial, text, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";

export const directoryStores = pgTable("directory_stores", {
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
  tier: varchar("tier", { length: 20 }), // gold, silver, bronze
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
  
  // Metadata
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const directoryClaims = pgTable("directory_claims", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => directoryStores.id).notNull(),
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
```

---

## 2. Route Structure

```
/stores                          → Directory homepage
/stores/category/[slug]          → Category page (e.g., /stores/category/fashion)
/stores/city/[slug]              → City page (e.g., /stores/city/karachi)
/stores/[slug]                   → Individual store profile
/stores/claim                    → Claim listing form
/stores/submit                   → Submit your store (organic inbound)
```

**No auth required anywhere.** Claim form collects contact info. You manually verify and update `isClaimed` in the database.

---

## 3. Page Specifications

### 3.1 `/stores` — Directory Homepage

**Purpose:** Discover stores by category and city. SEO landing page.

**Sections:**
1. **Hero:** "Discover Pakistan's Best E-commerce Stores" + search bar
2. **Categories Grid:** Cards for each category with store count
   - Fashion (25 stores)
   - Beauty (15 stores)
   - Home & Living (10 stores)
3. **Cities Grid:** Cards for each city with store count
   - Karachi (20 stores)
   - Lahore (18 stores)
   - Islamabad (8 stores)
4. **Featured Stores:** 6 Gold-tier stores with logo, name, category, city
5. **CTA:** "Own a store? Submit yours" → /stores/submit

**SEO:**
- Title: "Pakistani E-commerce Store Directory | Discover Online Shops"
- Description: "Curated directory of Pakistan's best online stores. Find fashion, beauty, and home brands from Karachi, Lahore, and across Pakistan."

**Data query:**
```typescript
// Get categories with counts
const categories = await db.select({
  name: directoryCategories.name,
  slug: directoryCategories.slug,
  count: directoryCategories.storeCount,
}).from(directoryCategories);

// Get featured stores (gold tier)
const featured = await db.select().from(directoryStores)
  .where(eq(directoryStores.tier, "gold"))
  .limit(6);
```

---

### 3.2 `/stores/category/[slug]` — Category Page

**URL examples:**
- `/stores/category/fashion`
- `/stores/category/beauty`

**Sections:**
1. **H1:** "Best Fashion E-commerce Stores in Pakistan"
2. **Breadcrumb:** Home > Stores > Fashion
3. **Store Grid:** Cards for each store in category
   - Logo (or placeholder)
   - Store name
   - City
   - Short description (truncated to 100 chars)
   - "View Store" button
4. **Filter:** By city (dropdown)
5. **Empty state:** If <3 stores, show "More stores coming soon" + submit CTA

**SEO (dynamic):**
- Title: "Best {Category} E-commerce Stores in Pakistan | {SiteName}"
- Description: "Discover the top {category} online stores in Pakistan. Browse verified e-commerce shops from Karachi, Lahore, and more."

**Data query:**
```typescript
const stores = await db.select().from(directoryStores)
  .where(
    and(
      eq(directoryStores.category, categoryName),
      eq(directoryStores.isClaimed, true) // or show all? Show all for now
    )
  )
  .orderBy(desc(directoryStores.apiScore));
```

---

### 3.3 `/stores/city/[slug]` — City Page

**URL examples:**
- `/stores/city/karachi`
- `/stores/city/lahore`

**Sections:** Same as category page but filtered by city.

**H1:** "E-commerce Stores in Karachi, Pakistan"

**SEO:**
- Title: "Online Stores in {City}, Pakistan | E-commerce Directory"
- Description: "Browse e-commerce stores based in {City}. Find fashion, beauty, and lifestyle brands shipping across Pakistan."

---

### 3.4 `/stores/[slug]` — Individual Store Profile

**Purpose:** The core page. Every outreach message links here.

**Sections:**

1. **Store Header**
   - Logo (if claimed + provided, else generic store icon)
   - Store name
   - Verified badge (if `isClaimed = true`)
   - Category badge
   - City badge
   - Platform badge ("Shopify")

2. **Description**
   - Full description text
   - If claimed: owner-edited description
   - If unclaimed: research-generated description

3. **Quick Info Grid**
   - Website → external link (opens in new tab)
   - Instagram → external link
   - Facebook → external link
   - City
   - Category
   - Product count (if known)

4. **Claim CTA (if unclaimed)**
   - "Is this your store? Claim this listing free."
   - Button → /stores/claim?store=store-slug
   - Benefits listed:
     - Add your logo and description
     - Verified badge
     - Backlink to your store
     - "Featured Store" badge for Instagram

5. **ShopMate Soft CTA (if claimed)**
   - "Store owner? Automate your product uploads with ShopMate"
   - Link to shopmate.octively.com

6. **Similar Stores**
   - 3 stores in same category
   - "Browse more {category} stores"

**SEO:**
- Title: "{Store Name} | {Category} Store in {City} | Pakistani E-commerce Directory"
- Description: "{Store description truncated to 150 chars}"

---

### 3.5 `/stores/claim` — Claim Form

**Purpose:** Capture owner contact. No auth.

**Fields:**
- Store (pre-filled if `?store=slug` param present, else dropdown of unclaimed stores)
- Your Name*
- Your Email*
- Your WhatsApp Number*
- Your Role (Owner / Manager / Marketing)
- Message (optional)
- Submit

**Flow:**
1. User submits form
2. Data saved to `directoryClaims` table
3. Show success page: "Thanks! We'll verify your claim within 24 hours and send you a WhatsApp message."
4. You manually verify by WhatsApp
5. You update `directoryStores` → `isClaimed = true`, fill owner details

**Validation:**
- WhatsApp must start with +92
- Email must be valid format
- Store must not already be claimed

---

### 3.6 `/stores/submit` — Submit Store

**Purpose:** Organic inbound. Store owners find you and submit themselves.

**Fields:**
- Store Name*
- Website URL*
- Category*
- City*
- Platform* (Shopify / WooCommerce / Other)
- Your Name*
- Your Email*
- Your WhatsApp*
- Instagram URL
- Why should we list your store? (optional)

**Flow:**
1. Save to `directoryStores` with `isClaimed = false`, `tier = "pending_review"`
2. Show success: "Thanks! We'll review your store within 48 hours."
3. You manually review, apply API score, approve/reject

---

## 4. UI Components Needed

### 4.1 Store Card
```tsx
// Used on homepage, category, city pages
<StoreCard
  name="Yousuf Living"
  slug="yousuf-living"
  category="Home & Living"
  city="Karachi"
  description="Premium home decor..."
  logoUrl="..."
  isClaimed={true}
  apiScore={85}
/>
```

### 4.2 Category Card
```tsx
<CategoryCard
  name="Fashion"
  slug="fashion"
  storeCount={25}
  icon={<ShirtIcon />}
/>
```

### 4.3 City Card
```tsx
<CityCard
  name="Karachi"
  slug="karachi"
  storeCount={20}
/>
```

### 4.4 Claim Form
Standard form with shadcn/ui components. No special logic.

---

## 5. Data Seeding

### 5.1 Seed Categories
Insert these after migration:

```sql
INSERT INTO directory_categories (name, slug, description, meta_title, meta_description) VALUES
('Fashion', 'fashion', 'Clothing, apparel, and fashion accessories', 'Best Fashion E-commerce Stores in Pakistan', 'Discover top Pakistani fashion brands and online clothing stores'),
('Beauty', 'beauty', 'Skincare, makeup, and beauty products', 'Best Beauty E-commerce Stores in Pakistan', 'Find Pakistani beauty and skincare brands online'),
('Home & Living', 'home-living', 'Home decor, furniture, and lifestyle', 'Best Home & Living Stores in Pakistan', 'Discover Pakistani home decor and furniture stores');
```

### 5.2 Seed Cities
```sql
INSERT INTO directory_cities (name, slug, store_count, meta_title, meta_description) VALUES
('Karachi', 'karachi', 0, 'E-commerce Stores in Karachi, Pakistan', 'Browse online stores based in Karachi'),
('Lahore', 'lahore', 0, 'E-commerce Stores in Lahore, Pakistan', 'Browse online stores based in Lahore'),
('Islamabad', 'islamabad', 0, 'E-commerce Stores in Islamabad, Pakistan', 'Browse online stores based in Islamabad');
```

### 5.3 Seed Stores
Import the JSON output from Spec 1 using a seed script.

---

## 6. Navigation & Integration

### Header Addition
Add to your portfolio nav:
- "Stores" → /stores

### Footer Addition
- "Store Directory" → /stores
- "Submit Your Store" → /stores/submit
- "Claim Your Listing" → /stores/claim

---

## 7. SEO Requirements

### Meta Tags (All Pages)
- Dynamic title/description per page
- Open Graph image: generic directory OG image
- Canonical URL

### Structured Data (JSON-LD)
On individual store pages, add:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Store Name",
  "url": "https://store.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karachi",
    "addressCountry": "PK"
  }
}
```

### Sitemap
Auto-generate sitemap including:
- /stores
- /stores/category/*
- /stores/city/*
- /stores/*

---

## 8. Performance Requirements

- **Page load:** < 2s for all pages
- **Images:** Logo images lazy-loaded, fallback to generic icon
- **Database:** Index on `slug`, `category`, `city`, `tier`, `isClaimed`
- **Caching:** Static pages ISR revalidate every 3600s (1 hour)

---

## 9. Analytics Tracking

Track these events (use your existing analytics):
- Page view: `/stores`, `/stores/category/*`, `/stores/city/*`, `/stores/*`
- Click: "Claim this store" button
- Click: "View Store" (external website link)
- Form submit: Claim form
- Form submit: Submit store form

---

## 10. Out-of-Scope (Do NOT Build)

| Feature | Why Excluded |
|---------|--------------|
| Auth/login | Manual claim verification via WhatsApp |
| Owner dashboard | You manage claims manually for now |
| Store owner editing | You update DB manually after verification |
| Payment for featured listings | No paid tiers until 50 claimed stores |
| Reviews/ratings | Adds complexity, no validation need |
| Search functionality | 50 stores, category/city browsing is enough |
| Automated WhatsApp | Manual outreach only |

---

## 11. File Structure

```
app/
├── stores/
│   ├── page.tsx                 # /stores homepage
│   ├── layout.tsx               # Directory layout with nav
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx         # Category page
│   ├── city/
│   │   └── [slug]/
│   │       └── page.tsx         # City page
│   ├── [slug]/
│   │   └── page.tsx             # Individual store
│   ├── claim/
│   │   └── page.tsx             # Claim form
│   └── submit/
│       └── page.tsx             # Submit form
components/
├── stores/
│   ├── store-card.tsx
│   ├── category-card.tsx
│   ├── city-card.tsx
│   ├── store-profile.tsx
│   ├── claim-form.tsx
│   └── submit-form.tsx
lib/
├── directory/
│   ├── queries.ts               # DB queries
│   └── seed.ts                  # Seed script
schema/
├── directory.ts                 # Drizzle schema
```

---

## 12. Acceptance Criteria

- [ ] `/stores` displays all categories and cities with accurate counts
- [ ] `/stores/category/fashion` lists only fashion stores
- [ ] `/stores/city/karachi` lists only Karachi stores
- [ ] `/stores/[slug]` displays full store profile with claim CTA
- [ ] Claim form submits to database and shows success
- [ ] Submit form submits to database and shows success
- [ ] All pages have dynamic meta titles/descriptions
- [ ] Mobile responsive
- [ ] 50 seed stores imported and visible
- [ ] No 404s on any store slug from seed data

---