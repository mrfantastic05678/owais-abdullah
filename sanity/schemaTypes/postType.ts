import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: { type: "category" } })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "summary",
      type: "text",
      validation: (Rule) =>
        Rule.required().max(300).warning("Short summaries are usually better"),
    }),
    // --- SEO + AEO fields ---
    // Separate from `title`/`summary` so search, social and answer engines can
    // read them without re-deriving. The site falls back when they are empty:
    // seoTitle -> title, seoDescription -> summary (see
    // app/blog/[slug]/page.tsx generateMetadata).
    // Limits are the Yoast/Rank Math "green" thresholds and are warnings only
    // -- never hard errors, so they can't block a publish the way a missing
    // mainImage does.
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description:
        "Search/social title. 60 characters or fewer. Falls back to the post title when empty.",
      validation: (Rule) =>
        Rule.max(60).warning("Keep SEO titles at 60 characters or fewer"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description:
        "Meta description for search results. 160 characters or fewer. Falls back to Summary when empty.",
      validation: (Rule) =>
        Rule.max(160).warning(
          "Meta descriptions are truncated at roughly 160 characters"
        ),
    }),
    defineField({
      name: "focusKeyword",
      title: "Focus Keyword",
      type: "string",
      description:
        "The primary keyword this post targets (the Yoast/Rank Math focus-keyphrase equivalent).",
    }),
    defineField({
      name: "tldr",
      title: "TL;DR",
      type: "text",
      rows: 4,
      description:
        "40-60 word direct answer to the primary keyword question. Also mirrored at the top of the content as the TL;DR blockquote.",
      validation: (Rule) =>
        Rule.max(600).warning("A TL;DR is 40-60 words (~300 characters)"),
    }),
    defineField({
      name: "content",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "question",
              type: "string",
              title: "Question",
            },
            {
              name: "answer",
              type: "text",
              title: "Answer",
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
