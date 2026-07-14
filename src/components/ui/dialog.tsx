import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 py-10 sm:items-center"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn(
              "carbon relative w-full max-w-lg rounded-xl border border-[var(--color-border-hi)] shadow-2xl",
              className
            )}
          >
            <div className="stripe-accent h-1 w-full rounded-t-xl" />
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <h2 className="font-display text-base font-bold uppercase tracking-wide text-[var(--color-text)]">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-[var(--color-text-dim)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
