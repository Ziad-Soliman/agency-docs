"use client";

import React, { useState } from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { getPlainTextFromRichText } from "@/lib/utils";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  block: NotionBlock;
}

export function CodeBlock({ block }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const data = block.code;
  if (!data) return null;

  const rawCode = getPlainTextFromRichText(data.rich_text);
  const language = data.language || "text";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const lines = rawCode.split("\n");

  return (
    <div className="my-6 rounded-2xl overflow-hidden ring-1 ring-zinc-800/90 bg-zinc-950 text-zinc-100 shadow-xl">
      {/* Top bar with Mac dots and language badge */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="ml-2 font-mono text-xs text-zinc-400 font-medium px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 transition-all active:scale-95"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto font-mono text-xs md:text-[0.84rem] leading-relaxed">
        <pre className="flex">
          {/* Line Numbers */}
          <div className="select-none text-zinc-600 text-right pr-4 border-r border-zinc-800/60 mr-4 flex flex-col font-mono">
            {lines.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <code className="text-zinc-200 flex-1 whitespace-pre">
            {rawCode}
          </code>
        </pre>
      </div>

      {/* Caption if present */}
      {data.caption && data.caption.length > 0 && (
        <div className="px-4 py-2 bg-zinc-900/40 border-t border-zinc-800/60 text-xs text-zinc-400 italic">
          <RichText richText={data.caption} />
        </div>
      )}
    </div>
  );
}
