import BlogPageClient from "./BlogPageClient";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Metadata } from "next";
import { Post } from "@/types/post";

export const revalidate = 60;

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

  return {
    title: blog.title,
    description: blog.summary,
    authors: [{ name: blog.author.name }],
    openGraph: {
      title: `${blog.title} | Owais Abdullah`,
      description: blog.summary,
      url: `https://owaisabdullah.dev/blog/${slug}`,
      images: [
        {
          url: urlFor(blog.mainImage).url() as string,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Owais Abdullah`,
      description: blog.summary,
      images: [urlFor(blog.mainImage).url() as string],
    },
    alternates: {
      canonical: `/blog/${slug}`,
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
    content,
    faqs,
    _createdAt,
    author->{name},
    categories[]->{title}
  }[0]`;

  const blog: Post = await client.fetch(query);

  return <BlogPageClient blog={blog} slug={slug} />;
}
