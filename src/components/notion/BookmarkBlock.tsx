"use client";

import React from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { ExternalLink, Globe } from "lucide-react";

interface BookmarkBlockProps {
  block: NotionBlock;
}

export function BookmarkBlock({ block }: BookmarkBlockProps) {
  const data = block.bookmark;
  if (!data || !data.url) return null;

  let domain = "";
  try {
    domain = new URL(data.url).hostname;
  } catch {
    domain = data.url;
  }

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block group rounded-2xl ring-1 ring-zinc-200/80 dark:ring-zinc-800/80 bg-white dark:bg-zinc-900/60 hover:ring-indigo-500/50 dark:hover:ring-indigo-500/50 p-4 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {data.caption && data.caption.length > 0 ? (
                <RichText richText={data.caption} />
              ) : (
                domain
              )}
            </div>
            <div className="text-xs text-zinc-400 truncate mt-0.5">{data.url}</div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
}
