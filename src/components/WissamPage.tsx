"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { seededRandom } from "@/lib/memory";

type HeroPhoto = { url: string; title: string | null } | null;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Reveal className="text-center">
      <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl dark:text-white">
        {children}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
      )}
    </Reveal>
  );
}

function InfoCard({
  icon,
  title,
  caption,
  children,
}: {
  icon: string;
  title: string;
  caption?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-rose-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <span className="text-2xl">{icon}</span>
      <h3 className="mt-2 font-semibold text-neutral-900 dark:text-white">{title}</h3>
      {children && (
        <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{children}</div>
      )}
      {caption && (
        <p className="mt-2 text-xs text-neutral-400 italic dark:text-neutral-500">{caption}</p>
      )}
    </div>
  );
}

function ColorSwatch() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
        Her favorite color
      </p>
      <motion.span
        whileHover={{ scale: 1.35 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="mt-3 h-12 w-12 rounded-full shadow-inner"
        style={{ backgroundColor: "#ffc2d6" }}
      />
      <p className="mt-3 font-semibold text-neutral-900 dark:text-white">Light Pink</p>
    </div>
  );
}

function TiramisuCard() {
  const [burst, setBurst] = useState(0);
  return (
    <button
      onClick={() => setBurst((b) => b + 1)}
      className="relative flex h-full flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <span className="text-3xl">🍰</span>
      <AnimatePresence>
        {burst > 0 && (
          <motion.span
            key={burst}
            initial={{ opacity: 1, y: 0, scale: 0.6 }}
            animate={{ opacity: 0, y: -34, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="pointer-events-none absolute top-3 text-lg"
          >
            ✨💗
          </motion.span>
        )}
      </AnimatePresence>
      <p className="mt-2 font-semibold text-neutral-900 dark:text-white">Tiramisu</p>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        &ldquo;Healthy food? kach nhar hhhh.&rdquo; 😭
      </p>
    </button>
  );
}

function TeaCard() {
  const [steaming, setSteaming] = useState(false);
  return (
    <button
      onClick={() => {
        setSteaming(true);
        setTimeout(() => setSteaming(false), 1600);
      }}
      className="relative flex h-full flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative">
        <span className="text-3xl">☕</span>
        <AnimatePresence>
          {steaming &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.7, 0], y: -22 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, delay: i * 0.25 }}
                className="pointer-events-none absolute -top-1 text-sm text-neutral-300"
                style={{ left: i === 0 ? "30%" : "55%" }}
              >
                〰️
              </motion.span>
            ))}
        </AnimatePresence>
      </div>
      <p className="mt-2 font-semibold text-neutral-900 dark:text-white">Tea</p>
      <p className="mt-1 text-xs text-neutral-400 italic dark:text-neutral-500">
        Tea daymen èader m3a les series hhhh
      </p>
    </button>
  );
}

function BarcaCard() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <motion.span
        whileHover={{ rotate: [0, -8, 8, -6, 0] }}
        transition={{ duration: 0.5 }}
        className="text-3xl"
      >
        ⚽
      </motion.span>
      <p className="mt-2 font-semibold text-neutral-900 dark:text-white">Barça 💙❤️</p>
      <p className="mt-1 text-xs text-neutral-400 italic dark:text-neutral-500">
        Lazem n'accepti had 3afsaa 😤
      </p>
    </div>
  );
}

