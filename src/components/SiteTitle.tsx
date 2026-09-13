"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function SiteTitle() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="text-3xl font-bold text-rose-600 transition hover:text-rose-500 sm:text-4xl dark:text-rose-400"
      >
        Wissahmed ♥
      </button>

      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 6 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-xs text-xs text-neutral-500 italic dark:text-neutral-400"
          >
            Wissam + Ahmed = Wissahmed. 💕
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
