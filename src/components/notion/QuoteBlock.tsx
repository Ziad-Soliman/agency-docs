"use client";

import React from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { getPlainTextFromRichText, isRTL } from "@/lib/utils";
import { Quote } from "lucide-react";

interface QuoteBlockProps {
  block: NotionBlock;
  childrenRenderer?: (blocks: NotionBlock[]) => React.ReactNode;
}

export function QuoteBlock({ block, childrenRenderer }: QuoteBlockProps) {
  const data = block.quote;
  if (!data) return null;

  const plainText = getPlainTextFromRichText(data.rich_text);
  const rtl = isRTL(plainText);

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className="my-5 relative pl-6 pr-4 py-3 rounded-r-xl border-l-4 border-indigo-500 bg-gradient-to-r from-indigo-50/40 via-transparent to-transparent dark:from-indigo-950/20 dark:via-transparent dark:to-transparent"
    >
      <Quote className="w-5 h-5 text-indigo-400/60 mb-1 opacity-60" />
      <div className="text-base md:text-lg font-normal italic text-zinc-800 dark:text-zinc-200 leading-relaxed">
        <RichText richText={data.rich_text} />
      </div>
      {block.children && block.children.length > 0 && childrenRenderer && (
        <div className="mt-3 pl-2 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-2 text-sm not-italic">
          {childrenRenderer(block.children)}
        </div>
      )}
    </div>
  );
}
