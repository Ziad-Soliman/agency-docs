"use client";

import React, { useState, useMemo } from "react";
import { NotionPage } from "@/lib/types";
import { getPlainTextFromRichText, isRTL } from "@/lib/utils";
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Tag,
  DollarSign,
  Sparkles,
  Layers,
  CheckCircle2,
  Filter,
} from "lucide-react";

interface DatabaseViewProps {
  page: NotionPage;
}

export function DatabaseView({ page }: DatabaseViewProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const rows = page.databaseRows || [];
  const rtl = isRTL(page.title);

  // Extract helper for row properties
  const parsedRows = useMemo(() => {
    return rows.map((r) => {
      const props = r.properties || {};

      // Find title property (Service / Title / Name / الخدمة)
      let title = "Untitled Service";
      for (const k of Object.keys(props)) {
        if (props[k]?.type === "title") {
          title = getPlainTextFromRichText(props[k].title) || "Untitled Service";
          break;
        }
      }

      // Find Category (Category / الفئة)
      let category = "";
      let categoryColor = "blue";
      if (props["Category"]?.select?.name) {
        category = props["Category"].select.name;
        categoryColor = props["Category"].select.color || "blue";
      } else if (props["الفئة"]?.select?.name) {
        category = props["الفئة"].select.name;
        categoryColor = props["الفئة"].select.color || "blue";
      }

      // Find Description (Description / الوصف)
      let description = "";
      if (props["Description"]?.rich_text) {
        description = getPlainTextFromRichText(props["Description"].rich_text);
      } else if (props["الوصف"]?.rich_text) {
        description = getPlainTextFromRichText(props["الوصف"].rich_text);
      }

      // Find Starting Price (Starting Price / السعر يبدأ من)
      let price: number | null = null;
      if (props["Starting Price"]?.number !== undefined) {
        price = props["Starting Price"].number;
      } else if (props["السعر يبدأ من"]?.number !== undefined) {
        price = props["السعر يبدأ من"].number;
      }

      // Find Currency (Currency / العملة)
      let currency = "SAR";
      if (props["Currency"]?.select?.name) {
        currency = props["Currency"].select.name;
      } else if (props["العملة"]?.select?.name) {
        currency = props["العملة"].select.name;
      }

      // Find Pricing Type (Pricing Type / نوع التسعير)
      let pricingType = "";
      if (props["Pricing Type"]?.select?.name) {
        pricingType = props["Pricing Type"].select.name;
      } else if (props["نوع التسعير"]?.select?.name) {
        pricingType = props["نوع التسعير"].select.name;
      }

      // Monthly Fee (Monthly Fee / الرسوم الشهرية)
      let monthlyFee: number | null = null;
      if (props["Monthly Fee"]?.number !== undefined) {
        monthlyFee = props["Monthly Fee"].number;
      } else if (props["الرسوم الشهرية"]?.number !== undefined) {
        monthlyFee = props["الرسوم الشهرية"].number;
      }

      // Price Note (Price Note / ملاحظة السعر)
      let priceNote = "";
      if (props["Price Note"]?.rich_text) {
        priceNote = getPlainTextFromRichText(props["Price Note"].rich_text);
      } else if (props["ملاحظة السعر"]?.rich_text) {
        priceNote = getPlainTextFromRichText(props["ملاحظة السعر"].rich_text);
      }

      // Tags (Tags / الوسوم)
      let tags: Array<{ name: string; color: string }> = [];
      if (props["Tags"]?.multi_select) {
        tags = props["Tags"].multi_select;
      } else if (props["الوسوم"]?.multi_select) {
        tags = props["الوسوم"].multi_select;
      }

      // Featured (Featured / مميزة)
      let featured = Boolean(props["Featured"]?.checkbox || props["مميزة"]?.checkbox);

      return {
        id: r.id,
        title,
        category,
        categoryColor,
        description,
        price,
        currency,
        pricingType,
        monthlyFee,
        priceNote,
        tags,
        featured,
        rawProps: props,
      };
    });
  }, [rows]);

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    parsedRows.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }, [parsedRows]);

  // Filtered rows
  const filteredRows = useMemo(() => {
    return parsedRows.filter((r) => {
      const matchesCategory =
        selectedCategory === "all" || r.category === selectedCategory;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tags.some((t) => t.name.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [parsedRows, selectedCategory, query]);

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search + Category Pills + Grid/Table Toggle */}
      <div className="p-4 rounded-3xl bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={rtl ? "ابحث في الخدمات والتسعير والقدرات..." : "Search services, pricing, capabilities..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs md:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          {/* Grid vs Table Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 border border-zinc-200/40 dark:border-zinc-700/40 self-end sm:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/60 hover:bg-zinc-100"
              }`}
            >
              All ({parsedRows.length})
            </button>
            {categories.map((cat) => {
              const count = parsedRows.filter((r) => r.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white font-semibold shadow-sm"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/60 hover:bg-zinc-100"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRows.map((row) => (
            <div
              key={row.id}
              className="group relative rounded-3xl p-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Category + Featured */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {row.category ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                      {row.category}
                    </span>
                  ) : (
                    <span />
                  )}

                  {row.featured && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  {row.title}
                </h3>

                {/* Description */}
                {row.description && (
                  <p className="mt-2 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                    {row.description}
                  </p>
                )}

                {/* Tags */}
                {row.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {row.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Footer */}
              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <div>
                  {row.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
                        {row.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {row.currency}
                      </span>
                      {row.priceNote && (
                        <span className="text-[11px] text-zinc-400 ml-1">
                          ({row.priceNote})
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">Custom Quote</span>
                  )}

                  {row.monthlyFee !== null && (
                    <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                      + {row.monthlyFee.toLocaleString()} {row.currency}/month retainer
                    </div>
                  )}
                </div>

                {row.pricingType && (
                  <span className="px-2 py-1 rounded-lg text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {row.pricingType}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3.5">Service</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Price</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Description</th>
                  <th className="px-4 py-3.5">Tags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 text-xs">
                {filteredRows.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-850 transition-colors">
                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100 max-w-[200px] truncate">
                      {r.title}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {r.category ? (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {r.category}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                      {r.price !== null ? `${r.price.toLocaleString()} ${r.currency}` : "Custom"}
                      {r.monthlyFee ? <span className="block text-[10px] text-indigo-500 font-normal">+{r.monthlyFee} /mo</span> : null}
                    </td>
                    <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                      {r.pricingType || "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 max-w-[280px] truncate">
                      {r.description || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {r.tags.map((t, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
