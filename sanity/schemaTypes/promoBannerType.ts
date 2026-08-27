import { SparklesIcon } from "@sanity/icons/Sparkles";
import { defineArrayMember, defineField, defineType } from "sanity";

export const promoBannerType = defineType({
  name: "promoBanner",
  title: "Promotional Toast Banner (Global / Multi-purpose)",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Internal Campaign Name",
      description: "Internal reference name for this promo banner in Sanity Studio",
      type: "string",
      initialValue: "Global Promotional Toast Banner",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "campaignName",
      title: "Campaign Tag / Identifier (for UTM Tracking)",
      description: "Identifier used as utm_campaign in analytics (e.g. octively_free, newsletter_growth, digital_fte_promo)",
      type: "string",
      initialValue: "octively_free",
    }),
    defineField({
      name: "isActive",
      title: "Enable Toast Banner",
      description: "Toggle on to show the promotional toast on the website.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "mode",
      title: "Display Mode / A-B Testing",
      description: "A/B test alternates between Variant A & B on page navigations. Force mode locks to one variant.",
      type: "string",
      options: {
        list: [
          { title: "A/B Test (Smart Alternating Rotation between Variant A & B)", value: "ab_test" },
          { title: "Force Variant A (Visual / Lead Magnet Banner)", value: "variant_a" },
          { title: "Force Variant B (Personal Note / Editorial Card)", value: "variant_b" },
        ],
        layout: "radio",
      },
      initialValue: "ab_test",
    }),
    defineField({
      name: "scrollTriggerPercent",
      title: "Scroll Trigger Percentage (%)",
      description: "Show toast after user scrolls this percentage of the page (e.g. 30%)",
      type: "number",
      initialValue: 30,
    }),
    defineField({
      name: "delaySeconds",
      title: "Time Delay Trigger (Seconds)",
      description: "Show toast after this many seconds if user has not scrolled yet (e.g. 6)",
      type: "number",
      initialValue: 6,
    }),
    defineField({
      name: "dismissalCooldown",
      title: "Dismissal Cooldown Period",
      description: "How long the toast stays hidden after a visitor clicks Close (X)",
      type: "string",
      options: {
        list: [
          { title: "Per Session (Shows again on next browser session)", value: "session" },
          { title: "3 Hours", value: "3_hours" },
          { title: "6 Hours", value: "6_hours" },
          { title: "12 Hours", value: "12_hours" },
          { title: "24 Hours (Default)", value: "24_hours" },
          { title: "3 Days", value: "3_days" },
          { title: "7 Days", value: "7_days" },
        ],
      },
      initialValue: "24_hours",
    }),
    defineField({
      name: "position",
      title: "Toast Position On Screen",
      description: "Choose where the promotional toast appears on the visitor's screen",
      type: "string",
      options: {
        list: [
          { title: "Bottom Right (Default)", value: "bottom-right" },
          { title: "Bottom Left", value: "bottom-left" },
          { title: "Bottom Center", value: "bottom-center" },
          { title: "Top Right", value: "top-right" },
          { title: "Top Left", value: "top-left" },
          { title: "Top Center", value: "top-center" },
          { title: "Middle Right", value: "middle-right" },
          { title: "Middle Left", value: "middle-left" },
          { title: "Middle Center", value: "middle-center" },
        ],
      },
      initialValue: "bottom-right",
    }),

    // Variant A Group
    defineField({
      name: "variantA",
      title: "Variant A (Visual / Lead Magnet Banner)",
      type: "object",
      fields: [
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
          initialValue: "For Agencies & Devs · Free",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          initialValue: "Ship Branded AI Chatbots to Clients in 2 Minutes",
        }),
        defineField({
          name: "description",
          title: "Description / Pitch",
          type: "text",
          rows: 3,
          initialValue: "1-line embed, white-label client portals, zero maintenance. Monetize AI chatbots for your clients today.",
        }),
        defineField({
          name: "featureTags",
          title: "Feature Tags (Optional)",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          initialValue: ["100% Free Plan", "Agency Portals", "1-Line Embed"],
        }),
        defineField({
          name: "bannerImage",
          title: "Banner Preview Image (Optional)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "ctaText",
          title: "CTA Button Text",
          type: "string",
          initialValue: "Claim Free AI Chatbot",
        }),
        defineField({
          name: "ctaUrl",
          title: "Target Destination URL",
          description: "UTM tracking parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term) are automatically appended dynamically.",
          type: "url",
          initialValue: "https://octively.com",
        }),
      ],
    }),

    // Variant B Group
    defineField({
      name: "variantB",
      title: "Variant B (Personal Note / Editorial Card)",
      type: "object",
      fields: [
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
          initialValue: "Founder Note · Free for Agencies",
        }),
        defineField({
          name: "founderName",
          title: "Author / Sender Name",
          type: "string",
          initialValue: "Owais Abdullah",
        }),
        defineField({
          name: "founderTitle",
          title: "Author Title / Subtitle",
          type: "string",
          initialValue: "Founder @ Octively",
        }),
        defineField({
          name: "founderAvatar",
          title: "Author Avatar Image (Optional)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          initialValue: "Monetize Custom AI Chatbots for Your Web Clients",
        }),
        defineField({
          name: "note",
          title: "Message / Pitch Note",
          type: "text",
          rows: 3,
          initialValue: "I built Octively so developers and agency owners can deploy custom trained AI chatbots to clients with zero backend code.",
        }),
        defineField({
          name: "ctaText",
          title: "CTA Button Text",
          type: "string",
          initialValue: "Claim Free AI Chatbot",
        }),
        defineField({
          name: "ctaUrl",
          title: "Target Destination URL",
          description: "UTM tracking parameters (utm_source, utm_medium, utm_campaign, utm_content, utm_term) are automatically appended dynamically.",
          type: "url",
          initialValue: "https://octively.com",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      isActive: "isActive",
      mode: "mode",
    },
    prepare({ title, isActive, mode }) {
      return {
        title: title || "Promotional Toast Banner",
        subtitle: `${isActive ? "Active (Live)" : "Disabled"} · Mode: ${mode || "A/B Test"}`,
      };
    },
  },
});
