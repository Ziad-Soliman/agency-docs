"use client";

import React, { useState } from "react";
import { X, Copy, Check, QrCode, Share2, Send } from "lucide-react";
import { useToast } from "./Toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export function ShareModal({ isOpen, onClose, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast("Documentation link copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out ${title} on New Agency Egypt Docs:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, "_blank");
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}: ${url}`)}`, "_blank");
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=09090b&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 relative animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Share Document</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[280px]">{title}</p>
          </div>
        </div>

        {/* Copy Link Input Bar */}
        <div className="mt-4 flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full bg-transparent px-3 py-1 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none truncate font-mono select-all"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 flex-shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Quick Social Buttons */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={shareToTwitter}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <span>𝕏 Post</span>
          </button>

          <button
            onClick={shareToWhatsApp}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-emerald-500" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setShowQR(!showQR)}
            className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors ${
              showQR
                ? "bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Code</span>
          </button>
        </div>

        {/* QR Code Container */}
        {showQR && (
          <div className="mt-5 p-4 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col items-center justify-center animate-fade-in">
            <img src={qrImageUrl} alt="QR code" className="w-40 h-40 rounded-lg" />
            <span className="text-[11px] text-zinc-500 mt-2 font-medium">Scan to open on mobile</span>
          </div>
        )}
      </div>
    </div>
  );
}
