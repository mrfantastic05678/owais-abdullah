# Store Research & Scoring Agent

**Purpose:** Systematically discover, research, and qualify Pakistani e-commerce stores for the directory. Only stores scoring 60+ on the Automation Pain Index (API) get listed.

**Output:** A scored seed list of 50 stores with complete research data, ready for directory import.

---

## 1. Discovery Channels (Priority Order)

| Channel | Method | Expected Yield | Priority |
|---------|--------|---------------|----------|
| **EachSpy** | Filter Pakistan Shopify stores by category + product count | 30–40 stores | #1 |
| **Instagram** | Search hashtags, check bios for website links | 10–15 stores | #2 |
| **Personal Network** | Warm intros from Yousuf Living, WinBachat, StrideX | 5–10 stores | #3 |
| **Facebook Groups** | "Shopify Pakistan," "E-commerce Pakistan" — identify active stores | 3–5 stores | #4 |

---

## 2. The API Score (Automation Pain Index)

For every store discovered, score 0–100 using this exact rubric:

### 2.1 Product Count (25 points)
| Range | Points | Rationale |
|-------|--------|-----------|
| 40–120 products | 25 | Sweet spot — enough pain, not enterprise complexity |
| 120–200 products | 20 | High pain but may have systems already |
| 200–400 products | 15 | Large, worth trying |
| 15–40 products | 10 | Borderline, low priority |
| <15 products | 0 | Ignore — manual is faster |
| Cannot determine | 0 | Skip if unknown |

**How to count:** Browse "All Products" or main collections. Estimate. If paginated, count per page × pages.

### 2.2 Update Frequency Signal (20 points)
| Signal | Points | How to Detect |
|--------|--------|---------------|
| "New Arrivals" / "New In" collection with >5 items | 20 | Check homepage/collections |
| Instagram product posts in last 7 days | 15 | Check recent posts |
| "Coming Soon" or "Eid Collection" banner | 10 | Homepage signals |
| No new product signals | 5 | Static catalog |
| Cannot determine | 0 | Skip |

### 2.3 Category (20 points)
| Category | Points | Examples |
|----------|--------|----------|
| Fashion / Clothing / Apparel | 20 | Dresses, Kurtis, Unstitched, Western |
| Beauty / Skincare | 15 | Makeup, Serums, Organic skincare |
| Home & Living / Decor | 10 | Furniture, Bedding, Kitchen |
| Jewelry / Accessories | 10 | Artificial jewelry, Watches, Bags |
| Kids / Baby | 10 | Clothing, Toys, Essentials |
| Electronics | 5 | Gadgets, Accessories |
| Food / Grocery | 2 | Perishables, Snacks |
| Digital / Services | 0 | Ignore |

### 2.4 Platform (15 points)
| Platform | Points | Detection Method |
|----------|--------|------------------|
| Shopify | 15 | URL contains `.myshopify.com`, or use builtwith.com |
| WooCommerce | 5 | `/wp-content/` in source, or builtwith.com |
| Daraz / Custom / Unknown | 0 | Ignore for now |

### 2.5 Social Activity (10 points)
| Activity | Points | How to Measure |
|----------|--------|----------------|
| 3+ posts/week on Instagram | 10 | Count last 9 posts, divide by date range |
| 1–2 posts/week | 5 | Active but not aggressive |
| <1 post/week | 0 | Dormant or hobby store |
| No Instagram found | 0 | Skip |

### 2.6 Website Quality (10 points)
| Quality | Points | Criteria |
|---------|--------|----------|
| Professional paid theme, custom domain, working checkout | 10 | Looks like a real business |
| Basic Shopify theme, functional | 7 | Legitimate but early stage |
| Free theme, messy, broken images | 3 | Amateur — low conversion potential |
| Broken, no SSL, placeholder text | 0 | Ignore |

---

## 3. Scoring Decision Matrix

| Total Score | Tier | Action |
|-------------|------|--------|
| 80–100 | **Gold** | List immediately. Priority outreach. |
| 60–79 | **Silver** | List. Standard outreach. |
| 40–59 | **Bronze** | List only if you need to hit 50-store target. No ShopMate outreach. |
| <40 | **Ignore** | Do not list. Do not research further. |

**Target mix for first 50 stores:** 20 Gold, 20 Silver, 10 Bronze (filler).

---

## 4. Research Process (Step-by-Step)

### Step 1: Discovery (5 min/store)
1. Open EachSpy or Instagram hashtag
2. Find a store with a website link
3. Open the website in a new tab

