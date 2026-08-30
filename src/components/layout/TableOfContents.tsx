"use client";

import React, { useEffect, useState } from "react";
import { TableOfContentsItem } from "@/lib/types";
import { List, Clock, ExternalLink } from "lucide-react";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  readingTime?: number;
  notionUrl?: string;
}

export function TableOfContents({ items, readingTime, notionUrl }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-80px 0% -60% 0%",
        threshold: 0.1,
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pl-6 pr-2 py-4">
      {/* Quick metadata */}
      <div className="mb-6 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
        {readingTime && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>~{readingTime} min read</span>
          </div>
        )}

        {notionUrl && (
          <a
            href={notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
          >
            <span>Open in Notion</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Heading List */}
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
        <List className="w-3.5 h-3.5 text-indigo-500" />
        <span>On this page</span>
      </div>

      <nav className="space-y-1 text-xs">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const paddingLeft =
            item.level === 1 ? "pl-2" : item.level === 2 ? "pl-4" : "pl-6";

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block py-1.5 rounded-md transition-all duration-200 truncate ${paddingLeft} ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/60 dark:bg-indigo-950/30 border-l-2 border-indigo-600"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30"
              }`}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
