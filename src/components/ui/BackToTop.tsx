"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const current = window.scrollY;
      setVisible(current > 280);

      if (totalScroll > 0) {
        setScrollProgress((current / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-40 p-2.5 rounded-full bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-800 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center"
      title="Back to Top"
      aria-label="Back to Top"
    >
      <svg className="w-9 h-9 -rotate-90 absolute" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          className="stroke-zinc-200 dark:stroke-zinc-800"
          strokeWidth="2.5"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          className="stroke-indigo-500 transition-all duration-150"
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <ArrowUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
