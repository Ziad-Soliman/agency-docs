"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LiveSyncStatus } from "./LiveSyncStatus";
import { Search, Menu, X, ChevronRight, Home, ExternalLink } from "lucide-react";
import { NavNode } from "@/lib/types";
import { Sidebar } from "./Sidebar";

interface NavbarProps {
  tree: NavNode[];
  onOpenSearch: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  currentPageTitle?: string;
}

export function Navbar({
  tree,
  onOpenSearch,
  onRefresh,
  isRefreshing,
  currentPageTitle,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-colors">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger + Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 truncate">
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Agency Egypt</span>
              </Link>

              {currentPageTitle && (
                <>
                  <ChevronRight className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate">
                    {currentPageTitle}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right: Search shortcut + Live sync badge + Theme toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-400 hover:border-indigo-500/50 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Quick search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-[10px] font-mono">
                ⌘K
              </kbd>
            </button>

            <LiveSyncStatus onRefresh={onRefresh} isRefreshing={isRefreshing} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm animate-fade-in flex">
          <div className="w-80 max-w-[85vw] bg-white dark:bg-zinc-950 h-full flex flex-col shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
              <span className="font-semibold text-sm">Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar
                tree={tree}
                onOpenSearch={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="w-full border-r-0 h-auto static"
              />
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
