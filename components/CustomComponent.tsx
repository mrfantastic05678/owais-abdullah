import { PortableTextComponents } from "@portabletext/react";
import React, { ReactNode } from "react";
import Image from "next/image";
import BlogImageWithSkeleton from "@/components/BlogImageWithSkeleton";
import { urlFor } from "@/sanity/lib/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import EditorialCodeBlock from "@/components/EditorialCodeBlock";

/**
 * Recursively extracts plain text from any ReactNode (string, element, or array)
 * to build deterministic, stable anchor IDs for the Table of Contents and ScrollSpy.
 */
function extractPlainText(node: ReactNode): string {
  if (!node) return "";
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractPlainText).join("");
  }
  if (typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    if (props && props.children) {
      return extractPlainText(props.children);
    }
  }
  return "";
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Renders Portable Text spans (a table cell's content) with their marks:
 * strong/em/code/strike/underline/highlight + link annotations.
 */
function renderCellSpans(
  block: { children?: unknown[]; markDefs?: unknown[] } | undefined
): ReactNode {
  const children = (block?.children || []) as Array<{
    _type?: string;
    text?: string;
    marks?: string[];
  }>;
  const markDefs = (block?.markDefs || []) as Array<{
    _key: string;
    _type?: string;
    href?: string;
  }>;
  const defs: Record<string, { _type?: string; href?: string }> = {};
  for (const def of markDefs) defs[def._key] = def;

  return children
    .filter((span) => span._type === "span" && span.text)
    .map((span, i) => {
      let node: ReactNode = span.text;
      const marks = span.marks || [];
      let href = "";
      for (const mark of marks) {
        if (defs[mark]?._type === "link") href = defs[mark].href || "";
      }
      if (marks.includes("code"))
        node = (
          <code className="bg-secondary/70 border border-border/80 text-teal-600 dark:text-teal-300 px-1 py-0.5 rounded text-[0.85em] font-mono">
            {node}
          </code>
        );
      if (marks.includes("em")) node = <em>{node}</em>;
      if (marks.includes("strong")) node = <strong className="font-semibold text-foreground">{node}</strong>;
      if (marks.includes("strike-through")) node = <del className="line-through text-muted-foreground/60">{node}</del>;
      if (marks.includes("underline")) node = <u>{node}</u>;
      if (marks.includes("highlight"))
        node = (
          <mark className="bg-teal-500/15 text-teal-800 dark:text-teal-200 px-1 py-0.5 rounded">
            {node}
          </mark>
        );
      if (href)
        node = (
          <a
            href={href}
            target={href.startsWith("http") && !href.includes("owaisabdullah.dev") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 decoration-accent/40"
          >
            {node}
          </a>
        );
      return <span key={i}>{node}</span>;
    });
}

function renderTableCell(cell: {
  children?: Array<{ children?: unknown[]; markDefs?: unknown[] }>;
}): ReactNode {
  const blocks = cell.children || [];
  if (blocks.length === 0) return null;
  return blocks.map((block, i) => (
    <React.Fragment key={i}>{renderCellSpans(block)}</React.Fragment>
  ));
}

export const CustomComponent: PortableTextComponents = {
  block: {
    h1: (props: { children?: ReactNode }) => {
      const text = extractPlainText(props.children);
      const id = slugifyHeading(text);
      return (
        <h1
          id={id}
          className="text-2xl sm:text-3xl md:text-4xl font-bold mt-10 mb-5 text-foreground font-heading tracking-tight"
        >
          {props.children}
        </h1>
      );
    },
    h2: (props: { children?: ReactNode }) => {
      const text = extractPlainText(props.children);
      const id = slugifyHeading(text);
      return (
        <h2
          id={id}
          className="text-xl sm:text-2xl md:text-[1.95rem] font-semibold mt-12 mb-4 pt-6 border-t border-border/80 text-foreground font-heading tracking-tight first:mt-4 first:pt-0 first:border-t-0 scroll-mt-28"
        >
          {props.children}
        </h2>
      );
    },
    h3: (props: { children?: ReactNode }) => {
      const text = extractPlainText(props.children);
      const id = slugifyHeading(text);
      return (
        <h3
          id={id}
          className="text-lg sm:text-xl md:text-2xl font-semibold mt-9 mb-3 text-foreground font-heading tracking-tight scroll-mt-28"
        >
          {props.children}
        </h3>
      );
    },
    h4: (props: { children?: ReactNode }) => {
      const text = extractPlainText(props.children);
      const id = slugifyHeading(text);
      return (
        <h4
          id={id}
          className="text-base sm:text-lg font-semibold mt-7 mb-2 text-foreground font-heading tracking-tight scroll-mt-28"
        >
          {props.children}
        </h4>
      );
    },
    h5: (props: { children?: ReactNode }) => {
      const text = extractPlainText(props.children);
      const id = slugifyHeading(text);
      return (
        <h5
          id={id}
          className="text-sm sm:text-base font-semibold mt-6 mb-2 text-foreground font-heading tracking-tight scroll-mt-28"
        >
          {props.children}
        </h5>
      );
    },
    h6: (props: { children?: ReactNode }) => {
      const text = extractPlainText(props.children);
      const id = slugifyHeading(text);
      return (
        <h6
          id={id}
          className="text-xs sm:text-sm font-semibold mt-5 mb-1 text-foreground font-heading uppercase tracking-wider scroll-mt-28"
        >
          {props.children}
        </h6>
      );
    },
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="border-l-[3px] border-accent bg-secondary/40 px-5 sm:px-6 py-4 sm:py-5 rounded-r-xl my-8 text-foreground shadow-xs">
        <div className="font-heading italic text-lg sm:text-xl text-foreground/95 leading-relaxed">
          {children}
        </div>
      </blockquote>
    ),
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="text-base sm:text-[1.08rem] leading-[1.82] mb-6 text-muted-foreground/95 font-normal [&>strong]:text-foreground">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <ul className="list-disc pl-6 sm:pl-8 space-y-2.5 my-6 text-muted-foreground/95 text-base sm:text-[1.05rem] leading-relaxed marker:text-accent">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <ol className="list-decimal pl-6 sm:pl-8 space-y-2.5 my-6 text-muted-foreground/95 text-base sm:text-[1.05rem] leading-relaxed marker:text-accent font-medium">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <li className="pl-1.5 leading-relaxed text-muted-foreground/95 [&>strong]:text-foreground">{children}</li>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <li className="pl-1.5 leading-relaxed text-muted-foreground/95 [&>strong]:text-foreground">{children}</li>
    ),
  },
  marks: {
    bold: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    strong: ({ children }: { children?: ReactNode }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    italic: ({ children }: { children?: ReactNode }) => (
      <em className="italic text-foreground/90">{children}</em>
    ),
    em: ({ children }: { children?: ReactNode }) => (
      <em className="italic text-foreground/90">{children}</em>
    ),
    underline: ({ children }: { children?: ReactNode }) => (
      <span className="underline underline-offset-4 decoration-border-hover text-foreground">{children}</span>
    ),
    "strike-through": ({ children }: { children?: ReactNode }) => (
      <del className="line-through text-muted-foreground/60">{children}</del>
    ),
    code: ({ children }: { children?: ReactNode }) => (
      <code className="bg-secondary/70 border border-border/80 text-teal-600 dark:text-teal-300 px-1.5 py-0.5 rounded text-[0.88em] font-mono font-medium">
        {children}
      </code>
    ),
    highlight: ({ children }: { children?: ReactNode }) => (
      <mark className="bg-teal-500/15 text-teal-800 dark:text-teal-200 px-1.5 py-0.5 rounded font-medium border border-teal-500/25">
        {children}
      </mark>
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
            className="text-accent hover:text-accent-hover font-medium underline underline-offset-4 decoration-accent/40 hover:decoration-accent inline-flex items-center gap-1 transition-colors"
          >
            <span>{children}</span>
            <ExternalLink className="w-3.5 h-3.5 inline-block opacity-80" />
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="text-accent hover:text-accent-hover font-medium underline underline-offset-4 decoration-accent/40 hover:decoration-accent transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    code: ({
      value,
    }: {
      value?: { code?: string; language?: string; filename?: string };
    }) => {
      if (!value?.code) return null;
      return (
        <EditorialCodeBlock
          code={value.code}
          language={value.language}
          filename={value.filename}
        />
      );
    },
    image: ({
      value,
    }: {
      value: { asset?: { _ref?: string }; alt?: string; caption?: string };
    }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="my-8 rounded-xl sm:rounded-2xl overflow-hidden border border-border bg-card shadow-sm">
          <div className="relative w-full aspect-[16/9]">
            <BlogImageWithSkeleton
              src={urlFor(value).url()}
              alt={value.alt || "Article illustration"}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1380px) 90vw, 1200px"
              priority={false}
            />
          </div>
        </div>
      );
    },
    // GFM pipe table written by the content pipeline
    // ({_type: "table", rows: [{cells: [{children: [block...]}]}]});
    // row 0 renders as <thead>, the rest as <tbody>.
    table: ({
      value,
    }: {
      value?: {
        rows?: Array<{
          cells?: Array<{
            children?: Array<{ children?: unknown[]; markDefs?: unknown[] }>;
          }>;
        }>;
      };
    }) => {
      const rows = value?.rows || [];
      if (rows.length === 0) return null;
      const [header, ...body] = rows;
      return (
        <div className="my-8 overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
          <table className="w-full text-sm sm:text-[0.95rem] border-collapse">
            <thead>
              <tr className="bg-secondary/60">
                {(header.cells || []).map((cell, i) => (
                  <th
                    key={i}
                    className="border-b border-border px-4 py-3 text-left font-semibold text-foreground"
                  >
                    {renderTableCell(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={r} className="odd:bg-secondary/20">
                  {(row.cells || []).map((cell, i) => (
                    <td
                      key={i}
                      className="border-b border-border/60 px-4 py-3 align-top text-muted-foreground/95"
                    >
                      {renderTableCell(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};
