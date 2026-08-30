"use client";

import React from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { getPlainTextFromRichText, isRTL } from "@/lib/utils";

interface ListBlockProps {
  blocks: NotionBlock[];
  ordered?: boolean;
  childrenRenderer?: (blocks: NotionBlock[]) => React.ReactNode;
}

export function ListGroup({ blocks, ordered = false, childrenRenderer }: ListBlockProps) {
  if (!blocks || blocks.length === 0) return null;

  if (ordered) {
    return (
      <ol className="my-3 space-y-2 list-decimal list-outside pl-6 text-zinc-700 dark:text-zinc-300 text-[0.95rem] leading-relaxed">
        {blocks.map((block) => {
          const data = block.numbered_list_item;
          if (!data) return null;
          const plainText = getPlainTextFromRichText(data.rich_text);
          const rtl = isRTL(plainText);
          return (
            <li key={block.id} dir={rtl ? "rtl" : "ltr"} className="pl-1">
              <RichText richText={data.rich_text} />
              {block.children && block.children.length > 0 && childrenRenderer && (
                <div className="mt-2 pl-4">
                  {childrenRenderer(block.children)}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ul className="my-3 space-y-2 list-disc list-outside pl-6 text-zinc-700 dark:text-zinc-300 text-[0.95rem] leading-relaxed marker:text-indigo-500 dark:marker:text-indigo-400">
      {blocks.map((block) => {
        const data = block.bulleted_list_item;
        if (!data) return null;
        const plainText = getPlainTextFromRichText(data.rich_text);
        const rtl = isRTL(plainText);
        return (
          <li key={block.id} dir={rtl ? "rtl" : "ltr"} className="pl-1">
            <RichText richText={data.rich_text} />
            {block.children && block.children.length > 0 && childrenRenderer && (
              <div className="mt-2 pl-4">
                {childrenRenderer(block.children)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
