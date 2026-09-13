"use client";

import { motion } from "framer-motion";
import { deleteMemory } from "@/app/gallery/actions";
import { formatMemoryDate, type Memory } from "@/lib/memory";

export function TimelineList({ entries }: { entries: Memory[] }) {
  if (entries.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-neutral-400">
        No memories yet — add the first one above.
      </p>
    );
  }

  return (
    <div className="mt-4 min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="relative flex h-full w-max items-start gap-6 px-4 pt-3">
        <span className="pointer-events-none absolute top-[15px] right-4 left-4 h-0.5 bg-rose-200 dark:bg-rose-500/30" />

        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex w-60 shrink-0 snap-center flex-col items-center text-center"
          >
            <span className="relative z-10 h-3 w-3 shrink-0 rounded-full border-2 border-white bg-rose-400 dark:border-neutral-950" />

            <div className="mt-4 w-full overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              {entry.url ? (
                <img
                  src={entry.url}
                  alt={entry.title ?? ""}
                  className="h-32 w-full object-cover"
                />
              ) : (
                <div className="flex h-32 w-full items-center justify-center bg-rose-50 text-3xl dark:bg-neutral-800">
                  🤍
                </div>
              )}

              <div className="p-3">
                <p className="text-[11px] font-medium tracking-wide text-rose-500 uppercase dark:text-rose-400">
                  {formatMemoryDate(entry.date, entry.exact_date)}
                </p>
                <h3 className="mt-0.5 text-sm font-semibold">
                  {entry.title || "Untitled memory"}
                </h3>

                <form action={deleteMemory} className="mt-2">
                  <input type="hidden" name="id" value={entry.id} />
                  <input type="hidden" name="path" value={entry.storage_path ?? ""} />
                  <button className="text-xs text-neutral-400 hover:text-red-500">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
