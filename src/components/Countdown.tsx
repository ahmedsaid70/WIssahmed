"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nextOccurrence, timeParts, ageParts } from "@/lib/countdown";

function daysSince(startDate: string) {
  const start = new Date(startDate + "T00:00:00");
  const now = new Date();
  const ms = now.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function useLiveCountdown(monthDayOf: string) {
  const [parts, setParts] = useState<ReturnType<typeof timeParts> | null>(null);

  useEffect(() => {
    function tick() {
      const now = new Date();
      setParts(timeParts(nextOccurrence(monthDayOf, now), now));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [monthDayOf]);

  return parts;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold tabular-nums text-rose-600 sm:text-xl dark:text-rose-400">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{label}</span>
    </div>
  );
}

function useLiveAge(birthDate: string) {
  const [parts, setParts] = useState<ReturnType<typeof ageParts> | null>(null);

  useEffect(() => {
    function tick() {
      setParts(ageParts(birthDate, new Date()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [birthDate]);

  return parts;
}

function AgeCard({ title, birthDate }: { title: string; birthDate: string }) {
  const age = useLiveAge(birthDate);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-center sm:p-4 dark:border-rose-500/20 dark:bg-rose-500/10"
    >
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
      <p className="mt-0.5 text-2xl font-bold text-rose-600 sm:text-3xl dark:text-rose-400">
        {age ? `${age.years}y ${age.months}m` : "–"}
      </p>
      <p className="mt-0.5 text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400">
        {age &&
          `${age.days}d ${String(age.hours).padStart(2, "0")}:${String(age.minutes).padStart(2, "0")}:${String(age.seconds).padStart(2, "0")}`}
      </p>
    </motion.div>
  );
}

function LiveCountdownCard({ title, monthDayOf }: { title: string; monthDayOf: string }) {
  const parts = useLiveCountdown(monthDayOf);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-rose-200 bg-rose-50 p-3 sm:p-4 dark:border-rose-500/20 dark:bg-rose-500/10"
    >
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
      <div className="mt-1.5 flex justify-between gap-0.5">
        <TimeUnit value={parts?.days ?? 0} label="days" />
        <TimeUnit value={parts?.hours ?? 0} label="hrs" />
        <TimeUnit value={parts?.minutes ?? 0} label="min" />
        <TimeUnit value={parts?.seconds ?? 0} label="sec" />
      </div>
    </motion.div>
  );
}

export function Countdown({
  startDate,
  herBirthday,
}: {
  startDate: string;
  herBirthday: string;
}) {
  const together = daysSince(startDate);

  return (
    <div className="flex flex-col gap-2.5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-center sm:p-6 dark:border-rose-500/20 dark:bg-rose-500/10"
      >
        <p className="text-3xl font-bold text-rose-600 sm:text-4xl dark:text-rose-400">
          {together}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
          days together
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-2.5">
        <LiveCountdownCard title="Until our anniversary" monthDayOf={startDate} />
        <AgeCard title="Her age right now" birthDate={herBirthday} />
      </div>
    </div>
  );
}