function DramaCard() {
  const [episode, setEpisode] = useState(0);
  return (
    <button
      onClick={() => setEpisode((e) => e + 1)}
      className="flex h-full flex-col items-start rounded-2xl border border-rose-100 bg-white p-5 text-left shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <span className="text-2xl">🎬</span>
      <h3 className="mt-2 font-semibold text-neutral-900 dark:text-white">Drama Expert</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        She can watch Turkish drama TV shows for what feels like an entire lifetime.
      </p>
      <p className="mt-2 text-xs text-neutral-400 italic dark:text-neutral-500">
        Meanwhile, I&apos;m here waiting for my turn to talk to her. 😏
      </p>
      <AnimatePresence mode="wait">
        {episode > 0 && (
          <motion.p
            key={episode}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs font-medium text-rose-400"
          >
            Episode {episode}... still going. 🍿
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

const personality = [
  {
    icon: "❤️",
    title: "Gentle",
    text: "She has a very gentle side. She can be soft, caring, and affectionate, especially with people she loves.",
  },
  {
    icon: "🤝",
    title: "Supportive",
    text: "One of the things I appreciate most about her is how supportive she can be when things get difficult.",
  },
  {
    icon: "🌹",
    title: "Romantic",
    text: "She's romantic in her own way. It's not always about big gestures. Sometimes it's the little things that matter.",
  },
  {
    icon: "🫶",
    title: "She Cares",
    text: "She genuinely cares about the people she loves. And I know that because I've felt it myself.",
  },
];

const loveLetter = [
  {
    title: "Your gentleness",
  },
  {
    title: "The way you support me",
    lines: [
      "I love that when things get difficult, you can be there for me.",
    ],
  },
  {
    title: "Your romantic side",
    lines: [
      "The little things, the affection, the way you make ordinary moments feel special.",
    ],
  },
  {
    title: "The way you care",
    lines: [
      "I love that you genuinely care about me.",
    ],
  },
  {
    title: "Your faith",
    lines: [
      "I admire your faith and the way you believe in something bigger than yourself.",
    ],
  },
];

const cuteFacts = [
  "🎀 Light pink",
  "☕ Tea",
  "🍰 Tiramisu",
  "⚽ Barça",
  "🧪 Biochemistry",
  "🎬 Drama addict",
  "❤️ Romantic",
  "🫶 Supportive",
  "🌹 Gentle",
  "✨ Believes in me",
];

const stats = [
  { label: "Drama episodes watched", value: "∞" },
  { label: "Tea consumed", value: "☕☕☕☕☕☕☕" },
  { label: "Tiramisu resistance", value: "0%" },
  { label: "Barça loyalty", value: "100%" },
  { label: "Gentleness", value: "100%" },
  { label: "Supportiveness", value: "100%" },
  { label: "Ability to make me smile", value: "Dangerously high" },
  { label: "Ability to distract me", value: "1000%" },
  { label: "Space occupied in my heart", value: "∞" },
];

function FloatingDoodles() {
  // Deferred to after mount: useReducedMotion() already reflects the real
  // client preference on first client render, while SSR always sees false,
  // so deciding whether to render at all (not just how to animate) would
  // mismatch during hydration.
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => setMounted(true), []);
  if (!mounted || reducedMotion) return null;
  const doodles = ["🌸", "✨", "💗"];
  const items = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    emoji: doodles[i % doodles.length],
    left: seededRandom(`wissam-doodle-${i}`, 1) * 92 + 4,
    top: seededRandom(`wissam-doodle-${i}`, 2) * 100,
    duration: 6 + seededRandom(`wissam-doodle-${i}`, 3) * 4,
    delay: seededRandom(`wissam-doodle-${i}`, 4) * 4,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      {items.map((d) => (
        <motion.span
          key={d.id}
          className="absolute text-lg"
          style={{ left: `${d.left}%`, top: `${d.top}%` }}
          animate={{ y: [0, -14, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {d.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export function WissamPage({ heroPhoto }: { heroPhoto: HeroPhoto }) {
  return (
    <main className="relative flex-1 bg-gradient-to-b from-rose-50 via-white to-white dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-950">
      <Link
        href="/"
        aria-label="Back"
        className="fixed top-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-rose-100 bg-white/90 text-neutral-500 shadow-sm backdrop-blur-md hover:text-rose-500 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>

      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pt-20 pb-14 text-center">
        <FloatingDoodles />
        <Reveal>
          <h1 className="text-4xl font-bold text-rose-600 sm:text-5xl dark:text-rose-400">
            Wissam ❤️
          </h1>
          <p className="mt-3 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
            A little bit about the girl who somehow became my favorite person.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <div className="relative rotate-[-3deg] rounded-sm bg-white p-3 pb-8 shadow-lg dark:bg-neutral-100">
            <div className="h-56 w-44 overflow-hidden rounded-sm bg-rose-100 sm:h-64 sm:w-52">
              {heroPhoto?.url ? (
                <img
                  src={heroPhoto.url}
                  alt={heroPhoto.title ?? "Wissam"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-5xl">
                  🌸
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="mt-6 text-xs text-neutral-400 italic dark:text-neutral-500">
            Warning: may spend 90% of her free time watching dramas. 😏
          </p>
        </Reveal>
      </section>

      {/* Basic facts */}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <SectionTitle>The Basics</SectionTitle>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-fr">
          <Reveal className="h-full">
            <InfoCard icon="👤" title="Wissam Biktach" caption="Name" />
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <InfoCard
              icon="🎂"
              title="08.12.2003"
              caption="The day someone very special came into the world."
            >
              Her birthday.
            </InfoCard>
          </Reveal>
          <Reveal delay={0.2} className="h-full">
            <InfoCard
              icon="🧪"
              title="Biochemistry"
            >
              USTHB — Université des Sciences et de la Technologie Houari Boumediene
            </InfoCard>
          </Reveal>
          <Reveal delay={0.3} className="h-full">
            <InfoCard
              icon="⛰️"
              title="Kabyle roots, from Sétif"
            />
          </Reveal>
        </div>
      </section>

      {/* Favorite things */}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <SectionTitle subtitle="A few things she'd never compromise on.">
          Favorite Things
        </SectionTitle>
        <div className="mt-6 grid grid-cols-2 gap-4 auto-rows-fr">
          <Reveal className="h-full">
            <ColorSwatch />
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <TiramisuCard />
          </Reveal>
          <Reveal delay={0.2} className="h-full">
            <BarcaCard />
          </Reveal>
          <Reveal delay={0.3} className="h-full">
            <TeaCard />
          </Reveal>
        </div>
      </section>

      {/* Personality */}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <SectionTitle subtitle="Things you should know about Wissam.">
          Her Personality
        </SectionTitle>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:auto-rows-fr">
          <Reveal className="h-full">
            <DramaCard />
          </Reveal>
          {personality.map((p, i) => (
            <Reveal key={p.title} delay={0.1 * (i + 1)} className="h-full">
              <InfoCard icon={p.icon} title={p.title}>
                {p.text}
              </InfoCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What I love about her -- letter style */}
      <section className="bg-[#fdfaf3] py-14 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-xl px-6">
          <SectionTitle>What I Love About You ❤️</SectionTitle>
          <Reveal delay={0.1}>
            <p className="mt-4 text-center font-serif text-sm text-neutral-500 italic dark:text-neutral-400">
              There are so many things I could write here, but these are some of the things
              that make you <span className="not-italic font-semibold">you</span>.
            </p>
          </Reveal>

          <div className="mt-8 flex flex-col gap-6">
            {loveLetter.map((item, i) => (
              <Reveal key={item.title} delay={0.1 * i}>
                <div className="rounded-lg border border-rose-100/70 bg-white/70 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70">
                  <h3 className="font-serif text-lg text-rose-500 italic dark:text-rose-400">
                    {item.title}
                  </h3>
                  {item?.lines?.map((line) => (
                    <p
                      key={line}
                      className="mt-2 font-serif text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.6}>
              <div className="rounded-lg border-2 border-rose-200 bg-rose-50 p-6 text-center shadow-sm dark:border-rose-500/30 dark:bg-rose-500/10">
                <h3 className="font-serif text-xl font-semibold text-rose-600 italic dark:text-rose-400">
                  The way you believe in me
                </h3>
                <p className="mt-3 font-serif text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  Maybe one of the things that means the most to me is knowing that you believe
                  in me.
                </p>
                <p className="mt-2 font-serif text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  When I doubt myself, having someone who believes in me means more than you
                  probably realize.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* And then there's you */}
      <section className="mx-auto max-w-xl px-6 py-16 text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-white">
            And then there&apos;s you.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Somehow, among all the people in the world, I ended up finding you.
          </p>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            And the more I get to know you, the more things I find to love.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-4 text-xs text-neutral-400 italic dark:text-neutral-500">
            Even when you steal hours watching dramas instead of talking to me. 😏
          </p>
        </Reveal>
      </section>
      {/* Stats */}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <SectionTitle subtitle="Do not take these too seriously.">
          Wissam Statistics
        </SectionTitle>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <span className="text-neutral-600 dark:text-neutral-400">{s.label}</span>
                <span className="font-bold text-rose-500 dark:text-rose-400">{s.value}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Final quote */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-rose-100 via-rose-50 to-white px-6 py-16 text-center dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950">
        <FloatingDoodles />
        <Reveal>
          <p className="max-w-md font-serif text-xl leading-relaxed text-neutral-800 italic sm:text-2xl dark:text-neutral-100">
            &ldquo;I could describe you with a thousand facts... but my favorite fact will
            always be that you&apos;re you.&rdquo;
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-8 text-2xl font-bold text-rose-500 dark:text-rose-400">
            ❤️ Wissam ❤️
          </p>
        </Reveal>
      </section>
    </main>
  );
}
