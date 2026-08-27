# Store Directory Implementation Plan & Task Tracker

**Spec Reference:** [`docs/store-directory-spec.md`](docs/store-directory-spec.md) & [`docs/store-directory-research-plan.md`](docs/store-directory-research-plan.md)  
**Target:** Build the public-facing Pakistani e-commerce store directory at `/stores` with 50 seed stores, category/city filtering, claim/submit forms, and ShopMate lead generation.

---

## 🚀 Execution Strategy & Recommended Starting Steps

To start building efficiently without blocking or premature complexity:

1. **Step 1: Setup Database & ORM Stack** (✅ Completed)
   - Installed `drizzle-orm`, `drizzle-kit`, and `@neondatabase/serverless`.
   - Added `.env.example` with `DATABASE_URL`.
   - Defined Drizzle schema (`schema/directory.ts`) for stores, claims, categories, and cities.
   - Configured `drizzle.config.ts` and `lib/db.ts`.

2. **Step 2: Seed Initial Data** (✅ Completed)
   - Created `data/seed_stores.json` with 50 qualified, scored Pakistani stores adhering to the Automation Pain Index (API Score 60+, non-generic descriptions, verified Shopify platform).
   - Created seed script `scripts/seed-directory.ts` for database population and counts sync.

3. **Step 3: Build Data Layer & Reusable UI Components** (✅ Completed)
   - Written typed queries in `lib/directory/queries.ts` with ISR and fallback resilience.
   - Created directory components (`StoreCard`, `CategoryCard`, `CityCard`, `StoreProfile`, `ClaimForm`, `SubmitForm`, `StoreFilterBar`).

4. **Step 4: Implement App Router Pages & Forms** (✅ Completed)
   - Implemented directory layout (`app/stores/layout.tsx`).
   - Built Directory Homepage (`/stores`), Category Page (`/stores/category/[slug]`), City Page (`/stores/city/[slug]`), and Store Profile (`/stores/[slug]`).
   - Implemented Server Actions for Claim (`/stores/claim`) and Submit (`/stores/submit`).

5. **Step 5: Global Integration, SEO & Verification** (✅ Completed)
   - Added "Stores" to global Header navigation and Footer.
   - Added dynamic SEO metadata, JSON-LD structured data (Schema.org `Organization`), and sitemap generation entries.
   - Verified production Next.js build with 0 errors across all 50 store routes.

---

## 📋 Detailed Task Checklist

