import BlogPageClient from "./BlogPageClient";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { Post } from "@/types/post";

export const revalidate = 86400; // 24 hours ISR (on-demand revalidated on publish)

export const dynamicParams = true;

export async function generateStaticParams() {
  const query = `*[_type == "post"]{
    "slug":slug.current
  }`;

  const slugs = await client.fetch(query);
  const slugRoutes: string[] = slugs.map((slug: { slug: string }) => slug.slug);
  return slugRoutes.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const query = `*[_type == "post" && slug.current == "${slug}"]{
    title,
    summary,
    seoTitle,
    seoDescription,
    focusKeyword,
    tldr,
    mainImage,
    author->{name}
  }[0]`;

  const blog = await client.fetch(query);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  // Fallback chain (mirrors the engine's derivation): a post written before
  // these fields existed, or one whose SEO fields were never filled in, keeps
  const metaTitle = blog.seoTitle || blog.title;
  const metaDescription = blog.seoDescription || blog.summary;

  const hasMainImage = Boolean(blog.mainImage?.asset);
  const ogImageUrl = hasMainImage
    ? (urlFor(blog.mainImage).width(1200).height(630).url() as string)
    : "https://owaisabdullah.dev/assets/owais-abdullah-og.png";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: blog.focusKeyword ? [blog.focusKeyword] : undefined,
    authors: [{ name: blog.author?.name || "Owais Abdullah" }],
    openGraph: {
      title: `${metaTitle} | Owais Abdullah`,
      description: metaDescription,
      url: `https://owaisabdullah.dev/blog/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: blog.mainImage?.alt || blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${metaTitle} | Owais Abdullah`,
      description: metaDescription,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `/blog/${slug}`,
      types: {
        "text/markdown": `/blog/${slug}/raw`,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = `*[_type == "post" && slug.current == "${slug}"]{
    title,
    mainImage,
    summary,
    seoTitle,
    seoDescription,
    focusKeyword,
    tldr,
    content,
    faqs,
    _createdAt,
    author->{name, image, "bio": pt::text(bio)},
    categories[]->{title}
  }[0]`;

  const blog: Post = await client.fetch(query);

  const recentQuery = `*[_type == "post" && slug.current != $slug] | order(_createdAt desc)[0...4]{
    _id,
    title,
    slug,
    mainImage,
    _createdAt
  }`;

  const recentPosts = await client.fetch(recentQuery, { slug });

  return <BlogPageClient blog={blog} slug={slug} recentPosts={recentPosts} />;
}
