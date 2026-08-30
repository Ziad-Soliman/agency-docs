"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavNode } from "@/lib/types";
import { cleanPageId } from "@/lib/utils";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Search,
  ExternalLink,
  Filter,
} from "lucide-react";

interface SidebarProps {
  tree: NavNode[];
  onOpenSearch: () => void;
  className?: string;
}

const CATEGORIES = [
  { id: "all", label: "All Docs" },
  { id: "genesis", label: "Founding" },
  { id: "roadmap", label: "Roadmap" },
  { id: "catalog", label: "Catalog" },
];

export function Sidebar({ tree, onOpenSearch, className = "" }: SidebarProps) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    root: true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter tree nodes if a specific category is selected
  const filteredTree = useMemo(() => {
    if (selectedCategory === "all") return tree;

    return tree.map((root) => {
      const filteredChildren = root.children?.filter((child) => {
        const titleLower = child.title.toLowerCase();
        if (selectedCategory === "genesis") return titleLower.includes("genesis") || titleLower.includes("creative engine");
        if (selectedCategory === "roadmap") return titleLower.includes("roadmap") || titleLower.includes("خارطة");
        if (selectedCategory === "catalog") return titleLower.includes("catalog") || titleLower.includes("كتالوج");
        return true;
      });

      return {
        ...root,
        children: filteredChildren,
      };
    });
  }, [tree, selectedCategory]);

  const renderNavNode = (node: NavNode, depth = 0) => {
    const cleanId = cleanPageId(node.id);
    const isRoot = Boolean(node.isRoot);
    const href = isRoot ? "/" : `/p/${cleanId}`;
    const isActive = isRoot ? pathname === "/" : pathname === `/p/${cleanId}`;
    const isExpanded = expandedNodes[cleanId] ?? true;
    const hasChildren = node.children && node.children.length > 0;

    let iconElement = <FileText className="w-4 h-4 text-zinc-400 group-hover:text-indigo-500" />;
    if (node.icon) {
      if (node.icon.type === "emoji") {
        iconElement = <span className="text-sm select-none">{node.icon.emoji}</span>;
      }
    } else if (isRoot) {
      iconElement = <span className="text-sm select-none">🇪🇬</span>;
    }

    return (
      <div key={node.id} className="w-full">
        <div
          className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200 ${
            isActive
              ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-semibold border-l-2 border-indigo-600 shadow-sm"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
          style={{ paddingLeft: `${Math.max(10, depth * 16 + 10)}px` }}
        >
          <Link href={href} className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="flex-shrink-0">{iconElement}</span>
            <span className="truncate text-xs md:text-[0.88rem] leading-snug">
              {node.title}
            </span>
          </Link>

          {hasChildren && (
            <button
              onClick={(e) => toggleExpand(cleanId, e)}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors"
              aria-label="Toggle folder"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-0.5 space-y-0.5">
            {node.children!.map((child) => renderNavNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`w-72 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/70 backdrop-blur-xl ${className}`}
    >
      {/* Workspace Header */}
      <div className="p-4 border-b border-zinc-200/70 dark:border-zinc-800/70">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl">🇪🇬</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate flex items-center gap-1.5">
              <span>New Agency Egypt</span>
            </div>
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Realtime Notion Sync</span>
            </div>
          </div>
        </Link>

        {/* Search trigger button */}
        <button
          onClick={onOpenSearch}
          className="mt-3.5 w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-400 hover:border-indigo-500/50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500" />
            <span>Search docs...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-mono border border-zinc-200/60 dark:border-zinc-700/60">
            ⌘K
          </kbd>
        </button>

        {/* Category Pills */}
        <div className="mt-3 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                  : "bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
          <span>Knowledge Base & Pages</span>
          <span className="text-[9px] font-mono opacity-70">
            {filteredTree[0]?.children?.length || 0} pages
          </span>
        </div>
        {filteredTree.map((rootNode) => renderNavNode(rootNode))}
      </div>

      {/* Bottom Footer Section */}
      <div className="p-3 border-t border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-100/50 dark:bg-zinc-900/30">
        <a
          href="https://app.notion.com/p/New-Agency-Egypt-3ccf10a7857f8097b95feda711758b2f"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Open in Notion</span>
          </span>
          <ExternalLink className="w-3 h-3 text-zinc-400" />
        </a>
      </div>
    </aside>
  );
}