### Step 2: Platform Detection (1 min)
1. Check if URL contains `.myshopify.com`
2. If unclear, go to [builtwith.com](https://builtwith.com) and enter the domain
3. Record: Shopify / WooCommerce / Other / Unknown

**If not Shopify → STOP. Skip store unless it's a warm network lead.**

### Step 3: Product Count (3 min)
1. Navigate to "Shop" or "All Products"
2. If paginated: count items on first page × total pages
3. If infinite scroll: scroll to bottom, estimate
4. If collections only: sum major collections
5. Record estimated number

**If <40 products → STOP. Score will be too low.**

### Step 4: Category Classification (1 min)
1. Determine primary category from homepage/collections
2. Map to category rubric above
3. Record category + points

### Step 5: Update Frequency (3 min)
1. Check homepage for "New Arrivals" collection
2. Check Instagram last 9 posts — how many are product posts?
3. Check date of most recent product/collection
4. Record signals + points

### Step 6: Social Activity (2 min)
1. Find Instagram from website footer or bio
2. Count posts in last 30 days
3. Calculate posts per week
4. Record activity level + points

### Step 7: Website Quality (2 min)
1. Browse homepage, product page, checkout
2. Check for SSL (padlock icon)
3. Assess theme quality, images, descriptions
4. Record quality score + points

### Step 8: Owner Contact (5 min)
1. Check "About Us" or "Contact" page for owner name
2. Check Instagram bio for WhatsApp number or email
3. Check Facebook page for contact info
4. **Record every contact method found**
5. If no contact found, mark as "needs hunting"

### Step 9: Calculate & Decide (1 min)
1. Sum all points
2. Apply tier label
3. If Gold/Silver → proceed to data entry
4. If Bronze → only if below 50-store target
5. If Ignore → discard

**Total time per store: ~20 minutes**

---

## 5. Data Entry Template

For every qualified store, fill this exact JSON structure:

```json
{
  "name": "Store Name (exact spelling from website)",
  "slug": "store-name-kebab-case",
  "website": "https://www.store.com",
  "category": "Fashion",
  "city": "Karachi",
  "platform": "Shopify",
  "description": "2-3 sentence real description. Mention what they sell, their style, and one specific observation. NOT generic AI fluff.",
  "logo_url": "https://cdn.shopify.com/.../logo.png (or null if not found)",
  "product_count": 87,
  "api_score": 82,
  "tier": "gold",
  "pain_signals": ["frequent_new_arrivals", "large_catalog", "active_social"],
  "owner_name": "Fatima Khan",
  "owner_whatsapp": "+92 3XX XXXXXXX",
  "owner_email": "hello@store.com",
  "owner_instagram": "@storename",
  "platform_detected": "Shopify",
  "outreach_priority": 1,
  "shopmate_fit": "high",
  "notes": "Drops new collection every Friday. 3-person team. Instagram very active with product reels."
}
```

### Description Writing Rules
- **DO:** "Lahore-based contemporary womenswear brand specializing in formal eastern wear. Drops 15–20 new designs monthly with active Instagram reels showcasing each piece. Shopify store with professional photography and size-inclusive catalog."
- **DON'T:** "A leading online fashion store offering high-quality products at affordable prices with excellent customer service."

---

## 6. Instagram Recon Checklist

For each store found via Instagram:

- [ ] Bio contains website link?
- [ ] Website loads and is functional?
- [ ] Website is Shopify?
- [ ] Product count estimable?
- [ ] Category identifiable?
- [ ] Last 9 posts within 30 days?
- [ ] At least 50% of recent posts are product-related (not just quotes/memes)?
- [ ] Instagram following >500 (signal of real business, not hobby)?
- [ ] Contact info in bio or link sticker?
- [ ] WhatsApp number visible anywhere?

**Minimum pass: 7/10 checks**

---

## 7. EachSpy Workflow

1. Log into EachSpy (or export if you have data)
2. Filter: Country = Pakistan, Platform = Shopify
3. Sort by: Product count (descending)
4. Filter categories: Fashion, Clothing, Apparel, Beauty, Skincare, Home
5. Export top 100 results
6. For each exported store, open URL and apply API scoring
7. Only keep stores scoring 60+

---

## 8. Deliverables

**Final output:** A JSON file `seed_stores.json` containing exactly 50 scored stores.

**Structure:**
```json
{
  "stores": [
    { ...store object... },
    { ...store object... }
  ],
  "summary": {
    "total_researched": 150,
    "total_qualified": 50,
    "gold": 20,
    "silver": 20,
    "bronze": 10,
    "categories": { "Fashion": 25, "Beauty": 15, "Home": 10 },
    "cities": { "Karachi": 20, "Lahore": 18, "Islamabad": 8, "Other": 4 }
  }
}
```

**Also produce:** `rejected_stores.json` with stores scoring <60 and reason for rejection (for audit).

---

## 9. Quality Gates

Before submitting seed list, verify:

- [ ] All 50 stores are Shopify
- [ ] All 50 have estimated product count
- [ ] All 50 have owner contact (WhatsApp or email)
- [ ] No store has a generic AI description
- [ ] Gold tier stores have specific pain signal notes
- [ ] City is accurate (check "About" page or shipping info)
- [ ] No duplicate slugs
- [ ] All websites use HTTPS