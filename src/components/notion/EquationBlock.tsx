"use client";

import React from "react";
import { NotionBlock } from "@/lib/types";
import katex from "katex";
import "katex/dist/katex.min.css";

interface EquationBlockProps {
  block: NotionBlock;
}

export function EquationBlock({ block }: EquationBlockProps) {
  const data = block.equation;
  if (!data?.expression) return null;

  try {
    const html = katex.renderToString(data.expression, {
      throwOnError: false,
      displayMode: true,
    });

    return (
      <div className="my-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 ring-1 ring-zinc-200 dark:ring-zinc-800 overflow-x-auto text-center">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  } catch (e) {
    return (
      <pre className="my-4 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">
        {data.expression}
      </pre>
    );
  }
}
