"use client";

import React, { useState } from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { Maximize2, X } from "lucide-react";

interface ImageBlockProps {
  block: NotionBlock;
}

export function ImageBlock({ block }: ImageBlockProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = block.image;
  if (!data) return null;

  const url = data.type === "external" ? data.external?.url : data.file?.url;
  if (!url) return null;

  return (
    <>
      <figure className="my-6 group relative rounded-2xl overflow-hidden ring-1 ring-zinc-200/80 dark:ring-zinc-800/80 bg-zinc-100 dark:bg-zinc-900/60 p-1 shadow-sm">
        <div className="relative overflow-hidden rounded-xl bg-zinc-950 flex items-center justify-center min-h-[160px]">
          <img
            src={url}
            alt={data.caption?.[0]?.plain_text || "Notion Image"}
            className="w-full max-h-[520px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-900 text-zinc-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-md"
            title="Expand image"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {data.caption && data.caption.length > 0 && (
          <figcaption className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400 py-1">
            <RichText richText={data.caption} />
          </figcaption>
        )}
      </figure>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in cursor-zoom-out"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={url}
            alt="Expanded view"
            className="max-w-[92vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