### Phase 1: Environment & Database Setup
- [x] **1.1** Install required dependencies (`drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `tsx`).
- [x] **1.2** Verify and configure `.env.example` with `DATABASE_URL` pointing to Neon Postgres.
- [x] **1.3** Create `drizzle.config.ts` configured for Neon Postgres and schema path.
- [x] **1.4** Create `lib/db.ts` database client singleton instance with null-safety.
- [x] **1.5** Define schema in `schema/directory.ts`:
  - [x] `directoryStores` table (all fields, indices for `slug`, `category`, `city`, `tier`, `isClaimed`).
  - [x] `directoryClaims` table (foreign key to `directoryStores.id`, claimant info, status).
  - [x] `directoryCategories` table (slug, name, store count, SEO metadata).
  - [x] `directoryCities` table (slug, name, store count, SEO metadata).
- [x] **1.6** Add database scripts (`db:push`, `db:seed`, `db:studio`) in `package.json`.

---

### Phase 2: Data Seeding & Seed Script
- [x] **2.1** Create `data/seed_stores.json` with 50 qualified Pakistani e-commerce stores adhering to the Automation Pain Index (API score, tier, platform: Shopify, pain signals, contact info, authentic descriptions).
- [x] **2.2** Create seed script `scripts/seed-directory.ts`:
  - [x] Insert default categories (`Fashion`, `Beauty`, `Home & Living`).
  - [x] Insert default cities (`Karachi`, `Lahore`, `Islamabad`, `Faisalabad`, `Rawalpindi`, `Peshawar`).
  - [x] Insert 50 store records.
  - [x] Compute and update `store_count` for categories and cities dynamically.
- [x] **2.3** Add npm script `"db:seed": "tsx scripts/seed-directory.ts"`.

---

### Phase 3: Data Access Layer & Server Actions
- [x] **3.1** Implement `lib/directory/queries.ts`:
  - [x] `getCategories()`
  - [x] `getCities()`
  - [x] `getFeaturedStores(limit: 6)` (Gold-tier stores)
  - [x] `getStoresByCategory(slug: string, cityFilter?: string)`
  - [x] `getStoresByCity(slug: string, categoryFilter?: string)`
  - [x] `getStoreBySlug(slug: string)`
  - [x] `getSimilarStores(category: string, currentStoreId: number, limit: 3)`
  - [x] `getUnclaimedStores()` (for claim dropdown selector)
  - [x] `getAllStoreSlugs()`
- [x] **3.2** Implement Server Actions (`app/actions/directory.ts`):
  - [x] `submitClaimAction` with validation (valid email, Pakistani WhatsApp starting with `+92`, check not already claimed).
  - [x] `submitStoreAction` with validation (store name, valid URL, category, city, contact info).

---

### Phase 4: UI Components (`components/stores/`)
- [x] **4.1** `StoreCard.tsx` — Store card with logo fallback, badges (verified/claimed, platform, tier), description truncate, "View Store" link.
- [x] **4.2** `CategoryCard.tsx` — Category card with icon, title, store count, link.
- [x] **4.3** `CityCard.tsx` — City card with name, store count, link.
- [x] **4.4** `StoreProfile.tsx` — Comprehensive profile header, quick info grid (website, social links, product count), Claim CTA (unclaimed) or ShopMate CTA (claimed), similar stores grid.
- [x] **4.5** `ClaimForm.tsx` — Interactive claim submission form with feedback toast / success state.
- [x] **4.6** `SubmitForm.tsx` — Inbound store submission form with feedback toast / success state.
- [x] **4.7** `StoreFilterBar.tsx` — Client interactive filter for listing pages.

---

### Phase 5: Directory Pages & Routing (`app/stores/`)
- [x] **5.1** `app/stores/layout.tsx` — Directory layout wrapper with dedicated subnav and theme consistency.
- [x] **5.2** `app/stores/page.tsx` — Homepage:
  - [x] Hero section with title and search prompt.
  - [x] Categories grid.
  - [x] Cities grid.
  - [x] Featured Gold-tier stores grid (6 stores).
  - [x] Submit Store CTA section.
- [x] **5.3** `app/stores/category/[slug]/page.tsx` — Category listing:
  - [x] Dynamic category title & breadcrumb.
  - [x] City dropdown filter.
  - [x] Stores grid ordered by `apiScore` desc.
  - [x] Empty state (< 3 stores) with submit CTA.
- [x] **5.4** `app/stores/city/[slug]/page.tsx` — City listing:
  - [x] Dynamic city title & breadcrumb.
  - [x] Category dropdown filter.
  - [x] Stores grid ordered by `apiScore` desc.
- [x] **5.5** `app/stores/[slug]/page.tsx` — Store profile:
  - [x] Full store profile details.
  - [x] Unclaimed banner & claim CTA linking to `/stores/claim?store=[slug]`.
  - [x] Claimed banner with soft ShopMate CTA (`shopmate.octively.com`).
  - [x] 3 similar stores from the same category.
- [x] **5.6** `app/stores/claim/page.tsx` — Claim form page with `?store=[slug]` auto-select.
- [x] **5.7** `app/stores/submit/page.tsx` — Submit store form page with 48h review notice.

---

### Phase 6: Global Integration & Navigation
- [x] **6.1** Update Header navigation (`components/Header.tsx`) to include "STORES" link.
- [x] **6.2** Update Footer (`components/Footer.tsx`) with:
  - [x] Store Directory (`/stores`)
  - [x] Submit Your Store (`/stores/submit`)
  - [x] Claim Your Listing (`/stores/claim`)

---

### Phase 7: SEO, JSON-LD & Performance
- [x] **7.1** Dynamic `generateMetadata` for `/stores`, `/stores/category/[slug]`, `/stores/city/[slug]`, and `/stores/[slug]`.
- [x] **7.2** Schema.org `Organization` JSON-LD on store profile pages (`/stores/[slug]`).
- [x] **7.3** Configure ISR `revalidate = 3600` (1 hour) on directory pages for high performance.
- [x] **7.4** Include dynamic store, category, and city URLs in `app/sitemap.ts`.

---

### Phase 8: Quality Assurance & Acceptance Testing
- [x] **8.1** Verify all 50 seed stores render without 404s (SSG prerendered).
- [x] **8.2** Verify category counts match store count in database.
- [x] **8.3** Verify city counts match store count in database.
- [x] **8.4** Test claim submission: creates pending record with valid WhatsApp validation (`+92`).
- [x] **8.5** Test store submission: creates unverified store record.
- [x] **8.6** Check responsiveness on mobile, tablet, and desktop viewports.
- [x] **8.7** Run Next.js build (`npm run build`) to ensure 0 TypeScript / lint errors (Build succeeded with code 0).
