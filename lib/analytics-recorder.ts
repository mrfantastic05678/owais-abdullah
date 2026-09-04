import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { TelemetryData } from "./analytics-parser";

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const SITE_ANALYTICS_ID = "siteAnalytics_global";

export interface LoggedEvent {
  _key: string;
  eventType: string;
  path: string;
  country: string;
  countryCode: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  referrerDomain: string;
  timestamp: string;
}

export async function recordAnalyticsEvent(
  eventType: "page_view" | "promo_click" | "promo_impression" | "promo_dismiss" | "google_preferred_click",
  path: string,
  telemetry: TelemetryData,
  placement?: string
): Promise<void> {
  try {
    // 1. Ensure global analytics document exists
    await writeClient.createIfNotExists({
      _id: SITE_ANALYTICS_ID,
      _type: "siteAnalytics",
      identifier: "global_telemetry",
      totalEvents: 0,
      preferredSourceClicks: 0,
      preferredSourcePlacementsJson: "{}",
      topCountriesJson: "{}",
      topCitiesJson: "{}",
      devicesJson: '{"Desktop":0,"Mobile":0,"Tablet":0}',
      browsersJson: "{}",
      operatingSystemsJson: "{}",
      referrersJson: "{}",
      recentEvents: [],
      lastUpdated: new Date().toISOString(),
    });

    // 2. Fetch current counts
    const current = await writeClient.fetch(
      `*[_type == "siteAnalytics" && _id == $id][0]{
        preferredSourceClicks,
        preferredSourcePlacementsJson,
        topCountriesJson,
        topCitiesJson,
        devicesJson,
        browsersJson,
        operatingSystemsJson,
        referrersJson,
        recentEvents
      }`,
      { id: SITE_ANALYTICS_ID }
    );

    const safeParse = (str?: string) => {
      try {
        return str ? JSON.parse(str) : {};
      } catch {
        return {};
      }
    };

    const countries = safeParse(current?.topCountriesJson);
    const cities = safeParse(current?.topCitiesJson);
    const devices = safeParse(current?.devicesJson);
    const browsers = safeParse(current?.browsersJson);
    const operatingSystems = safeParse(current?.operatingSystemsJson);
    const referrers = safeParse(current?.referrersJson);
    const placements = safeParse(current?.preferredSourcePlacementsJson);

    // Increment keys
    const cCode = telemetry.countryCode || "US";
    countries[cCode] = (countries[cCode] || 0) + 1;

    const cityKey = telemetry.city && telemetry.city !== "UNKNOWN" ? telemetry.city : "Direct Visitor";
    cities[cityKey] = (cities[cityKey] || 0) + 1;

    devices[telemetry.device] = (devices[telemetry.device] || 0) + 1;
    browsers[telemetry.browser] = (browsers[telemetry.browser] || 0) + 1;
    operatingSystems[telemetry.os] = (operatingSystems[telemetry.os] || 0) + 1;
    referrers[telemetry.referrerDomain] = (referrers[telemetry.referrerDomain] || 0) + 1;

    if (eventType === "google_preferred_click" && placement) {
      placements[placement] = (placements[placement] || 0) + 1;
    }

    // Create event object
    const newEvent: LoggedEvent = {
      _key: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventType,
      path: path || "/",
      country: telemetry.country,
      countryCode: telemetry.countryCode,
      city: telemetry.city,
      device: telemetry.device,
      browser: telemetry.browser,
      os: telemetry.os,
      referrerDomain: telemetry.referrerDomain,
      timestamp: telemetry.timestamp,
    };

    const existingEvents: LoggedEvent[] = Array.isArray(current?.recentEvents) ? current.recentEvents : [];
    const updatedEvents = [newEvent, ...existingEvents].slice(0, 40);

    const incFields: Record<string, number> = { totalEvents: 1 };
    if (eventType === "google_preferred_click") {
      incFields.preferredSourceClicks = 1;
    }

    // Patch to Sanity
    await writeClient
      .patch(SITE_ANALYTICS_ID)
      .set({
        topCountriesJson: JSON.stringify(countries),
        topCitiesJson: JSON.stringify(cities),
        devicesJson: JSON.stringify(devices),
        browsersJson: JSON.stringify(browsers),
        operatingSystemsJson: JSON.stringify(operatingSystems),
        referrersJson: JSON.stringify(referrers),
        preferredSourcePlacementsJson: JSON.stringify(placements),
        recentEvents: updatedEvents,
        lastUpdated: new Date().toISOString(),
      })
      .inc(incFields)
      .commit();
  } catch (err) {
    console.error("Error recording analytics event:", err);
  }
}
