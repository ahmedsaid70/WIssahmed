"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Shuffle, Image as ImageIcon } from "lucide-react";
import { seededRandom, formatMemoryDate, type Memory } from "@/lib/memory";
import { MemoryViewer } from "@/components/MemoryViewer";

function MemoryCard({
  memory,
  onOpen,
  reducedMotion,
}: {
  memory: Memory;
  onOpen: () => void;
  reducedMotion: boolean;
}) {
  const rotation = Math.round((seededRandom(memory.id, 1) - 0.5) * 10);
  const jitterY = Math.round((seededRandom(memory.id, 2) - 0.5) * 10);
  const isFeatured = seededRandom(memory.id, 3) > 0.8;
  const floatDuration = 4 + seededRandom(memory.id, 4) * 2;

  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      animate={
        reducedMotion
          ? { rotate: rotation }
          : { rotate: rotation, y: [jitterY, jitterY - 4, jitterY] }
      }
      whileHover={{ rotate: 0, scale: 1.06, y: 0 }}
      transition={{
        y: { duration: floatDuration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
        rotate: { duration: 0.25 },
        scale: { duration: 0.25 },
        default: { duration: 0.4, delay: seededRandom(memory.id, 5) * 0.3 },
      }}
      className={`group relative flex flex-col items-center rounded-sm bg-white p-2.5 pb-5 text-left shadow-md transition-shadow hover:z-10 hover:shadow-2xl focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none dark:bg-neutral-100 ${
        isFeatured ? "row-span-2" : ""
      }`}
      aria-label={`Open memory: ${memory.title || formatMemoryDate(memory.date, memory.exact_date)}`}
    >
      {memory.favorite && (
        <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-white shadow">
          <Star className="h-3.5 w-3.5 fill-white" />
        </span>
      )}
      <div
        className={`w-full overflow-hidden bg-neutral-200 ${isFeatured ? "aspect-[3/4]" : "aspect-square"}`}
      >
        {memory.url ? (
          <img
            src={memory.url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
      <span className="mt-2 line-clamp-1 max-w-full text-center font-serif text-xs text-neutral-500 italic opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {memory.title || formatMemoryDate(memory.date, memory.exact_date)}
      </span>
    </motion.button>
  );
}

function EmptyFrame({ rotation }: { rotation: number }) {
  return (
    <div
      style={{ rotate: `${rotation}deg` }}
      className="flex aspect-square items-center justify-center rounded-sm border-2 border-dashed border-neutral-300 bg-white/50 dark:border-neutral-700 dark:bg-neutral-900/50"
    >
      <ImageIcon className="h-6 w-6 text-neutral-300 dark:text-neutral-700" />
    </div>
  );
}

export function MemoryWall({ memories }: { memories: Memory[] }) {
  const reducedMotion = useReducedMotion() ?? false;
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return favoritesOnly ? memories.filter((m) => m.favorite) : memories;
  }, [memories, favoritesOnly]);

  function surpriseMe() {
    if (filtered.length === 0) return;
    setOpenIndex(Math.floor(Math.random() * filtered.length));
  }

  if (memories.length === 0) {
    return (
      <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-sm text-neutral-400">
          Our wall is still waiting for memories.
        </p>
        <div className="mt-6 grid w-full max-w-xs grid-cols-3 gap-4">
          <EmptyFrame rotation={-4} />
          <EmptyFrame rotation={2} />
          <EmptyFrame rotation={-2} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-1 flex-col">
      <p className="text-center text-sm text-rose-400 dark:text-rose-500">
        ✦ Our memories ✦
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => setFavoritesOnly(false)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
            !favoritesOnly
              ? "bg-rose-500 text-white"
              : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFavoritesOnly(true)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
            favoritesOnly
              ? "bg-rose-500 text-white"
              : "bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          ❤️ Favorites
        </button>
        <button
          onClick={surpriseMe}
          className="ml-auto flex shrink-0 items-center gap-1 rounded-full border border-dashed border-rose-300 px-3 py-1 text-xs font-medium text-rose-500 dark:border-rose-500/30 dark:text-rose-400"
        >
          <Shuffle className="h-3 w-3" />
          Surprise me
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-neutral-400">
          No favorites yet.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 [grid-auto-flow:dense] [grid-auto-rows:120px] sm:grid-cols-3 sm:[grid-auto-rows:140px] md:grid-cols-4">
          {filtered.map((memory, i) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              reducedMotion={reducedMotion}
              onOpen={() => setOpenIndex(i)}
            />
          ))}
        </div>
      )}

      {openIndex !== null && (
        <MemoryViewer
          memories={filtered}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </div>
  );
}
