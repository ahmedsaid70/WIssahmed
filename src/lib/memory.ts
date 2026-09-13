export type Memory = {
  id: string;
  url: string | null;
  storage_path: string | null;
  title: string | null;
  date: string;
  favorite: boolean;
  back_message: string | null;
  created_at: string;
};

export const MEMORY_COLUMNS =
  "id, url, storage_path, title, date, favorite, back_message, created_at";

/** A small, deterministic hash so the same memory always gets the same
 * "organic" jitter -- no Math.random(), so server and client render
 * identically (no hydration mismatch) and the layout doesn't reshuffle
 * every render. */
export function seededRandom(seed: string, salt = 0) {
  let hash = salt;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 1000) / 1000;
}

export function formatMemoryDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
