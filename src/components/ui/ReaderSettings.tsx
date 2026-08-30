"use client";

import React, { useState } from "react";
import { SlidersHorizontal, Eye, AlignLeft, AlignRight, Maximize2, Minimize2 } from "lucide-react";

interface ReaderSettingsProps {
  fontSize: "sm" | "base" | "lg";
  onChangeFontSize: (size: "sm" | "base" | "lg") => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  dirOverride: "auto" | "rtl" | "ltr";
  onChangeDirOverride: (dir: "auto" | "rtl" | "ltr") => void;
}

export function ReaderSettings({
  fontSize,
  onChangeFontSize,
  isFocusMode,
  onToggleFocusMode,
  dirOverride,
  onChangeDirOverride,
}: ReaderSettingsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-xl border transition-all active:scale-95 ${
          open || isFocusMode
            ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500/60 text-indigo-600 dark:text-indigo-400"
            : "bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-700/60"
        }`}
        title="Reader & Display Settings"
        aria-label="Reader settings"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-64 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 animate-slide-down space-y-4">
            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Font Size
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                {(["sm", "base", "lg"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onChangeFontSize(s)}
                    className={`py-1 rounded-lg text-xs font-medium transition-all ${
                      fontSize === s
                        ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {s === "sm" ? "Small" : s === "base" ? "Default" : "Large"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Text Flow
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <button
                  onClick={() => onChangeDirOverride("auto")}
                  className={`py-1 rounded-lg text-xs font-medium transition-all ${
                    dirOverride === "auto"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  Auto
                </button>
                <button
                  onClick={() => onChangeDirOverride("ltr")}
                  className={`py-1 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                    dirOverride === "ltr"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <AlignLeft className="w-3 h-3" />
                  <span>LTR</span>
                </button>
                <button
                  onClick={() => onChangeDirOverride("rtl")}
                  className={`py-1 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                    dirOverride === "rtl"
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <AlignRight className="w-3 h-3" />
                  <span>RTL</span>
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={onToggleFocusMode}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isFocusMode
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Focus Reader Mode</span>
                </span>
                {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
