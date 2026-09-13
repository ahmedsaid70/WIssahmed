"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX, Mail, Image as ImageIcon, Shuffle } from "lucide-react";
import { promises } from "@/lib/loveNotes";
import { getPlantStage } from "@/lib/plant";
import { getDailyMessage } from "@/lib/goodMorningMessages";
import { relationshipStartDate } from "@/lib/config";
import { backgroundTrack } from "@/lib/backgroundTrack";
import { Modal } from "@/components/Modal";

type Photo = { id: string; url: string; caption: string | null };
type Message = { id: string; author: string | null; message: string };
type TimelineEntry = {
  id: string;
  date: string;
  title: string | null;
  description: string | null;
  photo_url: string | null;
};

type Note =
  | { type: "guestbook"; message: string; author: string | null }
  | { type: "promise"; english: string };

type ObjectKey = "frame" | "calendar" | "letter";

function skyGradient(hour: number) {
  if (hour < 6 || hour >= 20) return "from-indigo-950 to-slate-800";
  if (hour < 9) return "from-orange-200 to-sky-200";
  if (hour < 17) return "from-sky-300 to-sky-100";
  return "from-orange-300 to-rose-200";
}

const hoverWiggle = {
  scale: 1.08,
  rotate: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.5, ease: "easeInOut" as const },
};

const tapShrink = { scale: 0.94 };

