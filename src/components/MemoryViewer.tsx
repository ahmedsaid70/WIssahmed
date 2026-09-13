"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  RotateCw,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { toggleFavorite, deleteMemory } from "@/app/gallery/actions";
import { formatMemoryDate, type Memory } from "@/lib/memory";

export function MemoryViewer({
  memories,
  index,
  onClose,
  onNavigate,
}: {
  memories: Memory[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const memory = memories[index];
  const [flipped, setFlipped] = useState(false);
  const [favorite, setFavorite] = useState(memory.favorite);

  useEffect(() => {
    setFlipped(false);
    setFavorite(memory.favorite);
  }, [memory.id, memory.favorite]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && index < memories.length - 1) onNavigate(index + 1);
      if (e.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, memories.length, onClose, onNavigate]);

  async function handleFavorite() {
    const next = !favorite;
    setFavorite(next);
    await toggleFavorite(memory.id, next);
  }

  async function handleDelete() {
    const formData = new FormData();
    formData.set("id", memory.id);
    formData.set("path", memory.storage_path ?? "");
    onClose();
    await deleteMemory(formData);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-black/85 px-4 py-8 backdrop-blur-sm"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative m-auto flex w-full max-w-md flex-col items-center"
      >
        <div className="relative w-full [perspective:1200px]">
          <motion.div
            key={memory.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative w-full"
            >
              {/* front */}
              <div
                style={{ backfaceVisibility: "hidden" }}
                className="w-full rounded-lg bg-white p-3 shadow-2xl"
              >
                <div className="aspect-square w-full overflow-hidden rounded bg-neutral-100">
                  {memory.url ? (
                    <img
                      src={memory.url}
                      alt={memory.title ?? "A memory"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-neutral-300">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>
              </div>

              {/* back */}
              <div
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                className="absolute inset-0 flex w-full flex-col items-center justify-center rounded-lg bg-white p-6 text-center shadow-2xl"
              >
                <p className="font-serif text-lg text-neutral-700 italic">
                  {memory.back_message || "..."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-5 w-full text-center text-white">
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs font-medium tracking-wide text-white/60 uppercase">
              {formatMemoryDate(memory.date, memory.exact_date)}
            </p>
            <button
              onClick={handleFavorite}
              aria-label={favorite ? "Remove from favorites" : "Mark as favorite"}
              className="text-white/60 hover:text-yellow-400"
            >
              <Star className={`h-4 w-4 ${favorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
            </button>
            {memory.back_message && (
              <button
                onClick={() => setFlipped((f) => !f)}
                aria-label="Flip photo"
                className="text-white/60 hover:text-white"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              aria-label="Delete memory"
              className="text-white/60 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {memory.title && <h2 className="mt-2 text-xl font-semibold">{memory.title}</h2>}
        </div>

        <div className="mt-6 flex items-center gap-6">
          <button
            onClick={() => onNavigate(index - 1)}
            disabled={index === 0}
            aria-label="Previous memory"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-xs text-white/60 tabular-nums">
            {index + 1} / {memories.length} memories
          </span>
          <button
            onClick={() => onNavigate(index + 1)}
            disabled={index === memories.length - 1}
            aria-label="Next memory"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
