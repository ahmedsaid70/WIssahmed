"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, X } from "lucide-react";

export function AnniversaryLetter({ startDate }: { startDate: string }) {
  const [visible, setVisible] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const match = startDate.match(/^\d{4}-(\d{2})-(\d{2})$/);
    if (!match) return;

    const [, month, day] = match;
    const today = new Date();
    if (today.getMonth() + 1 !== Number(month) || today.getDate() !== Number(day)) {
      return;
    }

    setVisible(true);
  }, [startDate]);

  function dismiss() {
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/45 px-4 py-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="anniversary-title"
            className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50 via-white to-rose-50 px-7 py-9 text-center shadow-2xl shadow-neutral-950/20 dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close anniversary letter"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-white/80 text-neutral-500 transition hover:text-rose-500 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait" initial={false}>
              {!opened ? (
                <motion.div
                  key="invitation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-500 shadow-sm dark:border-rose-500/30 dark:bg-neutral-800 dark:text-rose-400">
                    <Heart className="h-6 w-6 fill-current" />
                  </div>
                  <p className="mt-6 text-xs font-semibold tracking-[0.18em] text-rose-500 uppercase dark:text-rose-400">
                    A little something for today
                  </p>
                  <h1
                    id="anniversary-title"
                    className="mt-3 text-2xl font-bold text-neutral-900 dark:text-white"
                  >
                    Happy anniversary, my love
                  </h1>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    I wrote you a few words for our special day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpened(true)}
                    className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
                  >
                    Open your letter
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="pt-3 text-left"
                >
                  <p className="text-center text-xs font-semibold tracking-[0.18em] text-rose-500 uppercase dark:text-rose-400">
                    For my favorite person
                  </p>
                  <h1
                    id="anniversary-title"
                    className="mt-5 text-center text-2xl font-bold text-neutral-900 dark:text-white"
                  >
                    To my love,
                  </h1>
                  <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    <p>
                      Kemlna déja 3am kifkif, meli 3reftek i always felt lucky. You are my best friend, my partner, and the love of my life. I am so grateful for every moment we have shared together, al hamdoulah, and inchallah koul 3am njowzoh kifkif ykoun khir men li 9eblo hata netla9aw f ajmal plasa w li hya jenna w na93do kifkif forever .
                    </p>
                    <p>
                      nhabke ta3rfi beli m3aya, daymen kayen yedi tchedi fiha w tkoni merta7a m3aha, in good days and bad days, you are my safe heaven.
                    </p>
                    <p>Happy anniversary</p>
                  </div>
                  <p className="mt-6 text-right text-sm font-semibold text-rose-600 dark:text-rose-400">
                    Always yours <span aria-hidden="true">♥</span>
                  </p>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="mt-7 flex h-11 w-full items-center justify-center rounded-full bg-rose-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
                  >
                    Back to our memories
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}