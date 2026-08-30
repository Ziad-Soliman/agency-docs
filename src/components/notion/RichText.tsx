"use client";

import React from "react";
import Link from "next/link";
import { NotionRichText } from "@/lib/types";
import { cleanPageId, isRTL } from "@/lib/utils";
import katex from "katex";
import "katex/dist/katex.min.css";

const COLOR_CLASSES: Record<string, string> = {
  gray: "text-zinc-500 dark:text-zinc-400",
  brown: "text-amber-700 dark:text-amber-300",
  orange: "text-orange-600 dark:text-orange-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
  green: "text-emerald-600 dark:text-emerald-400",
  blue: "text-blue-600 dark:text-blue-400",
  purple: "text-purple-600 dark:text-purple-400",
  pink: "text-pink-600 dark:text-pink-400",
  red: "text-rose-600 dark:text-rose-400",
  gray_background: "bg-zinc-100 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-200",
  brown_background: "bg-amber-100/60 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-200",
  orange_background: "bg-orange-100/70 dark:bg-orange-950/40 px-1.5 py-0.5 rounded text-orange-900 dark:text-orange-200",
  yellow_background: "bg-yellow-100/70 dark:bg-yellow-950/40 px-1.5 py-0.5 rounded text-yellow-900 dark:text-yellow-200",
  green_background: "bg-emerald-100/60 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded text-emerald-900 dark:text-emerald-200",
  blue_background: "bg-blue-100/60 dark:bg-blue-950/40 px-1.5 py-0.5 rounded text-blue-900 dark:text-blue-200",
  purple_background: "bg-purple-100/60 dark:bg-purple-950/40 px-1.5 py-0.5 rounded text-purple-900 dark:text-purple-200",
  pink_background: "bg-pink-100/60 dark:bg-pink-950/40 px-1.5 py-0.5 rounded text-pink-900 dark:text-pink-200",
  red_background: "bg-rose-100/60 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-rose-900 dark:text-rose-200",
};

interface RichTextProps {
  richText?: NotionRichText[];
  className?: string;
}

export function RichText({ richText, className = "" }: RichTextProps) {
  if (!richText || !Array.isArray(richText) || richText.length === 0) {
    return null;
  }

  return (
    <span className={className}>
      {richText.map((item, index) => {
        const { annotations, text, mention, equation, plain_text, href } = item;

        let content: React.ReactNode = plain_text;

        // Inline Equation
        if (equation) {
          try {
            const html = katex.renderToString(equation.expression, {
              throwOnError: false,
              displayMode: false,
            });
            content = <span dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            content = <code>{equation.expression}</code>;
          }
        }

        // Mention (Page or User)
        if (mention?.type === "page" && mention.page?.id) {
          const targetId = cleanPageId(mention.page.id);
          content = (
            <Link
              href={`/p/${targetId}`}
              className="inline-flex items-center gap-1 font-medium text-indigo-600 dark:text-indigo-400 hover:underline px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/40 transition-colors text-[0.92em]"
            >
              <span className="opacity-70">📄</span>
              <span>{plain_text}</span>
            </Link>
          );
        }

        // Apply Annotations
        if (annotations) {
          if (annotations.bold) {
            content = <strong className="font-semibold text-zinc-900 dark:text-zinc-50">{content}</strong>;
          }
          if (annotations.italic) {
            content = <em className="italic">{content}</em>;
          }
          if (annotations.strikethrough) {
            content = <span className="line-through opacity-70">{content}</span>;
          }
          if (annotations.underline) {
            content = <span className="underline underline-offset-4">{content}</span>;
          }
          if (annotations.code) {
            content = (
              <code className="px-1.5 py-0.5 rounded-md font-mono text-[0.88em] bg-zinc-100 dark:bg-zinc-800/80 text-rose-600 dark:text-rose-400 border border-zinc-200/80 dark:border-zinc-700/60">
                {content}
              </code>
            );
          }
          if (annotations.color && annotations.color !== "default") {
            const colorClass = COLOR_CLASSES[annotations.color] || "";
            content = <span className={colorClass}>{content}</span>;
          }
        }

        // Links
        const linkUrl = href || text?.link?.url;
        if (linkUrl) {
          const isExternal = linkUrl.startsWith("http");
          if (isExternal) {
            content = (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-2 decoration-indigo-400/50 hover:decoration-indigo-600 transition-colors"
              >
                {content}
              </a>
            );
          } else {
            content = (
              <Link
                href={linkUrl}
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {content}
              </Link>
            );
          }
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </span>
  );
}
