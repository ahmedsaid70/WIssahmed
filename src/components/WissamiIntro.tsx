"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function WissamiIntro() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-center sm:p-6 dark:border-rose-500/20 dark:bg-rose-500/10">
      <motion.span
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="text-3xl text-rose-500"
      >
        ♥
      </motion.span>
      <h2 className="mt-1.5 text-lg font-bold text-neutral-900 dark:text-white">
        For my Wissami
      </h2>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Some things are easier to feel than to say.
      </p>
      <Link
        href="/letter"
        className="mt-3 flex items-center gap-1.5 rounded-full bg-rose-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-500/20 transition hover:bg-rose-600"
      >
        Open my heart
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
