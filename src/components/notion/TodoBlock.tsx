"use client";

import React, { useState } from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { getPlainTextFromRichText, isRTL } from "@/lib/utils";
import { Check } from "lucide-react";

interface TodoBlockProps {
  block: NotionBlock;
  childrenRenderer?: (blocks: NotionBlock[]) => React.ReactNode;
}

export function TodoBlock({ block, childrenRenderer }: TodoBlockProps) {
  const data = block.to_do;
  if (!data) return null;

  const [checked, setChecked] = useState(Boolean(data.checked));
  const plainText = getPlainTextFromRichText(data.rich_text);
  const rtl = isRTL(plainText);

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="my-2 flex items-start gap-3 group">
      <button
        onClick={() => setChecked(!checked)}
        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
          checked
            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
            : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 group-hover:ring-2 group-hover:ring-indigo-500/20"
        }`}
        aria-label="Toggle to-do"
      >
        {checked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
      </button>

      <div
        className={`flex-1 text-[0.95rem] leading-relaxed transition-opacity duration-200 ${
          checked ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-200"
        }`}
      >
        <RichText richText={data.rich_text} />
        {block.children && block.children.length > 0 && childrenRenderer && (
          <div className="mt-2 pl-4 border-l-2 border-zinc-200 dark:border-zinc-800">
            {childrenRenderer(block.children)}
          </div>
        )}
      </div>
    </div>
  );
}
