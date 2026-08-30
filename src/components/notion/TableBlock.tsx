"use client";

import React from "react";
import { NotionBlock, NotionRichText } from "@/lib/types";
import { RichText } from "./RichText";
import { isRTL, getPlainTextFromRichText } from "@/lib/utils";

interface TableBlockProps {
  block: NotionBlock;
}

export function TableBlock({ block }: TableBlockProps) {
  const tableData = block.table;
  const rows = block.children || [];

  if (!tableData || rows.length === 0) {
    return null;
  }

  const hasColumnHeader = tableData.has_column_header;
  const hasRowHeader = tableData.has_row_header;

  const headerRow = hasColumnHeader ? rows[0] : null;
  const bodyRows = hasColumnHeader ? rows.slice(1) : rows;

  return (
    <div className="my-6 w-full overflow-hidden rounded-2xl ring-1 ring-zinc-200/80 dark:ring-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-1">
      <div className="overflow-x-auto rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          {hasColumnHeader && headerRow && (
            <thead className="bg-zinc-100/70 dark:bg-zinc-900/90 text-zinc-900 dark:text-zinc-100 border-b border-zinc-200/80 dark:border-zinc-800">
              <tr>
                {headerRow.table_row?.cells?.map((cell: NotionRichText[], cellIdx: number) => {
                  const cellText = getPlainTextFromRichText(cell);
                  const rtl = isRTL(cellText);
                  return (
                    <th
                      key={cellIdx}
                      dir={rtl ? "rtl" : "ltr"}
                      className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider text-zinc-600 dark:text-zinc-400 border-r border-zinc-200/40 dark:border-zinc-800/40 last:border-r-0"
                    >
                      <RichText richText={cell} />
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
            {bodyRows.map((row, rowIdx) => {
              const cells = row.table_row?.cells || [];
              return (
                <tr
                  key={row.id || rowIdx}
                  className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  {cells.map((cell: NotionRichText[], cellIdx: number) => {
                    const isHeaderCell = hasRowHeader && cellIdx === 0;
                    const cellText = getPlainTextFromRichText(cell);
                    const rtl = isRTL(cellText);

                    return (
                      <td
                        key={cellIdx}
                        dir={rtl ? "rtl" : "ltr"}
                        className={`px-4 py-3 text-zinc-700 dark:text-zinc-300 border-r border-zinc-200/30 dark:border-zinc-800/30 last:border-r-0 text-sm leading-relaxed ${
                          isHeaderCell
                            ? "font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50/40 dark:bg-zinc-900/30"
                            : ""
                        }`}
                      >
                        <RichText richText={cell} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
