"use client";

import React, { useState } from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { getPlainTextFromRichText, isRTL } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ToggleBlockProps {
  block: NotionBlock;
  childrenRenderer?: (blocks: NotionBlock[]) => React.ReactNode;
}

export function ToggleBlock({ block, childrenRenderer }: ToggleBlockProps) {
  const data = block.toggle;
  if (!data) return null;

  const [isOpen, setIsOpen] = useState(false);
  const plainText = getPlainTextFromRichText(data.rich_text);
  const rtl = isRTL(plainText);

  return (
    <div className="my-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        dir={rtl ? "rtl" : "ltr"}
        className="w-full px-4 py-3 flex items-center gap-3 text-left font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <ChevronRight
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-90 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
        <span className="flex-1 text-[0.95rem]">
          <RichText richText={data.rich_text} />
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300">
          {block.children && block.children.length > 0 && childrenRenderer ? (
            childrenRenderer(block.children)
          ) : (
            <p className="text-xs text-zinc-400 italic">No additional content</p>
          )}
        </div>
      )}
    </div>
  );
}
