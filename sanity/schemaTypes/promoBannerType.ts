import { SparklesIcon } from "@sanity/icons/Sparkles";
import { defineArrayMember, defineField, defineType } from "sanity";

export const promoBannerType = defineType({
  name: "promoBanner",
  title: "Blog Toast Banner (Octively)",
  type: "document",
  icon: SparklesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      initialValue: "Octively AI Promotional Toast",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Enable Toast Banner",
      description: "Toggle on to show the promotional toast on blog articles.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "mode",
      title: "Display Mode / A-B Testing",
      type: "string",
      options: {
        list: [
          { title: "A/B Test (50/50 Split between Variant A & B)", value: "ab_test" },
          { title: "Force Variant A (Visual Banner)", value: "variant_a" },
          { title: "Force Variant B (Founder Note / Text Card)", value: "variant_b" },
        ],
        layout: "radio",
      },
      initialValue: "ab_test",
    }),
    defineField({
      name: "scrollTriggerPercent",
      title: "Scroll Trigger Percentage (%)",
      description: "Show toast after user scrolls this percentage of the article (e.g. 30%)",
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
      title: "Variant A (Visual / Graphic Banner)",
      type: "object",
      fields: [
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
          initialValue: "Octively AI · SaaS",
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "string",
          initialValue: "Get a Free Custom AI Chatbot for Your Website",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
          rows: 3,
          initialValue: "Capture leads and support visitors 24/7 with branded AI chatbots. 1-line embed, zero coding required.",
        }),
        defineField({
          name: "featureTags",
          title: "Feature Tags",
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
          initialValue: "Claim Free AI Chatbot →",
        }),
        defineField({
          name: "ctaUrl",
          title: "Target URL",
          type: "url",
          initialValue: "https://octively.com",
        }),
      ],
    }),

    // Variant B Group
    defineField({
      name: "variantB",
      title: "Variant B (Founder Editorial / Text Card)",
      type: "object",
      fields: [
        defineField({
          name: "badgeText",
          title: "Badge Text",
          type: "string",
          initialValue: "Founder Recommendation",
        }),
        defineField({
          name: "founderName",
          title: "Founder Name",
          type: "string",
          initialValue: "Owais Abdullah",
        }),
        defineField({
          name: "founderTitle",
          title: "Founder Subtitle",
          type: "string",
          initialValue: "Creator of Octively",
        }),
        defineField({
          name: "founderAvatar",
          title: "Founder Avatar Image (Optional)",
          type: "image",
          options: { hotspot: true },
        }),
        defineField({
          name: "note",
          title: "Personal Message / Note",
          type: "text",
          rows: 3,
          initialValue: "I built Octively so agencies can add high-converting, branded AI chatbots to their client sites in minutes with dedicated client portals.",
        }),
        defineField({
          name: "bulletPoints",
          title: "Key Highlights / Bullet Points",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          initialValue: ["Free trial available", "Zero coding required", "Instant 1-line embed"],
        }),
        defineField({
          name: "ctaText",
          title: "CTA Button Text",
          type: "string",
          initialValue: "Claim Free AI Chatbot",
        }),
        defineField({
          name: "ctaUrl",
          title: "Target URL",
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
        title: title || "Blog Toast Banner",
        subtitle: `${isActive ? "Active (Live)" : "Disabled"} · Mode: ${mode || "A/B Test"}`,
      };
    },
  },
});
