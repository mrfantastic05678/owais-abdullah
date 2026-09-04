import { ActivityIcon } from "@sanity/icons/Activity";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteAnalyticsType = defineType({
  name: "siteAnalytics",
  title: "Site & Audience Analytics",
  type: "document",
  icon: ActivityIcon,
  fields: [
    defineField({
      name: "identifier",
      title: "Identifier",
      type: "string",
      initialValue: "global_telemetry",
      readOnly: true,
    }),
    defineField({
      name: "totalEvents",
      title: "Total Tracked Events",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "preferredSourceClicks",
      title: "Google Preferred Source Total Clicks",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "preferredSourcePlacementsJson",
      title: "Google Preferred Source Placements (JSON)",
      type: "text",
      rows: 3,
      initialValue: "{}",
    }),
    defineField({
      name: "topCountriesJson",
      title: "Top Countries Data (JSON)",
      type: "text",
      rows: 4,
      initialValue: "{}",
    }),
    defineField({
      name: "topCitiesJson",
      title: "Top Cities Data (JSON)",
      type: "text",
      rows: 4,
      initialValue: "{}",
    }),
    defineField({
      name: "devicesJson",
      title: "Devices Breakdown (JSON)",
      type: "text",
      rows: 3,
      initialValue: '{"Desktop":0,"Mobile":0,"Tablet":0}',
    }),
    defineField({
      name: "browsersJson",
      title: "Browsers Breakdown (JSON)",
      type: "text",
      rows: 3,
      initialValue: "{}",
    }),
    defineField({
      name: "operatingSystemsJson",
      title: "Operating Systems Breakdown (JSON)",
      type: "text",
      rows: 3,
      initialValue: "{}",
    }),
    defineField({
      name: "referrersJson",
      title: "Referrers Breakdown (JSON)",
      type: "text",
      rows: 4,
      initialValue: "{}",
    }),
    defineField({
      name: "recentEvents",
      title: "Recent Live Activity Feed (50 Items)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "eventType", type: "string" }),
            defineField({ name: "path", type: "string" }),
            defineField({ name: "country", type: "string" }),
            defineField({ name: "countryCode", type: "string" }),
            defineField({ name: "city", type: "string" }),
            defineField({ name: "device", type: "string" }),
            defineField({ name: "browser", type: "string" }),
            defineField({ name: "os", type: "string" }),
            defineField({ name: "referrerDomain", type: "string" }),
            defineField({ name: "timestamp", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
});
