import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error";
}

interface ToastContextValue {
  push: (message: string, type?: "success" | "error") => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const push = React.useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12, x: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className={`carbon pointer-events-auto flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-xl ${
                  item.type === "success"
                    ? "border-emerald-800/60 text-emerald-300"
                    : "border-red-800/60 text-red-300"
                }`}
              >
                {item.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {item.message}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
