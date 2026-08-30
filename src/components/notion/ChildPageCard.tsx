"use client";

import React from "react";
import Link from "next/link";
import { NotionBlock } from "@/lib/types";
import { cleanPageId } from "@/lib/utils";
import { ArrowRight, FileText } from "lucide-react";

interface ChildPageCardProps {
  block: NotionBlock;
}

export function ChildPageCard({ block }: ChildPageCardProps) {
  const data = block.child_page;
  if (!data) return null;

  const targetId = cleanPageId(block.id);
  const title = data.title || "Untitled Subpage";

  return (
    <Link
      href={`/p/${targetId}`}
      className="my-3 block group relative rounded-2xl ring-1 ring-zinc-200/90 dark:ring-zinc-800/90 bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900/80 dark:to-zinc-950/80 p-1 hover:ring-indigo-500/60 dark:hover:ring-indigo-400/60 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="p-4 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-sm md:text-[0.95rem] text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {title}
            </h4>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              Notion Document • Click to view
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-200 flex-shrink-0">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
