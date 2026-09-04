import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { COUNTRY_NAMES } from "@/lib/analytics-parser";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const serverPassword =
      process.env.ANALYTICS_PASSWORD ||
      process.env.ADMIN_PASSWORD ||
      "owais-vault-2026";

    if (!password || password !== serverPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // 1. Fetch posts data
    const postsQuery = `*[_type == "post"] | order(_createdAt desc){
      _id,
      title,
      "slug": slug.current,
      mainImage,
      summary,
      _createdAt,
      likes,
      dislikes,
      views,
      categories[]->{title},
      author->{name}
    }`;

    // 2. Fetch promo tracking data
    const promoQuery = `*[_type == "promoAnalytics" && _id == "promoAnalytics_octively"][0]`;

    // 3. Fetch promo banner status
    const bannerQuery = `*[_type == "promoBanner" && isActive == true][0]{
      _id,
      title,
      isActive,
      mode
    }`;

    // 4. Fetch site audience & geo telemetry
    const siteAnalyticsQuery = `*[_type == "siteAnalytics" && _id == "siteAnalytics_global"][0]`;

    const [rawPosts, rawPromo, bannerConfig, rawSiteAnalytics] = await Promise.all([
      client.fetch(postsQuery),
      client.fetch(promoQuery),
      client.fetch(bannerQuery),
      client.fetch(siteAnalyticsQuery),
    ]);

    const now = Date.now();

    // Process Post Analytics
    interface RawPost {
      _id: string;
      title: string;
      slug: string;
      summary?: string;
      _createdAt: string;
      likes?: number;
      dislikes?: number;
      views?: number;
      categories?: { title: string }[];
      author?: { name: string };
    }

    const posts = (rawPosts || []).map((p: RawPost) => {
      const views = p.views || 0;
      const likes = p.likes || 0;
      const dislikes = p.dislikes || 0;
      const netLikes = likes - dislikes;
      const totalReactions = likes + dislikes;
      const sentimentRatio = totalReactions > 0 ? Math.round((likes / totalReactions) * 100) : 100;
      const ageInDays = Math.max(1, Math.floor((now - new Date(p._createdAt).getTime()) / (1000 * 60 * 60 * 24)));
      const engagementScore = views * 1 + likes * 10 - dislikes * 5;
      const velocity = Number(((views + likes * 3) / ageInDays).toFixed(2));

      return {
        ...p,
        views,
        likes,
        dislikes,
        netLikes,
        sentimentRatio,
        ageInDays,
        engagementScore,
        velocity,
      };
    });

    const totalPosts = posts.length;
    const totalViews = posts.reduce((acc: number, p: { views: number }) => acc + p.views, 0);
    const totalLikes = posts.reduce((acc: number, p: { likes: number }) => acc + p.likes, 0);
    const totalDislikes = posts.reduce((acc: number, p: { dislikes: number }) => acc + p.dislikes, 0);
    const avgViewsPerPost = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;
    const overallSentiment =
      totalLikes + totalDislikes > 0
        ? Math.round((totalLikes / (totalLikes + totalDislikes)) * 100)
        : 100;

    // Segment 1: Top Overall Performers
    const topPerformers = [...posts]
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 6);

    // Segment 2: Top Latest
    const topLatest = [...posts]
      .sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())
      .slice(0, 6)
      .sort((a, b) => b.velocity - a.velocity);

    // Segment 3: Decreasing / Needs Attention
    const decreasingNeedsAttention = posts.filter(
      (p: { dislikes: number; sentimentRatio: number; views: number; likes: number; ageInDays: number }) =>
        p.dislikes > 0 ||
        (p.views > 20 && p.sentimentRatio < 75) ||
        (p.views > 50 && p.likes === 0) ||
        (p.ageInDays > 60 && p.views > 100 && p.likes / Math.max(p.views, 1) < 0.01)
    );

    // Promo Banner Analytics & A/B Testing Breakdown
    const promo = rawPromo || {
      variantA_impressions: 0,
      variantA_clicks: 0,
      variantA_dismissals: 0,
      variantB_impressions: 0,
      variantB_clicks: 0,
      variantB_dismissals: 0,
    };

    const impA = promo.variantA_impressions || 0;
    const clickA = promo.variantA_clicks || 0;
    const dismA = promo.variantA_dismissals || 0;
    const ctrA = impA > 0 ? Number(((clickA / impA) * 100).toFixed(2)) : 0;
    const dismRateA = impA > 0 ? Number(((dismA / impA) * 100).toFixed(2)) : 0;

    const impB = promo.variantB_impressions || 0;
    const clickB = promo.variantB_clicks || 0;
    const dismB = promo.variantB_dismissals || 0;
    const ctrB = impB > 0 ? Number(((clickB / impB) * 100).toFixed(2)) : 0;
    const dismRateB = impB > 0 ? Number(((dismB / impB) * 100).toFixed(2)) : 0;

    const totalPromoImp = impA + impB;
    const totalPromoClicks = clickA + clickB;
    const totalPromoDism = dismA + dismB;
    const totalPromoCtr = totalPromoImp > 0 ? Number(((totalPromoClicks / totalPromoImp) * 100).toFixed(2)) : 0;
    const totalPromoDismRate = totalPromoImp > 0 ? Number(((totalPromoDism / totalPromoImp) * 100).toFixed(2)) : 0;

    let abWinner = "Gathering Data (50/50 Split)";
    if (impA >= 5 && impB >= 5) {
      if (ctrA > ctrB) {
        abWinner = "Variant A (Visual Banner) Leading";
      } else if (ctrB > ctrA) {
        abWinner = "Variant B (Founder Text) Leading";
      } else {
        abWinner = "Tied Performance";
      }
    }

    // Process Audience & Geo Telemetry
    const safeParse = (str?: string) => {
      try {
        return str ? JSON.parse(str) : {};
      } catch {
        return {};
      }
    };

    const rawCountries = safeParse(rawSiteAnalytics?.topCountriesJson);
    const rawCities = safeParse(rawSiteAnalytics?.topCitiesJson);
    const rawDevices = safeParse(rawSiteAnalytics?.devicesJson);
    const rawBrowsers = safeParse(rawSiteAnalytics?.browsersJson);
    const rawOS = safeParse(rawSiteAnalytics?.operatingSystemsJson);
    const rawReferrers = safeParse(rawSiteAnalytics?.referrersJson);

    // Calculate totals for percentages
    const totalCountryHits = Object.values(rawCountries).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1;
    const totalCityHits = Object.values(rawCities).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1;
    const totalDeviceHits = Object.values(rawDevices).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1;
    const totalBrowserHits = Object.values(rawBrowsers).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1;
    const totalOSHits = Object.values(rawOS).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1;
    const totalReferrerHits = Object.values(rawReferrers).reduce((a: number, b: any) => a + (Number(b) || 0), 0) || 1;

    const countries = Object.entries(rawCountries)
      .map(([code, count]) => {
        const c = Number(count) || 0;
        const info = COUNTRY_NAMES[code.toUpperCase()] || { name: code, flag: "🌐" };
        return {
          code: code.toUpperCase(),
          name: info.name,
          flag: info.flag,
          count: c,
          percentage: Number(((c / totalCountryHits) * 100).toFixed(1)),
        };
      })
      .sort((a, b) => b.count - a.count);

    const cities = Object.entries(rawCities)
      .map(([name, count]) => {
        const c = Number(count) || 0;
        return {
          name,
          count: c,
          percentage: Number(((c / totalCityHits) * 100).toFixed(1)),
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    const desktopCount = Number(rawDevices["Desktop"]) || 0;
    const mobileCount = Number(rawDevices["Mobile"]) || 0;
    const tabletCount = Number(rawDevices["Tablet"]) || 0;

    const devices = {
      desktop: {
        count: desktopCount,
        percentage: Number(((desktopCount / totalDeviceHits) * 100).toFixed(1)),
      },
      mobile: {
        count: mobileCount,
        percentage: Number(((mobileCount / totalDeviceHits) * 100).toFixed(1)),
      },
      tablet: {
        count: tabletCount,
        percentage: Number(((tabletCount / totalDeviceHits) * 100).toFixed(1)),
      },
    };

    const browsers = Object.entries(rawBrowsers)
      .map(([name, count]) => {
        const c = Number(count) || 0;
        return {
          name,
          count: c,
          percentage: Number(((c / totalBrowserHits) * 100).toFixed(1)),
        };
      })
      .sort((a, b) => b.count - a.count);

    const operatingSystems = Object.entries(rawOS)
      .map(([name, count]) => {
        const c = Number(count) || 0;
        return {
          name,
          count: c,
          percentage: Number(((c / totalOSHits) * 100).toFixed(1)),
        };
      })
      .sort((a, b) => b.count - a.count);

    const referrers = Object.entries(rawReferrers)
      .map(([name, count]) => {
        const c = Number(count) || 0;
        return {
          name,
          count: c,
          percentage: Number(((c / totalReferrerHits) * 100).toFixed(1)),
        };
      })
      .sort((a, b) => b.count - a.count);

    const recentActivity = Array.isArray(rawSiteAnalytics?.recentEvents)
      ? rawSiteAnalytics.recentEvents
      : [];

    return NextResponse.json({
      summary: {
        totalPosts,
        totalViews,
        totalLikes,
        totalDislikes,
        avgViewsPerPost,
        overallSentiment,
      },
      posts,
      topPerformers,
      topLatest,
      decreasingNeedsAttention,
      promoAnalytics: {
        bannerActive: !!bannerConfig?.isActive,
        bannerMode: bannerConfig?.mode || "ab_test",
        totalImpressions: totalPromoImp,
        totalClicks: totalPromoClicks,
        totalDismissals: totalPromoDism,
        totalCtr: totalPromoCtr,
        totalDismissRate: totalPromoDismRate,
        winner: abWinner,
        variantA: {
          name: "Variant A (Visual Banner)",
          impressions: impA,
          clicks: clickA,
          dismissals: dismA,
          ctr: ctrA,
          dismissRate: dismRateA,
        },
        variantB: {
          name: "Variant B (Founder Text Card)",
          impressions: impB,
          clicks: clickB,
          dismissals: dismB,
          ctr: ctrB,
          dismissRate: dismRateB,
        },
        lastUpdated: promo.lastUpdated || new Date().toISOString(),
      },
      audienceTelemetry: {
        totalEvents: rawSiteAnalytics?.totalEvents || 0,
        googlePreferredSources: {
          totalClicks: rawSiteAnalytics?.preferredSourceClicks || 0,
          placements: safeParse(rawSiteAnalytics?.preferredSourcePlacementsJson),
        },
        countries,
        cities,
        devices,
        browsers,
        operatingSystems,
        referrers,
        recentActivity,
        lastUpdated: rawSiteAnalytics?.lastUpdated || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in analytics aggregation API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
