"use client";

import React, { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

export function ProtectionProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  useEffect(() => {
    // 1. Prevent Right Click / Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast("Right-click is disabled to protect documentation content.", "warning");
      return false;
    };

    // 2. Prevent Keyboard Shortcuts: Print (Cmd+P/Ctrl+P), Save (Cmd+S/Ctrl+S), View Source (Cmd+U/Ctrl+U), DevTools (F12, Cmd+Opt+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      // Print Prevention
      if (isCmdOrCtrl && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        e.stopPropagation();
        showToast("Printing this documentation is restricted.", "warning");
        return false;
      }

      // Save Prevention
      if (isCmdOrCtrl && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        showToast("Direct offline saving is disabled.", "warning");
        return false;
      }

      // View Source Prevention
      if (isCmdOrCtrl && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        showToast("Source inspection shortcut is disabled.", "warning");
        return false;
      }

      // F12 or Inspect Prevention
      if (
        e.key === "F12" ||
        (isCmdOrCtrl && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "C" || e.key === "c" || e.key === "J" || e.key === "j")) ||
        (isCmdOrCtrl && e.altKey && (e.key === "i" || e.key === "I" || e.key === "j" || e.key === "J" || e.key === "c" || e.key === "C"))
      ) {
        // Warning
        showToast("Developer inspection shortcut restricted.", "warning");
      }
    };

    // 3. Print Event Intercept
    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      showToast("Printing is blocked on this documentation platform.", "warning");
      // Blank the body or force reset
      document.body.style.display = "none";
      setTimeout(() => {
        document.body.style.display = "block";
      }, 100);
      return false;
    };

    // 4. Disable image and link dragging
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement)?.tagName === "IMG") {
        e.preventDefault();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("dragstart", handleDragStart);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("dragstart", handleDragStart);
    };
  }, [showToast]);

  return <>{children}</>;
}
