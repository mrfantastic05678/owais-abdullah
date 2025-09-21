"use client";

import { Post } from "@/types/post";
import { urlFor } from "@/sanity/lib/image";

interface JsonLdBlogProps {
  blog: Post;
  slug: string;
}

const JsonLdBlog: React.FC<JsonLdBlogProps> = ({ blog, slug }) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    image: urlFor(blog.mainImage).url(),
    author: {
      "@type": "Person",
      name: blog.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "Owais Abdullah",
      logo: {
        "@type": "ImageObject",
        url: "https://owaisabdullah.dev/assets/logo.png",
      },
    },
    datePublished: blog._createdAt,
    dateModified: blog._createdAt,
    description: blog.summary,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://owaisabdullah.dev/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default JsonLdBlog;
