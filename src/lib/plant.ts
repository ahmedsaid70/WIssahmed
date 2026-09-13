const STAGES = [
  { minDays: 0, emoji: "🌱", label: "Just planted" },
  { minDays: 30, emoji: "🌿", label: "Sprouting" },
  { minDays: 90, emoji: "🪴", label: "Growing steadily" },
  { minDays: 180, emoji: "🌳", label: "Standing tall" },
  { minDays: 365, emoji: "🌸", label: "In full bloom" },
] as const;

export function getPlantStage(startDate: string) {
  const days = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(startDate + "T00:00:00").getTime()) / 86_400_000,
    ),
  );

  let stage: (typeof STAGES)[number] = STAGES[0];
  for (const candidate of STAGES) {
    if (days >= candidate.minDays) stage = candidate;
  }

  return { ...stage, days };
}
