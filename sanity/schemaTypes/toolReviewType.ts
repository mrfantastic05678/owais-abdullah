// schemas/toolReview.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'toolReview',
  title: 'Tool Review',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tool Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Stack Layer',
      type: 'string',
      options: {
        list: [
          { title: 'Agent Framework', value: 'agent-framework' },
          { title: 'MCP Server', value: 'mcp' },
          { title: 'Router / Gateway', value: 'router' },
          { title: 'Memory / Storage', value: 'memory' },
          { title: 'Infrastructure', value: 'infra' },
          { title: 'Dev Tool', value: 'dev-tool' },
          { title: 'Observability', value: 'observability' },
          { title: 'Auth / Security', value: 'auth' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'One-Line Description',
      type: 'string',
      description: 'What it does in one sentence.',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'myRating',
      title: 'My Rating',
      type: 'number',
      options: {
        list: [
          { title: '1 — Avoid', value: 1 },
          { title: '2 — Meh', value: 2 },
          { title: '3 — Solid', value: 3 },
          { title: '4 — Great', value: 4 },
          { title: '5 — Essential', value: 5 },
        ],
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'useCase',
      title: 'Why I Use It',
      type: 'text',
      rows: 3,
      description: 'Personal, specific. No marketing copy.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stackLayer',
      title: 'Where It Fits',
      type: 'string',
      description: 'e.g. "Router Layer", "Memory Layer", "Agent Orchestration"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientFit',
      title: 'When I Recommend It',
      type: 'text',
      rows: 2,
      description: 'Qualifies your leads.',
    }),
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
    defineField({
      name: 'docsUrl',
      title: 'Documentation URL',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'dateAdded',
      title: 'Date Added',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'projectsUsingIt',
      title: 'Projects Using This Tool',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. ["ShopMate", "Octively", "Digital FTE"]',
    }),
    defineField({
      name: 'body',
      title: 'Full Review',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'logo',
    },
  },
})
