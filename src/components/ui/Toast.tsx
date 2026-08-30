"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { ShieldAlert, CheckCircle2, Info, X } from "lucide-react";

interface ToastMessage {
  id: string;
  type: "warning" | "success" | "info";
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: "warning" | "success" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: "warning" | "success" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-2), { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast floating container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          let icon = <Info className="w-4 h-4 text-indigo-400" />;
          let border = "border-indigo-500/40 bg-indigo-950/90 text-indigo-100";

          if (toast.type === "warning") {
            icon = <ShieldAlert className="w-4 h-4 text-amber-400" />;
            border = "border-amber-500/40 bg-zinc-950/95 text-amber-100";
          } else if (toast.type === "success") {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            border = "border-emerald-500/40 bg-zinc-950/95 text-emerald-100";
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl text-xs font-medium animate-slide-down transition-all ${border}`}
            >
              <div className="flex-shrink-0">{icon}</div>
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-70 hover:opacity-100 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
