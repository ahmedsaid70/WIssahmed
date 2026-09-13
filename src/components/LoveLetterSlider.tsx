"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { promises } from "@/lib/loveNotes";
import { Proposal } from "@/components/Proposal";

type Step = number | "proposal";

export function LoveLetterSlider({ initiallyAccepted }: { initiallyAccepted: boolean }) {
  const [step, setStep] = useState<Step>(0);

  const goNext = () => {
    if (typeof step === "number") {
      if (step + 1 < promises.length) setStep(step + 1);
      else setStep("proposal");
    }
  };

  const goBack = () => {
    if (typeof step === "number" && step > 0) setStep(step - 1);
  };

  return (
    <>
      <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-b from-rose-50 via-white to-rose-50 px-6 py-8 text-center dark:border-neutral-800 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900">
        {typeof step === "number" && step !== 0 && (
          <button
            onClick={goBack}
            aria-label="Back"
            className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-white/80 text-neutral-500 shadow-sm backdrop-blur-sm transition hover:text-rose-500 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-400"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {typeof step === "number" && (
            <motion.div
              key={`slide-${step}`}
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
                {promises[step].english}
              </p>

              <span className="mt-6 text-rose-400 dark:text-rose-500">✦</span>

              <button
                onClick={goNext}
                aria-label="Next"
                className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
              >
                <ArrowRight className="h-5 w-5" />
              </button>

              <div className="mt-8 flex w-full items-center justify-between text-xs font-medium text-neutral-400 dark:text-neutral-600">
                <span>
                  {String(step + 1).padStart(2, "0")} / {String(promises.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setStep("proposal")}
                  className="transition hover:text-rose-500"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step === "proposal" && (
          <Proposal
            initiallyAccepted={initiallyAccepted}
            onExit={() => setStep(promises.length - 1)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
