import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { NextRequest, NextResponse } from "next/server";
import { parseTelemetry } from "@/lib/analytics-parser";
import { recordAnalyticsEvent } from "@/lib/analytics-recorder";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const DOC_ID = "promoAnalytics_octively";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, variant, path, placement } = body as {
      event: "impression" | "click" | "dismiss" | "google_preferred_click";
      variant?: "A" | "B";
      path?: string;
      placement?: string;
    };

    if (!event) {
      return NextResponse.json({ error: "Invalid event parameter" }, { status: 400 });
    }

    const telemetry = parseTelemetry(req, body);

    // Handle Google Preferred Sources clicks
    if (event === "google_preferred_click") {
      await recordAnalyticsEvent("google_preferred_click", path || "/google-preferred", telemetry, placement || "general");
      return NextResponse.json({
        success: true,
        event: "google_preferred_click",
        placement: placement || "general",
        telemetry: {
          country: telemetry.country,
          city: telemetry.city,
          device: telemetry.device,
        },
      });
    }

    if (!variant || !["impression", "click", "dismiss"].includes(event) || !["A", "B"].includes(variant)) {
      return NextResponse.json({ error: "Invalid event or variant parameter" }, { status: 400 });
    }

    const fieldMap = {
      impression: `variant${variant}_impressions`,
      click: `variant${variant}_clicks`,
      dismiss: `variant${variant}_dismissals`,
    };

    const targetField = fieldMap[event];

    // Ensure document exists
    await writeClient.createIfNotExists({
      _id: DOC_ID,
      _type: "promoAnalytics",
      identifier: "octively_promo",
      variantA_impressions: 0,
      variantA_clicks: 0,
      variantA_dismissals: 0,
      variantB_impressions: 0,
      variantB_clicks: 0,
      variantB_dismissals: 0,
      lastUpdated: new Date().toISOString(),
    });

    const eventName = `promo_${event}` as "promo_click" | "promo_impression" | "promo_dismiss";

    // Atomically increment metric & record telemetry
    const [updated] = await Promise.all([
      writeClient
        .patch(DOC_ID)
        .setIfMissing({
          variantA_impressions: 0,
          variantA_clicks: 0,
          variantA_dismissals: 0,
          variantB_impressions: 0,
          variantB_clicks: 0,
          variantB_dismissals: 0,
        })
        .inc({ [targetField]: 1 })
        .set({ lastUpdated: new Date().toISOString() })
        .commit(),
      recordAnalyticsEvent(eventName, path || `/variant-${variant}`, telemetry),
    ]);

    return NextResponse.json({
      success: true,
      event,
      variant,
      targetField,
      updatedAt: updated.lastUpdated,
      telemetry: {
        country: telemetry.country,
        city: telemetry.city,
        device: telemetry.device,
        browser: telemetry.browser,
      },
    });
  } catch (error) {
    console.error("Error logging promo tracking event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
