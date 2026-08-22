import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { NextRequest, NextResponse } from "next/server";

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
    const { event, variant } = body as {
      event: "impression" | "click" | "dismiss";
      variant: "A" | "B";
    };

    if (!event || !variant || !["impression", "click", "dismiss"].includes(event) || !["A", "B"].includes(variant)) {
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

    // Atomically increment metric
    const updated = await writeClient
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
      .commit();

    return NextResponse.json({
      success: true,
      event,
      variant,
      targetField,
      updatedAt: updated.lastUpdated,
    });
  } catch (error) {
    console.error("Error logging promo tracking event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
