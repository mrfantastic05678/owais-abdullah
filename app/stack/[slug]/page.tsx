// app/stack/[slug]/page.tsx
import { client } from '@/sanity/lib/client'
import { toolReviewBySlugQuery, allToolSlugsQuery } from '@/lib/sanity/queries'
import { ToolReview } from '@/types/stack'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for all tools
export async function generateStaticParams() {
  const slugs = await client.fetch(allToolSlugsQuery)
  return slugs.map((slug: string) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool: ToolReview = await client.fetch(toolReviewBySlugQuery, {
    slug,
  })

  if (!tool) return {}

  const title = `${tool.name} Review — Why I Use It in Production | Owais Abdullah`
  const description = tool.useCase.slice(0, 160)

  return {
    title,
    description,
    openGraph: {
      title: `${tool.name} — ${tool.stackLayer}`,
      description: tool.tagline,
      type: 'article',
      url: `https://owaisabdullah.dev/stack/${tool.slug.current}`,
      siteName: 'Owais Abdullah',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} — ${tool.stackLayer}`,
      description: tool.tagline,
    },
    alternates: {
      canonical: `https://owaisabdullah.dev/stack/${tool.slug.current}`,
    },
  }
}

export default async function ToolReviewPage({ params }: Props) {
  const { slug } = await params
  const tool: ToolReview = await client.fetch(toolReviewBySlugQuery, {
    slug,
  })

  if (!tool) return notFound()

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: `${tool.name} Review`,
    reviewBody: tool.useCase,
    author: {
      '@type': 'Person',
      name: 'Owais Abdullah',
      url: 'https://owaisabdullah.dev',
    },
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: tool.name,
      applicationCategory: tool.stackLayer,
      url: tool.websiteUrl,
      ...(tool.githubUrl && { codeRepository: tool.githubUrl }),
      ...(tool.docsUrl && { documentation: tool.docsUrl }),
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: tool.myRating,
      bestRating: 5,
      worstRating: 1,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Owais Abdullah',
      url: 'https://owaisabdullah.dev',
    },
  }

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://owaisabdullah.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'The Agent Stack',
        item: 'https://owaisabdullah.dev/stack',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `https://owaisabdullah.dev/stack/${tool.slug.current}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="max-w-3xl mx-auto px-6 py-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-neutral-500 mb-8" aria-label="Breadcrumb">
          <Link href="/stack" className="hover:text-white transition">
            The Agent Stack
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{tool.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-start gap-5 mb-6">
            {tool.logo?.asset?.url && (
              <Image
                src={tool.logo.asset.url}
                alt={`${tool.name} logo`}
                width={64}
                height={64}
                className="rounded-xl"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
              <p className="text-neutral-400">{tool.tagline}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300">
              {tool.stackLayer}
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300">
              Rating: {tool.myRating}/5
            </span>
            {tool.projectsUsingIt?.map((project) => (
              <span
                key={project}
                className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400"
              >
                {project}
              </span>
            ))}
          </div>
        </header>

        {/* Review Body */}
        <article className="space-y-10">
          {/* Why I Use It */}
          <section>
            <h2 className="text-lg font-semibold mb-3 text-neutral-200">
              Why I Use It
            </h2>
            <p className="text-neutral-400 leading-relaxed">{tool.useCase}</p>
          </section>

          {/* Client Fit */}
          {tool.clientFit && (
            <section className="p-6 rounded-xl border border-blue-500/20 bg-blue-500/5">
              <h2 className="text-lg font-semibold mb-3 text-blue-400">
                When I Recommend It to a Client
              </h2>
              <p className="text-neutral-400 leading-relaxed">{tool.clientFit}</p>
            </section>
          )}

          {/* Full Review */}
          {tool.body && tool.body.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 text-neutral-200">
                Full Review
              </h2>
              <div className="prose prose-invert prose-neutral max-w-none">
                <PortableText value={tool.body} />
              </div>
            </section>
          )}

          {/* Links */}
          <section className="flex flex-wrap gap-4">
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-neutral-200 transition"
            >
              Visit Website
            </a>
            {tool.githubUrl && (
              <a
                href={tool.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition"
              >
                GitHub
              </a>
            )}
            {tool.docsUrl && (
              <a
                href={tool.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-neutral-700 hover:border-neutral-500 transition"
              >
                Documentation
              </a>
            )}
          </section>
        </article>

        {/* Bottom CTA */}
        <section className="mt-16 pt-10 border-t border-neutral-800">
          <p className="text-neutral-500 mb-4">
            Need help integrating {tool.name} into your agent system?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition"
          >
            Let&apos;s Talk
          </Link>
        </section>

        {/* Additional SEO Content */}
        <section className="mt-16 pt-10 border-t border-neutral-800">
          <h2 className="text-lg font-semibold mb-4 text-neutral-200">
            Technical Details
          </h2>
          <dl className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Category</dt>
              <dd className="text-neutral-300">{tool.stackLayer}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Rating</dt>
              <dd className="text-neutral-300">{tool.myRating}/5</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Last Updated</dt>
              <dd className="text-neutral-300">
                {new Date(tool.dateAdded).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
            {tool.projectsUsingIt && tool.projectsUsingIt.length > 0 && (
              <div>
                <dt className="text-neutral-500">Used In</dt>
                <dd className="text-neutral-300">
                  {tool.projectsUsingIt.join(', ')}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </main>
    </>
  )
}
