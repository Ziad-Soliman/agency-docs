"use client";

import React from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { getPlainTextFromRichText, isRTL } from "@/lib/utils";

const CALLOUT_THEMES: Record<string, { outer: string; inner: string; border: string }> = {
  default: {
    outer: "bg-zinc-50/80 dark:bg-zinc-900/60 ring-1 ring-zinc-200/70 dark:ring-zinc-800/80",
    inner: "bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200",
    border: "border-zinc-200/60 dark:border-zinc-800/60",
  },
  gray_background: {
    outer: "bg-zinc-100/70 dark:bg-zinc-800/40 ring-1 ring-zinc-200 dark:ring-zinc-700/60",
    inner: "bg-white/80 dark:bg-zinc-800/70 text-zinc-900 dark:text-zinc-100",
    border: "border-zinc-200 dark:border-zinc-700",
  },
  blue_background: {
    outer: "bg-sky-50 dark:bg-sky-950/40 ring-1 ring-sky-200/80 dark:ring-sky-800/50",
    inner: "bg-sky-50/50 dark:bg-sky-950/70 text-sky-950 dark:text-sky-100",
    border: "border-sky-200 dark:border-sky-800",
  },
  green_background: {
    outer: "bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200/80 dark:ring-emerald-800/50",
    inner: "bg-emerald-50/50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  yellow_background: {
    outer: "bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200/80 dark:ring-amber-800/50",
    inner: "bg-amber-50/50 dark:bg-amber-950/70 text-amber-950 dark:text-amber-100",
    border: "border-amber-200 dark:border-amber-800",
  },
  orange_background: {
    outer: "bg-orange-50 dark:bg-orange-950/40 ring-1 ring-orange-200/80 dark:ring-orange-800/50",
    inner: "bg-orange-50/50 dark:bg-orange-950/70 text-orange-950 dark:text-orange-100",
    border: "border-orange-200 dark:border-orange-800",
  },
  purple_background: {
    outer: "bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-200/80 dark:ring-indigo-800/50",
    inner: "bg-indigo-50/50 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-100",
    border: "border-indigo-200 dark:border-indigo-800",
  },
  pink_background: {
    outer: "bg-pink-50 dark:bg-pink-950/40 ring-1 ring-pink-200/80 dark:ring-pink-800/50",
    inner: "bg-pink-50/50 dark:bg-pink-950/70 text-pink-950 dark:text-pink-100",
    border: "border-pink-200 dark:border-pink-800",
  },
  red_background: {
    outer: "bg-rose-50 dark:bg-rose-950/40 ring-1 ring-rose-200/80 dark:ring-rose-800/50",
    inner: "bg-rose-50/50 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100",
    border: "border-rose-200 dark:border-rose-800",
  },
};

interface CalloutBlockProps {
  block: NotionBlock;
  childrenRenderer?: (blocks: NotionBlock[]) => React.ReactNode;
}

export function CalloutBlock({ block, childrenRenderer }: CalloutBlockProps) {
  const data = block.callout;
  if (!data) return null;

  const color = data.color || "default";
  const theme = CALLOUT_THEMES[color] || CALLOUT_THEMES.default;
  const plainText = getPlainTextFromRichText(data.rich_text);
  const rtl = isRTL(plainText);

  // Extract icon
  let iconElement: React.ReactNode = "💡";
  if (data.icon) {
    if (data.icon.type === "emoji") {
      iconElement = <span className="text-xl select-none leading-none">{data.icon.emoji}</span>;
    } else if (data.icon.type === "external" && data.icon.external?.url) {
      iconElement = <img src={data.icon.external.url} alt="icon" className="w-5 h-5 object-contain" />;
    } else if (data.icon.type === "file" && data.icon.file?.url) {
      iconElement = <img src={data.icon.file.url} alt="icon" className="w-5 h-5 object-contain" />;
    }
  }

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`my-5 p-1 rounded-2xl ${theme.outer} transition-all duration-300 shadow-sm`}
    >
      <div className={`p-4 rounded-xl ${theme.inner} border ${theme.border} flex items-start gap-3.5`}>
        <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center">
          {iconElement}
        </div>
        <div className="flex-1 min-w-0 text-sm md:text-[0.95rem] leading-relaxed">
          <RichText richText={data.rich_text} />
          {block.children && block.children.length > 0 && childrenRenderer && (
            <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/10">
              {childrenRenderer(block.children)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