export function RoomScene({
  photos,
  messages,
  timelineEntries,
}: {
  photos: Photo[];
  messages: Message[];
  timelineEntries: TimelineEntry[];
}) {
  const [open, setOpen] = useState<ObjectKey | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [noteIndex, setNoteIndex] = useState(0);
  const [plantInfoOpen, setPlantInfoOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hour, setHour] = useState<number | null>(null);
  const [today, setToday] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setHour(new Date().getHours());
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  const upcomingCount = today
    ? timelineEntries.filter((entry) => entry.date >= today).length
    : 0;

  const dailyMessage = useMemo(() => getDailyMessage(new Date()), []);
  const plant = useMemo(() => getPlantStage(relationshipStartDate), []);
  const isNight = hour !== null && (hour < 6 || hour >= 20);

  const notes: Note[] = useMemo(
    () => [
      ...messages.map(
        (m): Note => ({ type: "guestbook", message: m.message, author: m.author }),
      ),
      ...promises.map((p): Note => ({ type: "promise", ...p })),
    ],
    [messages],
  );

  const shufflePhoto = () => {
    if (photos.length < 2) return;
    setPhotoIndex((i) => {
      let next = Math.floor(Math.random() * photos.length);
      while (next === i) next = Math.floor(Math.random() * photos.length);
      return next;
    });
  };

  const shuffleNote = () => {
    if (notes.length < 2) return;
    setNoteIndex((i) => {
      let next = Math.floor(Math.random() * notes.length);
      while (next === i) next = Math.floor(Math.random() * notes.length);
      return next;
    });
  };

  const openObject = (key: ObjectKey) => {
    if (key === "frame") setPhotoIndex(Math.floor(Math.random() * Math.max(photos.length, 1)));
    if (key === "letter") setNoteIndex(Math.floor(Math.random() * Math.max(notes.length, 1)));
    setOpen(key);
  };

  const toggleMusic = () => {
    if (!backgroundTrack.url) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      audioRef.current?.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  const currentPhoto = photos[photoIndex];
  const currentNote = notes[noteIndex];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-8 text-center">
      <p className="text-xs font-semibold tracking-widest text-rose-400 uppercase dark:text-rose-500">
        Our virtual home
      </p>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{dailyMessage}</p>

      <div className="relative mt-6 aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[2rem] border border-rose-100 shadow-xl dark:border-neutral-800">
        {/* wall */}
        <div
          className={`absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b transition-colors duration-1000 ${
            isNight
              ? "from-indigo-950 to-neutral-900"
              : "from-rose-100 to-rose-50 dark:from-neutral-800 dark:to-neutral-900"
          }`}
        >
          {/* window */}
          <div className="absolute top-5 left-1/2 h-16 w-24 -translate-x-1/2 overflow-hidden rounded-t-[40px] border-[6px] border-white shadow-sm dark:border-neutral-300">
            <div
              className={`relative h-full w-full bg-gradient-to-b transition-colors duration-1000 ${
                hour === null ? "from-sky-300 to-sky-100" : skyGradient(hour)
              }`}
            >
              <span className="absolute top-2 right-2 text-sm">
                {hour === null ? "" : isNight ? "🌙" : "☀️"}
              </span>
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/70" />
              <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/70" />
            </div>
          </div>

          {/* picture frame */}
          <motion.button
            onClick={() => openObject("frame")}
            whileHover={hoverWiggle}
            whileTap={tapShrink}
            aria-label="Picture frame"
            className="absolute top-[36%] left-[8%] flex w-[30%] flex-col items-center focus:outline-none"
          >
            <span className="h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <span className="h-3 w-px bg-neutral-400/70 dark:bg-neutral-600" />
            <span className="w-full rounded-md border-[5px] border-white bg-white p-0 shadow-md dark:border-neutral-200">
              <span className="block aspect-square w-full overflow-hidden rounded-sm bg-rose-100 dark:bg-neutral-700">
                {currentPhoto ? (
                  <img
                    src={currentPhoto.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-rose-300 dark:text-neutral-500">
                    <ImageIcon className="h-5 w-5" />
                  </span>
                )}
              </span>
            </span>
          </motion.button>

          {/* calendar */}
          <motion.button
            onClick={() => openObject("calendar")}
            whileHover={hoverWiggle}
            whileTap={tapShrink}
            aria-label="Calendar"
            className="absolute top-[32%] right-[10%] flex w-[24%] flex-col items-center focus:outline-none"
          >
            <span className="flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            </span>
            <span className="mt-0.5 block w-full overflow-hidden rounded-md bg-white shadow-md dark:bg-neutral-200">
              <span className="block bg-rose-500 py-1 text-[9px] font-bold text-white">
                {hour === null
                  ? ""
                  : new Date().toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
              </span>
              <span className="block py-2 text-lg font-bold text-neutral-700">
                {hour === null ? "" : new Date().getDate()}
              </span>
            </span>
            {upcomingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {upcomingCount}
              </span>
            )}
          </motion.button>
        </div>

        {/* floor */}
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-b from-amber-100 to-amber-200 dark:from-neutral-900 dark:to-neutral-950">
          <span className="absolute bottom-3 left-1/2 h-9 w-3/4 -translate-x-1/2 rounded-full bg-rose-200/50 dark:bg-rose-500/10" />

          {/* desk with a letter on it */}
          <motion.button
            onClick={() => openObject("letter")}
            whileHover={hoverWiggle}
            whileTap={tapShrink}
            aria-label="Letter on the desk"
            className="absolute bottom-3 left-[10%] flex w-[32%] flex-col items-center focus:outline-none"
          >
            <span className="mb-[-4px] flex h-9 w-12 rotate-[-8deg] items-center justify-center rounded-sm bg-white shadow-md dark:bg-neutral-100">
              <Mail className="h-4 w-4 text-rose-400" />
            </span>
            <span className="h-4 w-full rounded-t-md bg-amber-700 dark:bg-amber-900" />
            <span className="flex w-full justify-between px-1.5">
              <span className="h-6 w-1.5 bg-amber-800 dark:bg-amber-950" />
              <span className="h-6 w-1.5 bg-amber-800 dark:bg-amber-950" />
            </span>
          </motion.button>

          {/* plant */}
          <motion.button
            onClick={() => setPlantInfoOpen((v) => !v)}
            whileHover={hoverWiggle}
            whileTap={tapShrink}
            aria-label="Plant"
            className="absolute bottom-3 right-[12%] flex w-[22%] flex-col items-center focus:outline-none"
          >
            <AnimatePresence>
              {plantInfoOpen && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute -top-9 z-10 rounded-full bg-neutral-900/90 px-3 py-1 text-[10px] whitespace-nowrap text-white shadow-lg dark:bg-white/90 dark:text-neutral-900"
                >
                  {plant.label} · {plant.days}d
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              key={plant.emoji}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl"
            >
              {plant.emoji}
            </motion.span>
            <span className="h-5 w-10 rounded-b-xl bg-gradient-to-b from-amber-700 to-amber-900" />
          </motion.button>
        </div>
      </div>

      <Link
        href="/"
        className="mt-6 text-xs font-medium text-neutral-400 transition hover:text-rose-500 dark:text-neutral-500"
      >
        Back to Us ♥
      </Link>

      {/* floating music control */}
      <button
        onClick={toggleMusic}
        disabled={!backgroundTrack.url}
        aria-label={playing ? "Mute music" : "Play music"}
        title={backgroundTrack.url ? backgroundTrack.title : "Add a song in src/lib/backgroundTrack.ts"}
        className="fixed top-20 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white/90 text-neutral-500 shadow-sm backdrop-blur-md transition hover:text-rose-500 disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400"
      >
        {playing ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
      {backgroundTrack.url && (
        <audio ref={audioRef} src={backgroundTrack.url} loop className="hidden" />
      )}

      <AnimatePresence>
        {open && (
          <Modal onClose={() => setOpen(null)}>
            {open === "frame" &&
              (currentPhoto ? (
                <div>
                  <img
                    src={currentPhoto.url}
                    alt={currentPhoto.caption ?? "A photo of us"}
                    className="max-h-80 w-full rounded-xl object-cover"
                  />
                  {currentPhoto.caption && (
                    <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                      {currentPhoto.caption}
                    </p>
                  )}
                  <button
                    onClick={shufflePhoto}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    Another photo
                  </button>
                </div>
              ) : (
                <EmptyState text="No photos yet" href="/gallery" cta="Add one in Gallery" />
              ))}

            {open === "calendar" &&
              (timelineEntries.length > 0 ? (
                <div>
                  <p className="mb-3 text-sm font-semibold">Our timeline</p>
                  <div className="relative -mx-6 px-6">
                    <span className="pointer-events-none absolute top-[9px] right-6 left-6 h-px bg-rose-200 dark:bg-rose-500/30" />
                    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {timelineEntries.map((entry) => {
                        const isUpcoming = today !== null && entry.date >= today;
                        return (
                          <div
                            key={entry.id}
                            className="flex w-36 shrink-0 snap-center flex-col items-center text-left"
                          >
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                isUpcoming
                                  ? "bg-rose-500"
                                  : "bg-rose-200 dark:bg-rose-500/40"
                              }`}
                            />
                            <div className="mt-2 w-full rounded-xl border border-rose-100 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-800">
                              {entry.photo_url ? (
                                <img
                                  src={entry.photo_url}
                                  alt={entry.title ?? ""}
                                  className="h-20 w-full rounded-md object-cover"
                                />
                              ) : (
                                <div className="flex h-20 w-full items-center justify-center rounded-md bg-rose-50 text-rose-200 dark:bg-neutral-700 dark:text-neutral-600">
                                  <ImageIcon className="h-5 w-5" />
                                </div>
                              )}
                              <p className="mt-2 text-[10px] font-semibold text-rose-500 dark:text-rose-400">
                                {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-xs font-medium">
                                {entry.title || "Untitled memory"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Link
                    href="/timeline"
                    className="mt-4 inline-block text-xs font-medium text-rose-500 hover:text-rose-600"
                  >
                    Open full Timeline →
                  </Link>
                </div>
              ) : (
                <EmptyState
                  text="No timeline yet"
                  href="/timeline"
                  cta="Add your first memory"
                />
              ))}

            {open === "letter" &&
              (currentNote ? (
                <div>
                  {currentNote.type === "promise" ? (
                    <p className="text-lg leading-relaxed font-semibold">
                      {currentNote.english}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm leading-relaxed">{currentNote.message}</p>
                      <p className="mt-3 text-xs text-neutral-400">
                        — {currentNote.author || "Anonymous"}
                      </p>
                    </>
                  )}
                  <button
                    onClick={shuffleNote}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 hover:text-rose-600"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    Another note
                  </button>
                </div>
              ) : (
                <EmptyState text="No notes yet" href="/guestbook" cta="Leave the first one" />
              ))}
          </Modal>
        )}
      </AnimatePresence>
    </main>
  );
}

function EmptyState({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{text}</p>
      <Link
        href={href}
        className="mt-3 inline-block text-xs font-medium text-rose-500 hover:text-rose-600"
      >
        {cta} →
      </Link>
    </div>
  );
}
