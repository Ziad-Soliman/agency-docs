"use client";

import React, { useState, useEffect, useMemo } from "react";
import { NotionBlock, NotionPage, NavNode, TableOfContentsItem } from "@/lib/types";
import { NotionBlockRenderer } from "@/components/notion/NotionBlockRenderer";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { TableOfContents } from "./TableOfContents";
import { SearchModal } from "@/components/search/SearchModal";
import {
  formatNotionDate,
  estimateReadingTime,
  getPlainTextFromRichText,
  slugify,
  isRTL,
  cleanPageId,
} from "@/lib/utils";
import {
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Share2,
  Check,
} from "lucide-react";
import Link from "next/link";

interface DocViewerProps {
  initialPage: NotionPage;
  initialBlocks: NotionBlock[];
  tree: NavNode[];
}

export function DocViewer({ initialPage, initialBlocks, tree }: DocViewerProps) {
  const [page, setPage] = useState<NotionPage>(initialPage);
  const [blocks, setBlocks] = useState<NotionBlock[]>(initialBlocks);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state when props change
  useEffect(() => {
    setPage(initialPage);
    setBlocks(initialBlocks);
  }, [initialPage, initialBlocks]);

  // Live Refresh handler
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/notion/page/${page.id}`);
      if (!res.ok) throw new Error("Failed to fetch page");
      const data = await res.json();
      if (data.page && data.blocks) {
        setPage(data.page);
        setBlocks(data.blocks);
      }
    } catch (e) {
      console.error("Failed to live refresh from Notion:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Optional periodic soft check every 30s to keep in sync if edited
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [page.id]);

  // Compute Table of Contents & Reading Time
  const { tocItems, totalWords, readingTime } = useMemo(() => {
    const items: TableOfContentsItem[] = [];
    let allText = page.title || "";

    blocks.forEach((block) => {
      const richText =
        block[block.type]?.rich_text ||
        block.heading_1?.rich_text ||
        block.heading_2?.rich_text ||
        block.heading_3?.rich_text ||
        block.paragraph?.rich_text ||
        block.callout?.rich_text;

      const plain = getPlainTextFromRichText(richText);
      allText += " " + plain;

      if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
        const text = plain.trim();
        if (text) {
          const level = block.type === "heading_1" ? 1 : block.type === "heading_2" ? 2 : 3;
          items.push({
            id: slugify(text) || block.id,
            text,
            level,
          });
        }
      }
    });

    const words = allText.trim().split(/\s+/).filter(Boolean).length;
    const time = estimateReadingTime(allText);

    return { tocItems: items, totalWords: words, readingTime: time };
  }, [blocks, page.title]);

  // Copy link
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Extract cover image
  const coverUrl =
    page.cover?.type === "external"
      ? page.cover.external?.url
      : page.cover?.file?.url;

  // Extract page icon
  let iconElement: React.ReactNode = null;
  if (page.icon) {
    if (page.icon.type === "emoji") {
      iconElement = <span className="text-4xl select-none leading-none">{page.icon.emoji}</span>;
    } else if (page.icon.type === "external" && page.icon.external?.url) {
      iconElement = <img src={page.icon.external.url} alt="icon" className="w-10 h-10 object-contain" />;
    } else if (page.icon.type === "file" && page.icon.file?.url) {
      iconElement = <img src={page.icon.file.url} alt="icon" className="w-10 h-10 object-contain" />;
    }
  }

  // Determine prev/next page in workspace tree
  const flatPages: Array<{ id: string; title: string }> = useMemo(() => {
    const list: Array<{ id: string; title: string }> = [];
    function collect(nodes: NavNode[]) {
      for (const n of nodes) {
        list.push({ id: cleanPageId(n.id), title: n.title });
        if (n.children) collect(n.children);
      }
    }
    collect(tree);
    return list;
  }, [tree]);

  const currentPageIndex = flatPages.findIndex((p) => p.id === cleanPageId(page.id));
  const prevPage = currentPageIndex > 0 ? flatPages[currentPageIndex - 1] : null;
  const nextPage =
    currentPageIndex >= 0 && currentPageIndex < flatPages.length - 1
      ? flatPages[currentPageIndex + 1]
      : null;

  const pageTitleRtl = isRTL(page.title);

  return (
    <div className="min-h-screen bg-white dark:bg-[#08080a] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        tree={tree}
        onOpenSearch={() => setSearchOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        currentPageTitle={page.title}
      />

      {/* Main Layout Area */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex">
        {/* Left Sidebar Navigation */}
        <Sidebar
          tree={tree}
          onOpenSearch={() => setSearchOpen(true)}
          className="hidden lg:flex"
        />

        {/* Center Content Canvas */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 md:px-12 py-8 lg:py-12 max-w-4xl mx-auto">
          {/* Optional Page Cover Image */}
          {coverUrl && (
            <div className="mb-8 w-full h-48 sm:h-64 rounded-3xl overflow-hidden ring-1 ring-zinc-200/80 dark:ring-zinc-800 shadow-md">
              <img
                src={coverUrl}
                alt="Page Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Page Icon & Title Header */}
          <div className="mb-8">
            {iconElement && <div className="mb-4">{iconElement}</div>}

            <h1
              dir={pageTitleRtl ? "rtl" : "ltr"}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.15]"
            >
              {page.title}
            </h1>

            {/* Metadata bar */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Updated {formatNotionDate(page.last_edited_time)}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>~{readingTime} min read ({totalWords} words)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>{blocks.length} Notion blocks</span>
              </div>

              {/* Action Buttons */}
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all text-xs"
                  title="Copy Page URL"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                {page.url && (
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-all text-xs"
                  >
                    <span>Notion</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Rendered Notion Blocks Container */}
          <article className="prose-container">
            <NotionBlockRenderer blocks={blocks} />
          </article>

          {/* Bottom Prev / Next Navigation */}
          <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevPage ? (
              <Link
                href={prevPage.id === flatPages[0]?.id ? "/" : `/p/${prevPage.id}`}
                className="w-full sm:w-auto group flex items-center gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/60 bg-zinc-50/50 dark:bg-zinc-900/40 transition-all flex-1"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Previous Page
                  </div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {prevPage.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextPage ? (
              <Link
                href={`/p/${nextPage.id}`}
                className="w-full sm:w-auto group flex items-center justify-end text-right gap-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/60 bg-zinc-50/50 dark:bg-zinc-900/40 transition-all flex-1"
              >
                <div className="min-w-0">
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Next Page
                  </div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {nextPage.title}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </main>

        {/* Right Sidebar: Table of Contents */}
        <TableOfContents
          items={tocItems}
          readingTime={readingTime}
          notionUrl={page.url}
        />
      </div>

      {/* Global Spotlight Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
