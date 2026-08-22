import { ActivityIcon } from "@sanity/icons/Activity";
import { defineField, defineType } from "sanity";

export const promoAnalyticsType = defineType({
  name: "promoAnalytics",
  title: "Promo Banner Analytics",
  type: "document",
  icon: ActivityIcon,
  fields: [
    defineField({
      name: "identifier",
      title: "Campaign Identifier",
      type: "string",
      initialValue: "octively_promo",
      readOnly: true,
    }),
    defineField({
      name: "variantA_impressions",
      title: "Variant A (Visual Banner) - Impressions",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "variantA_clicks",
      title: "Variant A (Visual Banner) - Clicks",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "variantA_dismissals",
      title: "Variant A (Visual Banner) - Dismissals",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "variantB_impressions",
      title: "Variant B (Text Banner) - Impressions",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "variantB_clicks",
      title: "Variant B (Text Banner) - Clicks",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "variantB_dismissals",
      title: "Variant B (Text Banner) - Dismissals",
      type: "number",
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "identifier",
    },
    prepare() {
      return {
        title: "Octively Promo A/B Metrics",
        subtitle: "A/B Testing & Banner Engagement",
      };
    },
  },
});
