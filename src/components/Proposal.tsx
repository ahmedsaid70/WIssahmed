"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { acceptProposal, logNoClick } from "@/app/letter/actions";
import { proposalConfig as cfg } from "@/lib/proposal";
import { seededRandom } from "@/lib/memory";

type Phase = "buildup" | "question" | "celebrating" | "final";

function Starfield() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.7), transparent), " +
          "radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.5), transparent), " +
          "radial-gradient(1.5px 1.5px at 60% 55%, rgba(255,255,255,0.6), transparent), " +
          "radial-gradient(1px 1px at 30% 70%, rgba(255,255,255,0.5), transparent), " +
          "radial-gradient(1.5px 1.5px at 90% 80%, rgba(255,255,255,0.6), transparent), " +
          "radial-gradient(1px 1px at 45% 35%, rgba(255,255,255,0.4), transparent)",
      }}
    />
  );
}

function FloatingHearts({ count, intense }: { count: number; intense?: boolean }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: seededRandom(`heart-${i}`, 1) * 94 + 3,
        delay: seededRandom(`heart-${i}`, 2) * 5,
        duration: 7 + seededRandom(`heart-${i}`, 3) * 5,
        size: 10 + seededRandom(`heart-${i}`, 4) * 12,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className={intense ? "absolute text-rose-300/70" : "absolute text-rose-300/30"}
          style={{ left: `${h.left}%`, bottom: -20, fontSize: h.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -420, opacity: [0, 1, 0] }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "linear",
          }}
        >
          ❤
        </motion.span>
      ))}
    </div>
  );
}

