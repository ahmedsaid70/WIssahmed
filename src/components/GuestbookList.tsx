"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { deleteGuestbookMessage } from "@/app/guestbook/actions";

type Message = {
  id: string;
  author: string | null;
  message: string;
  created_at: string;
};

export function GuestbookList({ messages }: { messages: Message[] }) {
  const [index, setIndex] = useState(0);

  if (messages.length === 0) {
    return (
      <p className="mt-10 text-center text-sm text-neutral-400">
        No notes yet — leave the first one above.
      </p>
    );
  }

  const safeIndex = Math.min(index, messages.length - 1);
  const current = messages[safeIndex];

  const goNext = () => setIndex((i) => Math.min(i + 1, messages.length - 1));
  const goBack = () => setIndex((i) => Math.max(i - 1, 0));

  async function handleDelete() {
    const formData = new FormData();
    formData.set("id", current.id);
    if (safeIndex === messages.length - 1) setIndex(Math.max(0, safeIndex - 1));
    await deleteGuestbookMessage(formData);
  }

  return (
    <div className="relative mt-8 flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50 via-white to-rose-50 px-6 py-8 text-center dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900">
      {safeIndex > 0 && (
        <button
          onClick={goBack}
          aria-label="Previous note"
          className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-white/80 text-neutral-500 shadow-sm backdrop-blur-sm transition hover:text-rose-500 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}

      <button
        onClick={handleDelete}
        aria-label="Delete note"
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-white/80 text-neutral-400 shadow-sm backdrop-blur-sm transition hover:text-red-500 dark:border-neutral-800 dark:bg-neutral-900/80"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) goNext();
            else if (info.offset.x > 60) goBack();
          }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex w-full max-w-sm cursor-grab flex-col items-center active:cursor-grabbing"
        >
          <p className="px-6 text-lg leading-relaxed font-semibold text-neutral-900 sm:text-xl dark:text-white">
            {current.message}
          </p>

          <span className="mt-6 text-rose-400 dark:text-rose-500">✦</span>

          <p className="mt-6 text-sm text-neutral-500 italic dark:text-neutral-400">
            — {current.author || "Someone"}
          </p>

          {safeIndex < messages.length - 1 && (
            <button
              onClick={goNext}
              aria-label="Next note"
              className="mt-10 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          )}

          <p className="mt-8 text-xs font-medium text-neutral-400 dark:text-neutral-600">
            {safeIndex + 1} / {messages.length}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
