"use client";

import React from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { getPlainTextFromRichText, slugify, isRTL } from "@/lib/utils";
import { Hash } from "lucide-react";

interface HeadingBlockProps {
  block: NotionBlock;
}

export function HeadingBlock({ block }: HeadingBlockProps) {
  const type = block.type as "heading_1" | "heading_2" | "heading_3";
  const data = block[type];
  if (!data) return null;

  const plainText = getPlainTextFromRichText(data.rich_text);
  const slug = slugify(plainText) || block.id;
  const rtl = isRTL(plainText);

  if (type === "heading_1") {
    return (
      <h1
        id={slug}
        dir={rtl ? "rtl" : "ltr"}
        className="group relative scroll-mt-24 text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-12 mb-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between"
      >
        <span>
          <RichText richText={data.rich_text} />
        </span>
        <a
          href={`#${slug}`}
          aria-label="Direct link to heading"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm ml-2"
        >
          <Hash className="w-5 h-5 inline" />
        </a>
      </h1>
    );
  }

  if (type === "heading_2") {
    return (
      <h2
        id={slug}
        dir={rtl ? "rtl" : "ltr"}
        className="group relative scroll-mt-24 text-2xl md:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-10 mb-3 flex items-center justify-between"
      >
        <span>
          <RichText richText={data.rich_text} />
        </span>
        <a
          href={`#${slug}`}
          aria-label="Direct link to heading"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm ml-2"
        >
          <Hash className="w-4 h-4 inline" />
        </a>
      </h2>
    );
  }

  return (
    <h3
      id={slug}
      dir={rtl ? "rtl" : "ltr"}
      className="group relative scroll-mt-24 text-lg md:text-xl font-medium tracking-tight text-zinc-800 dark:text-zinc-200 mt-8 mb-2 flex items-center justify-between"
    >
      <span>
        <RichText richText={data.rich_text} />
      </span>
      <a
        href={`#${slug}`}
        aria-label="Direct link to heading"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs ml-2"
      >
        <Hash className="w-3.5 h-3.5 inline" />
      </a>
    </h3>
  );
}
