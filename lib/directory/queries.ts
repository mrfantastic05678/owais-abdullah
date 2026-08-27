import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { eq, and, desc, ne } from "drizzle-orm";
import seedData from "@/data/seed_stores.json";

// Fallback seed stores helper for local dev / offline builds
function getLocalSeedStores() {
  return seedData.stores.map((s, index) => ({
    id: index + 1,
    name: s.name,
    slug: s.slug,
    website: s.website,
    category: s.category,
    city: s.city,
    platform: s.platform,
    description: s.description,
    logoUrl: s.logo_url,
    productCount: s.product_count,
    apiScore: s.api_score,
    tier: s.tier,
    painSignals: s.pain_signals,
    platformDetected: s.platform_detected,
    outreachPriority: s.outreach_priority,
    shopmateFit: s.shopmate_fit,
    isClaimed: s.is_claimed || false,
    claimedAt: s.is_claimed ? new Date() : null,
    editToken: s.slug + "-token-2026",
    unclaimedExpiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    ownerName: s.owner_name,
    ownerWhatsapp: s.owner_whatsapp,
    ownerEmail: s.owner_email,
    ownerInstagram: s.owner_instagram,
    instagramUrl: s.instagram_url,
    facebookUrl: s.facebook_url,
    tiktokUrl: (s as any).tiktok_url || null,
    youtubeUrl: (s as any).youtube_url || null,
    linkedinUrl: (s as any).linkedin_url || null,
    twitterUrl: (s as any).twitter_url || null,
    themeColor: (s as any).theme_color || "#3D7BFF",
    bannerPattern: (s as any).banner_pattern || "gradient",
    coverUrl: (s as any).cover_url || null,
    coverMobileUrl: (s as any).cover_mobile_url || null,
    tagline: (s as any).tagline || null,
    highlights: (s as any).highlights || [],
    notes: s.notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  })) as schema.DirectoryStore[];
}

const fallbackCategories: schema.DirectoryCategory[] = [
  {
    id: 1,
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, apparel, footwear, accessories, and jewelry",
    storeCount: 25,
    metaTitle: "Best Fashion E-commerce Stores in Pakistan | Owais Abdullah",
    metaDescription: "Discover top Pakistani fashion brands, eastern pret, luxury couture, and streetwear online stores.",
  },
  {
    id: 2,
    name: "Beauty",
    slug: "beauty",
    description: "Skincare, cosmetics, herbal wellness, and fragrances",
    storeCount: 15,
    metaTitle: "Best Beauty & Skincare E-commerce Stores in Pakistan | Owais Abdullah",
    metaDescription: "Find Pakistani organic skincare, cosmetics, botanical beauty, and fragrance brands.",
  },
  {
    id: 3,
    name: "Home & Living",
    slug: "home-living",
    description: "Home decor, lighting, ceramics, handcrafted textiles, and furniture",
    storeCount: 10,
    metaTitle: "Best Home & Living Stores in Pakistan | Owais Abdullah",
    metaDescription: "Discover Pakistani artisanal home decor, ceramic pottery, bed linen, and handcrafted rugs.",
  },
];

const fallbackCities: schema.DirectoryCity[] = [
  {
    id: 1,
    name: "Karachi",
    slug: "karachi",
    storeCount: 20,
    metaTitle: "E-commerce Stores in Karachi, Pakistan | Store Directory",
    metaDescription: "Browse online stores and verified direct-to-consumer brands based in Karachi.",
  },
  {
    id: 2,
    name: "Lahore",
    slug: "lahore",
    storeCount: 18,
    metaTitle: "E-commerce Stores in Lahore, Pakistan | Store Directory",
    metaDescription: "Browse online stores and verified direct-to-consumer brands based in Lahore.",
  },
  {
    id: 3,
    name: "Islamabad",
    slug: "islamabad",
    storeCount: 8,
    metaTitle: "E-commerce Stores in Islamabad, Pakistan | Store Directory",
    metaDescription: "Browse online stores and verified direct-to-consumer brands based in Islamabad.",
  },
  {
    id: 4,
    name: "Faisalabad",
    slug: "faisalabad",
    storeCount: 2,
    metaTitle: "E-commerce Stores in Faisalabad, Pakistan | Store Directory",
    metaDescription: "Browse online stores and textile powerhouses based in Faisalabad.",
  },
  {
    id: 5,
    name: "Rawalpindi",
    slug: "rawalpindi",
    storeCount: 2,
    metaTitle: "E-commerce Stores in Rawalpindi, Pakistan | Store Directory",
    metaDescription: "Browse online stores and artisan labels based in Rawalpindi.",
  },
  {
    id: 6,
    name: "Peshawar",
    slug: "peshawar",
    storeCount: 1,
    metaTitle: "E-commerce Stores in Peshawar, Pakistan | Store Directory",
    metaDescription: "Browse handcrafted leather and tribal jewelry stores based in Peshawar.",
  },
];

