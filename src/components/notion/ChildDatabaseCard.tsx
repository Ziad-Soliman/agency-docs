"use client";

import React from "react";
import Link from "next/link";
import { NotionBlock } from "@/lib/types";
import { cleanPageId } from "@/lib/utils";
import { ArrowRight, Database, Sparkles, Layers } from "lucide-react";

interface ChildDatabaseCardProps {
  block: NotionBlock;
}

export function ChildDatabaseCard({ block }: ChildDatabaseCardProps) {
  const data = block.child_database;
  if (!data) return null;

  const targetId = cleanPageId(block.id);
  const title = data.title || "Services Catalog Database";

  return (
    <Link
      href={`/p/${targetId}`}
      className="my-4 block group relative rounded-3xl ring-1 ring-indigo-500/30 dark:ring-indigo-500/20 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/40 dark:via-zinc-900/60 dark:to-purple-950/30 p-1.5 hover:ring-indigo-500/70 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
    >
      <div className="p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-indigo-100/80 dark:border-indigo-900/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
            <Database className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Notion Database
              </span>
            </div>
            <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-1">
              {title}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Interactive Services & Rate Catalog • Click to explore full database
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-200 flex-shrink-0 shadow-sm">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