export function Proposal({
  initiallyAccepted,
  onExit,
}: {
  initiallyAccepted: boolean;
  onExit: () => void;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<Phase>(initiallyAccepted ? "final" : "buildup");
  const [buildupIndex, setBuildupIndex] = useState(0);
  const [showButtons, setShowButtons] = useState(false);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noMessage, setNoMessage] = useState<string | null>(null);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [noLabel, setNoLabel] = useState(cfg.noLabel);
  const noRef = useRef<HTMLButtonElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const baseRectRef = useRef<DOMRect | null>(null);
  const attemptsRef = useRef(0);
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onExit();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  useEffect(() => {
    if (phase !== "buildup") return;
    if (buildupIndex >= cfg.buildupLines.length) {
      const t = setTimeout(() => setPhase("question"), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBuildupIndex((i) => i + 1), 2800);
    return () => clearTimeout(t);
  }, [phase, buildupIndex]);

  useEffect(() => {
    if (phase !== "question") return;
    const totalDelay = cfg.questionLines.length * 1000 + 2000;
    const t = setTimeout(() => setShowButtons(true), totalDelay);
    return () => clearTimeout(t);
  }, [phase]);

  function handleNoClick() {
    // A ref (not state) so rapid clicks always increment from the true
    // current count, instead of a stale value captured in this closure.
    attemptsRef.current += 1;
    const attempt = attemptsRef.current;
    setNoAttempts(attempt);
    setNoMessage(cfg.noMessages[(attempt - 1) % cfg.noMessages.length]);
    logNoClick().catch(() => {});

    if (attempt % 5 === 0) {
      if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);
      setNoLabel("Are you REALLY sure?");
      labelTimeoutRef.current = setTimeout(() => setNoLabel(cfg.noLabel), 900);
    }

    if (reducedMotion || !noRef.current) return;

    if (!baseRectRef.current) {
      baseRectRef.current = noRef.current.getBoundingClientRect();
    }
    const base = baseRectRef.current;
    const isMobile = window.innerWidth < 640;
    const scale = isMobile ? 0.45 : 1;
    const margin = 16;
    // Assume a generous worst-case width (covers the longer "Are you REALLY
    // sure?" label too) so the clamp stays safe even when the label changes.
    const safeWidth = Math.max(base.width, 200);

    const magnitude = Math.min(90 + attempt * 30, 220) * scale;
    const angle = (attempt % 2 === 0 ? 1 : -1) * (0.3 + (attempt % 3) * 0.4) * Math.PI;
    let dx = Math.cos(angle) * magnitude;
    let dy = Math.sin(angle) * magnitude * 0.5;

    const minDx = margin - base.left;
    const maxDx = window.innerWidth - margin - safeWidth - base.left;
    dx = Math.max(minDx, Math.min(maxDx, dx));

    const minDy = margin - base.top;
    const maxDy = window.innerHeight - margin - base.height - base.top;
    dy = Math.max(minDy, Math.min(maxDy, dy));

    if (attempt % 5 === 0) {
      // The "Are you REALLY sure?" label is much wider -- use a dedicated,
      // guaranteed-safe spot (centered, just below the button row) instead
      // of the usual formula, so it can never overlap Yes at this width.
      const desiredLeft = (window.innerWidth - safeWidth) / 2;
      dx = Math.max(minDx, Math.min(maxDx, desiredLeft - base.left));
      const desiredTop = base.top + base.height + 28;
      dy = Math.max(minDy, Math.min(maxDy, desiredTop - base.top));
    } else if (yesRef.current) {
      const yesRect = yesRef.current.getBoundingClientRect();
      const newLeft = base.left + dx;
      const newTop = base.top + dy;
      const newRight = newLeft + safeWidth;
      const newBottom = newTop + base.height;
      const pad = 24;
      const overlaps =
        newLeft < yesRect.right + pad &&
        newRight > yesRect.left - pad &&
        newTop < yesRect.bottom + pad &&
        newBottom > yesRect.top - pad;
      if (overlaps) {
        dy = Math.max(minDy, Math.min(maxDy, dy + base.height + 40));
      }
    }

    setNoOffset({ x: dx, y: dy });
  }

  function handleYes() {
    setPhase("celebrating");
    // Best-effort persistence -- the celebration must play out regardless
    // of whether this save succeeds (e.g. a network hiccup shouldn't be
    // able to swallow the emotional payoff).
    acceptProposal().catch(() => {});
    setTimeout(() => setPhase("final"), 5400);
  }

  const lineTransition = reducedMotion
    ? { duration: 0.3 }
    : { duration: 0.6, ease: "easeOut" as const };
  const lineInitial = reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 };
  const lineAnimate = reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-[#160a18] via-[#0c0810] to-black text-white"
    >
      <Starfield />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/20 blur-3xl" />
      {!reducedMotion && (
        <FloatingHearts count={phase === "celebrating" ? 16 : 6} intense={phase === "celebrating"} />
      )}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 140px 50px rgba(0,0,0,0.7)" }}
      />

      <button
        onClick={onExit}
        aria-label="Close"
        className="absolute top-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 backdrop-blur-sm hover:bg-white/20 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
        <AnimatePresence mode="wait">
          {phase === "buildup" && (
            <motion.div
              key={`buildup-${buildupIndex}`}
              initial={lineInitial}
              animate={lineAnimate}
              exit={{ opacity: 0 }}
              transition={lineTransition}
              className="max-w-sm text-lg font-light text-white/90 italic sm:text-xl"
            >
              {cfg.buildupLines[Math.min(buildupIndex, cfg.buildupLines.length - 1)]}
            </motion.div>
          )}

          {phase === "question" && (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex w-full max-w-sm flex-col items-center"
            >
              <span className="text-3xl">❤️</span>
              <div className="mt-6 flex flex-col gap-4">
                {cfg.questionLines.map((line, i) => (
                  <motion.p
                    key={line}
                    initial={lineInitial}
                    animate={lineAnimate}
                    transition={{ ...lineTransition, delay: i * 1.0 }}
                    className={
                      i === 0
                        ? "text-xl font-light text-rose-200 italic"
                        : i === cfg.questionLines.length - 1
                          ? "text-2xl font-bold text-white sm:text-3xl"
                          : "text-xl font-semibold text-white sm:text-2xl"
                    }
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {showButtons && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative mt-10 flex min-h-24 w-full items-center justify-center gap-4 sm:gap-6"
                >
                  <motion.button
                    ref={yesRef}
                    onClick={handleYes}
                    whileHover={reducedMotion ? undefined : { scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="group relative max-w-[180px] rounded-3xl bg-rose-500 px-5 py-3 text-sm leading-snug font-semibold text-white shadow-lg shadow-rose-500/40 transition hover:bg-rose-600 hover:shadow-rose-500/60 sm:max-w-[260px] sm:text-base"
                  >
                    {!reducedMotion && (
                      <>
                        <span className="pointer-events-none absolute -top-3 left-2 text-sm opacity-0 transition-all duration-700 group-hover:-translate-y-3 group-hover:opacity-100">
                          💗
                        </span>
                        <span className="pointer-events-none absolute -top-2 right-3 text-xs opacity-0 transition-all delay-100 duration-700 group-hover:-translate-y-3 group-hover:opacity-100">
                          💗
                        </span>
                      </>
                    )}
                    {cfg.yesLabel}
                  </motion.button>

                  <motion.button
                    ref={noRef}
                    onClick={handleNoClick}
                    animate={{
                      x: noOffset.x,
                      y: noOffset.y,
                      rotate: !reducedMotion && noAttempts >= 4 ? [0, -10, 10, -6, 6, 0] : 0,
                    }}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 22 },
                      y: { type: "spring", stiffness: 300, damping: 22 },
                      rotate: { duration: 0.5, ease: "easeInOut" },
                    }}
                    className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-sm hover:bg-white/15"
                  >
                    {noLabel}
                  </motion.button>
                </motion.div>
              )}

              <div className="mt-4 h-6">
                <AnimatePresence mode="wait">
                  {noMessage && (
                    <motion.p
                      key={noMessage + noAttempts}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-white/50"
                    >
                      {noMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {phase === "celebrating" && (
            <motion.div
              key="celebrating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex max-w-sm flex-col items-center gap-4"
            >
              {cfg.celebrationLines.map((line, i) => (
                <motion.p
                  key={line}
                  initial={lineInitial}
                  animate={lineAnimate}
                  transition={{ ...lineTransition, delay: 0.8 + i * 1.4 }}
                  className={
                    i === 0
                      ? "text-2xl font-bold text-white sm:text-3xl"
                      : "text-lg text-rose-100 sm:text-xl"
                  }
                >
                  {line}
                </motion.p>
              ))}
            </motion.div>
          )}

          {phase === "final" && (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex max-w-sm flex-col items-center gap-3"
            >
              {initiallyAccepted && (
                <>
                  <p className="text-2xl font-bold text-white">
                    {cfg.revisitMessage.heading}
                  </p>
                  <p className="text-sm text-white/70">{cfg.revisitMessage.body}</p>
                  <span className="my-2 text-rose-400">✦</span>
                </>
              )}
              <p className="text-2xl font-bold text-white">{cfg.finalMessage.heading}</p>
              {cfg.finalMessage.body.map((line) => (
                <p key={line} className="text-sm text-white/70">
                  {line}
                </p>
              ))}
              <p className="mt-1 text-lg font-semibold text-rose-200 italic">
                {cfg.finalMessage.closing}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