export async function getCategories(): Promise<schema.DirectoryCategory[]> {
  if (!db) return fallbackCategories;
  try {
    const cats = await db.select().from(schema.directoryCategories).orderBy(desc(schema.directoryCategories.storeCount));
    return cats.length > 0 ? cats : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
}

export async function getCategoryBySlug(slug: string): Promise<schema.DirectoryCategory | null> {
  const normalizedSlug = slug.toLowerCase();
  if (!db) {
    return fallbackCategories.find((c) => c.slug === normalizedSlug) || null;
  }
  try {
    const [cat] = await db
      .select()
      .from(schema.directoryCategories)
      .where(eq(schema.directoryCategories.slug, normalizedSlug))
      .limit(1);
    return cat || fallbackCategories.find((c) => c.slug === normalizedSlug) || null;
  } catch {
    return fallbackCategories.find((c) => c.slug === normalizedSlug) || null;
  }
}

export async function getCities(): Promise<schema.DirectoryCity[]> {
  if (!db) return fallbackCities;
  try {
    const cities = await db.select().from(schema.directoryCities).orderBy(desc(schema.directoryCities.storeCount));
    return cities.length > 0 ? cities : fallbackCities;
  } catch {
    return fallbackCities;
  }
}

export async function getCityBySlug(slug: string): Promise<schema.DirectoryCity | null> {
  const normalizedSlug = slug.toLowerCase();
  if (!db) {
    return fallbackCities.find((c) => c.slug === normalizedSlug) || null;
  }
  try {
    const [city] = await db
      .select()
      .from(schema.directoryCities)
      .where(eq(schema.directoryCities.slug, normalizedSlug))
      .limit(1);
    return city || fallbackCities.find((c) => c.slug === normalizedSlug) || null;
  } catch {
    return fallbackCities.find((c) => c.slug === normalizedSlug) || null;
  }
}

export async function getFeaturedStores(limit = 6): Promise<schema.DirectoryStore[]> {
  if (!db) {
    return getLocalSeedStores()
      .filter((s) => s.tier === "gold")
      .slice(0, limit);
  }
  try {
    const stores = await db
      .select()
      .from(schema.directoryStores)
      .where(eq(schema.directoryStores.tier, "gold"))
      .orderBy(desc(schema.directoryStores.apiScore))
      .limit(limit);
    return stores.length > 0
      ? stores
      : getLocalSeedStores()
          .filter((s) => s.tier === "gold")
          .slice(0, limit);
  } catch {
    return getLocalSeedStores()
      .filter((s) => s.tier === "gold")
      .slice(0, limit);
  }
}

export async function getStoresByCategory(
  categoryNameOrSlug: string,
  cityFilter?: string
): Promise<schema.DirectoryStore[]> {
  const localStores = getLocalSeedStores();
  const categoryMatch = fallbackCategories.find(
    (c) => c.slug === categoryNameOrSlug.toLowerCase() || c.name.toLowerCase() === categoryNameOrSlug.toLowerCase()
  );
  const categoryName = categoryMatch ? categoryMatch.name : categoryNameOrSlug;

  if (!db) {
    return localStores
      .filter((s) => {
        const matchCat = s.category.toLowerCase() === categoryName.toLowerCase();
        const matchCity = !cityFilter || s.city.toLowerCase() === cityFilter.toLowerCase();
        return matchCat && matchCity;
      })
      .sort((a, b) => (b.apiScore || 0) - (a.apiScore || 0));
  }

  try {
    let query = db
      .select()
      .from(schema.directoryStores)
      .where(
        cityFilter
          ? and(
              eq(schema.directoryStores.category, categoryName),
              eq(schema.directoryStores.city, cityFilter)
            )
          : eq(schema.directoryStores.category, categoryName)
      )
      .orderBy(desc(schema.directoryStores.apiScore));

    const stores = await query;
    return stores.length > 0
      ? stores
      : localStores
          .filter((s) => {
            const matchCat = s.category.toLowerCase() === categoryName.toLowerCase();
            const matchCity = !cityFilter || s.city.toLowerCase() === cityFilter.toLowerCase();
            return matchCat && matchCity;
          })
          .sort((a, b) => (b.apiScore || 0) - (a.apiScore || 0));
  } catch {
    return localStores
      .filter((s) => {
        const matchCat = s.category.toLowerCase() === categoryName.toLowerCase();
        const matchCity = !cityFilter || s.city.toLowerCase() === cityFilter.toLowerCase();
        return matchCat && matchCity;
      })
      .sort((a, b) => (b.apiScore || 0) - (a.apiScore || 0));
  }
}

export async function getStoresByCity(
  cityNameOrSlug: string,
  categoryFilter?: string
): Promise<schema.DirectoryStore[]> {
  const localStores = getLocalSeedStores();
  const cityMatch = fallbackCities.find(
    (c) => c.slug === cityNameOrSlug.toLowerCase() || c.name.toLowerCase() === cityNameOrSlug.toLowerCase()
  );
  const cityName = cityMatch ? cityMatch.name : cityNameOrSlug;

  if (!db) {
    return localStores
      .filter((s) => {
        const matchCity = s.city.toLowerCase() === cityName.toLowerCase();
        const matchCat = !categoryFilter || s.category.toLowerCase() === categoryFilter.toLowerCase();
        return matchCity && matchCat;
      })
      .sort((a, b) => (b.apiScore || 0) - (a.apiScore || 0));
  }

  try {
    let query = db
      .select()
      .from(schema.directoryStores)
      .where(
        categoryFilter
          ? and(
              eq(schema.directoryStores.city, cityName),
              eq(schema.directoryStores.category, categoryFilter)
            )
          : eq(schema.directoryStores.city, cityName)
      )
      .orderBy(desc(schema.directoryStores.apiScore));

    const stores = await query;
    return stores.length > 0
      ? stores
      : localStores
          .filter((s) => {
            const matchCity = s.city.toLowerCase() === cityName.toLowerCase();
            const matchCat = !categoryFilter || s.category.toLowerCase() === categoryFilter.toLowerCase();
            return matchCity && matchCat;
          })
          .sort((a, b) => (b.apiScore || 0) - (a.apiScore || 0));
  } catch {
    return localStores
      .filter((s) => {
        const matchCity = s.city.toLowerCase() === cityName.toLowerCase();
        const matchCat = !categoryFilter || s.category.toLowerCase() === categoryFilter.toLowerCase();
        return matchCity && matchCat;
      })
      .sort((a, b) => (b.apiScore || 0) - (a.apiScore || 0));
  }
}

export async function getStoreBySlug(slug: string): Promise<schema.DirectoryStore | null> {
  const normalizedSlug = slug.toLowerCase();
  const localStores = getLocalSeedStores();

  if (!db) {
    return localStores.find((s) => s.slug === normalizedSlug) || null;
  }

  try {
    const [store] = await db
      .select()
      .from(schema.directoryStores)
      .where(eq(schema.directoryStores.slug, normalizedSlug))
      .limit(1);
    return store || localStores.find((s) => s.slug === normalizedSlug) || null;
  } catch {
    return localStores.find((s) => s.slug === normalizedSlug) || null;
  }
}

export async function getSimilarStores(
  category: string,
  currentStoreId: number,
  limit = 3
): Promise<schema.DirectoryStore[]> {
  const localStores = getLocalSeedStores();

  if (!db) {
    return localStores
      .filter((s) => s.category.toLowerCase() === category.toLowerCase() && s.id !== currentStoreId)
      .slice(0, limit);
  }

  try {
    const stores = await db
      .select()
      .from(schema.directoryStores)
      .where(
        and(
          eq(schema.directoryStores.category, category),
          ne(schema.directoryStores.id, currentStoreId)
        )
      )
      .orderBy(desc(schema.directoryStores.apiScore))
      .limit(limit);

    return stores.length > 0
      ? stores
      : localStores
          .filter((s) => s.category.toLowerCase() === category.toLowerCase() && s.id !== currentStoreId)
          .slice(0, limit);
  } catch {
    return localStores
      .filter((s) => s.category.toLowerCase() === category.toLowerCase() && s.id !== currentStoreId)
      .slice(0, limit);
  }
}

export async function getUnclaimedStores(): Promise<{ id: number; name: string; slug: string }[]> {
  const localStores = getLocalSeedStores();

  if (!db) {
    return localStores
      .filter((s) => !s.isClaimed)
      .map((s) => ({ id: s.id, name: s.name, slug: s.slug }));
  }

  try {
    const stores = await db
      .select({
        id: schema.directoryStores.id,
        name: schema.directoryStores.name,
        slug: schema.directoryStores.slug,
      })
      .from(schema.directoryStores)
      .where(eq(schema.directoryStores.isClaimed, false))
      .orderBy(schema.directoryStores.name);

    return stores.length > 0
      ? stores
      : localStores
          .filter((s) => !s.isClaimed)
          .map((s) => ({ id: s.id, name: s.name, slug: s.slug }));
  } catch {
    return localStores
      .filter((s) => !s.isClaimed)
      .map((s) => ({ id: s.id, name: s.name, slug: s.slug }));
  }
}

export async function getAllStoreSlugs(): Promise<string[]> {
  const localStores = getLocalSeedStores();
  if (!db) return localStores.map((s) => s.slug);
  try {
    const stores = await db.select({ slug: schema.directoryStores.slug }).from(schema.directoryStores);
    return stores.length > 0 ? stores.map((s) => s.slug) : localStores.map((s) => s.slug);
  } catch {
    return localStores.map((s) => s.slug);
  }
}
