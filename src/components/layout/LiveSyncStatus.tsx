"use client";

import React, { useState, useEffect } from "react";
import { RefreshCw, Radio } from "lucide-react";

interface LiveSyncStatusProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function LiveSyncStatus({ onRefresh, isRefreshing = false }: LiveSyncStatusProps) {
  const [lastSyncTime, setLastSyncTime] = useState<string>("just now");

  useEffect(() => {
    const updateTime = () => {
      setLastSyncTime("live");
    };
    updateTime();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium"
        title="Live Realtime Notion Connection"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="hidden sm:inline">Live Notion Sync</span>
      </div>

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
          title="Force refresh from Notion"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-500" : ""}`} />
        </button>
      )}
    </div>
  );
}
