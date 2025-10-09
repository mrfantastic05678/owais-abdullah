import { PortableTextComponents } from "@portabletext/react";
import { ReactNode } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export const CustomComponent: PortableTextComponents = {
  block: {
    h1: (props: { children?: ReactNode }) => {
      const extractText = (content: ReactNode | undefined): string => {
        if (Array.isArray(content) && content[0]) {
          if (typeof content[0] === "string") return content[0];
          if (typeof content[0] === "object" && "props" in content[0]) {
            return String(
              (content[0] as { props?: { children?: ReactNode } }).props
                ?.children || ""
            );
          }
        }
        return "";
      };
      const text = extractText(props.children);
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return (
        <h1
          id={id}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mt-6 mb-4 text-heading font-heading"
        >
          {props.children}
        </h1>
      );
    },
    h2: (props: { children?: ReactNode }) => {
      const extractText = (content: ReactNode | undefined): string => {
        if (Array.isArray(content) && content[0]) {
          if (typeof content[0] === "string") return content[0];
          if (typeof content[0] === "object" && "props" in content[0]) {
            return String(
              (content[0] as { props?: { children?: ReactNode } }).props
                ?.children || ""
            );
          }
        }
        return "";
      };
      const text = extractText(props.children);
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return (
        <h2
          id={id}
          className="text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-3 text-heading font-heading"
        >
          {props.children}
        </h2>
      );
    },
    h3: (props: { children?: ReactNode }) => {
      const extractText = (content: ReactNode | undefined): string => {
        if (Array.isArray(content) && content[0]) {
          if (typeof content[0] === "string") return content[0];
          if (typeof content[0] === "object" && "props" in content[0]) {
            return String(
              (content[0] as { props?: { children?: ReactNode } }).props
                ?.children || ""
            );
          }
        }
        return "";
      };
      const text = extractText(props.children);
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return (
        <h3
          id={id}
          className="text-lg sm:text-xl md:text-2xl font-semibold mt-8 mb-2 text-heading font-heading"
        >
          {props.children}
        </h3>
      );
    },
    h4: (props: { children?: ReactNode }) => {
      const extractText = (content: ReactNode | undefined): string => {
        if (Array.isArray(content) && content[0]) {
          if (typeof content[0] === "string") return content[0];
          if (typeof content[0] === "object" && "props" in content[0]) {
            return String(
              (content[0] as { props?: { children?: ReactNode } }).props
                ?.children || ""
            );
          }
        }
        return "";
      };
      const text = extractText(props.children);
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return (
        <h4
          id={id}
          className="text-base sm:text-lg md:text-xl font-medium mt-6 mb-1 text-heading font-heading"
        >
          {props.children}
        </h4>
      );
    },
    h5: (props: { children?: ReactNode }) => {
      const extractText = (content: ReactNode | undefined): string => {
        if (Array.isArray(content) && content[0]) {
          if (typeof content[0] === "string") return content[0];
          if (typeof content[0] === "object" && "props" in content[0]) {
            return String(
              (content[0] as { props?: { children?: ReactNode } }).props
                ?.children || ""
            );
          }
        }
        return "";
      };
      const text = extractText(props.children);
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return (
        <h5
          id={id}
          className="text-base sm:text-lg font-medium mt-5 mb-1 text-heading font-heading"
        >
          {props.children}
        </h5>
      );
    },
    h6: (props: { children?: ReactNode }) => {
      const extractText = (content: ReactNode | undefined): string => {
        if (Array.isArray(content) && content[0]) {
          if (typeof content[0] === "string") return content[0];
          if (typeof content[0] === "object" && "props" in content[0]) {
            return String(
              (content[0] as { props?: { children?: ReactNode } }).props
                ?.children || ""
            );
          }
        }
        return "";
      };
      const text = extractText(props.children);
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      return (
        <h6
          id={id}
          className="text-sm sm:text-base font-medium mt-4 mb-1 text-heading font-heading"
        >
          {props.children}
        </h6>
      );
    },
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="text-base lg:text-lg leading-7 mb-6">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <ul className="list-disc text-base ml-6 mb-8 space-y-2 text-text2 marker:text-primary">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal text-base ml-6 mb-8 space-y-2 text-text2 marker:text-primary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <li className="pl-2 leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <li className="pl-2 leading-relaxed">{children}</li>
    ),
  },
  marks: {
    bold: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-text2">{children}</strong>
    ),
    italic: ({ children }: { children?: ReactNode }) => (
      <em className="italic text-text2">{children}</em>
    ),
    underline: ({ children }: { children?: ReactNode }) => (
      <span className="underline text-text2">{children}</span>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children?: ReactNode;
    }) => {
      const href = value?.href || "";
      const isExternal =
        href.startsWith("http") && !href.includes("owaisabdullah.dev");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text2 underline hover:text-primary inline-flex items-center"
          >
            {children}
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        );
      }

      return (
        <Link href={href} className="text-text2 underline hover:text-primary">
          {children}
        </Link>
      );
    },
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-bold text-text2">{children}</strong>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic text-text2">{children}</em>
    ),
    code: ({ children }: { children?: ReactNode }) => (
      <code className="bg-gray-800 text-sm p-1 rounded-md text-gray-200 font-mono">
        {children}
      </code>
    ),
    "strike-through": ({ children }: { children?: ReactNode }) => (
      <span className="line-through text-text2">{children}</span>
    ),
    highlight: ({ children }: { children?: ReactNode }) => (
      <span className="bg-yellow-100 dark:bg-yellow-900 text-text2 px-1 rounded">
        {children}
      </span>
    ),
  },
  types: {
    image: ({
      value,
    }: {
      value: { asset?: { _ref?: string }; alt?: string };
    }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full aspect-[16/9] my-8">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Blog post image"}
            className="rounded-lg object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            priority={false}
          />
        </div>
      );
    },
  },
};
