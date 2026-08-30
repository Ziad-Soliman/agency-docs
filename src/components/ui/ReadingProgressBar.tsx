"use client";

import React, { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll <= 0) {
        setProgress(0);
        return;
      }
      const currentProgress = (window.scrollY / totalScroll) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] bg-zinc-200/40 dark:bg-zinc-800/40 pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
