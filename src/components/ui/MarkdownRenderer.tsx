"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveStorageUrl } from "@/server/storage/resolve-url";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Render Markdown an toàn với:
 * - Image: resolve relative storage path → URL thực
 * - Link: external links mở tab mới
 * - Heading, paragraph, list, quote, code block
 *
 * Không dùng dangerouslySetInnerHTML. Không inject HTML nguy hiểm.
 */
export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`max-w-none text-[17px] leading-8 text-gray-700 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom image: resolve storage path
          img({ src, alt, ...props }) {
            const resolvedSrc = resolveStorageUrl(typeof src === "string" ? src : "");
            if (!resolvedSrc) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolvedSrc}
                alt={alt ?? ""}
                className="w-full rounded-xl my-6 object-cover shadow-sm"
                loading="lazy"
                {...props}
              />
            );
          },

          // Custom link: external opens new tab
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-gold hover:underline"
                {...props}
              >
                {children}
              </a>
            );
          },

          // Headings
          h1({ children }) {
            return <h1 className="mt-10 mb-4 font-heading text-3xl font-extrabold leading-tight text-navy">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mt-10 mb-4 border-b border-gray-border pb-2 font-heading text-2xl font-bold leading-tight text-navy">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mt-8 mb-3 font-heading text-xl font-semibold leading-tight text-navy">{children}</h3>;
          },
          p({ children }) {
            return <p className="my-5">{children}</p>;
          },
          ul({ children }) {
            return <ul className="my-5 list-disc space-y-2 pl-6">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="my-5 list-decimal space-y-2 pl-6">{children}</ol>;
          },

          // Blockquote
          blockquote({ children }) {
            return (
              <blockquote className="my-8 rounded-r-xl border-l-4 border-gold bg-gold/5 py-3 pl-5 text-gray-text italic">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="my-8 overflow-x-auto rounded-xl border border-gray-border">
                <table className="w-full min-w-[560px] border-collapse text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="border-b border-gray-border bg-gray-bg px-4 py-3 text-left font-semibold text-navy">{children}</th>;
          },
          td({ children }) {
            return <td className="border-b border-gray-border px-4 py-3 align-top text-gray-text">{children}</td>;
          },

          // Code block
          code({ className: codeClass, children, ...props }) {
            const isBlock = codeClass?.startsWith("language-");
            if (isBlock) {
              return (
                <pre className="bg-navy-dark text-white rounded-lg p-5 my-6 overflow-x-auto text-sm">
                  <code {...props}>{children}</code>
                </pre>
              );
            }
            return <code className="bg-gray-100 text-navy px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
