"use client";

import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Check, MessageSquare } from "lucide-react";
import { useToast } from "./Toast";

export function FeedbackWidget({ pageTitle }: { pageTitle: string }) {
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const handleVote = (vote: "yes" | "no") => {
    setFeedback(vote);
    setSubmitted(true);
    showToast(
      vote === "yes" ? "Thanks for your positive feedback!" : "Thank you for the feedback. We will improve this section.",
      "success"
    );
  };

  return (
    <div className="my-12 p-6 rounded-3xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span>Was this documentation helpful?</span>
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Help us continuously refine and improve New Agency Egypt docs.
          </p>
        </div>

        {submitted ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Feedback recorded</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote("yes")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-medium transition-all active:scale-95 shadow-sm"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleVote("no")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-medium transition-all active:scale-95 shadow-sm"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
              <span>No</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
