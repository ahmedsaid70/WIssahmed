"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({
  children,
  onClose,
  title,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-40 flex justify-center overflow-y-auto bg-black/40 px-4 py-8 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto max-h-[85dvh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900 ${
          title ? "text-left" : "text-center"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:text-rose-500"
        >
          <X className="h-4 w-4" />
        </button>
        {title && (
          <h2 className="pr-8 text-sm font-semibold text-neutral-900 dark:text-white">
            {title}
          </h2>
        )}
        <div className={title ? "mt-4" : undefined}>{children}</div>
      </motion.div>
    </motion.div>
  );
}
