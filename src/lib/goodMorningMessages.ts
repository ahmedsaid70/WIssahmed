export const goodMorningMessages = [
  "Good morning ❤️ — you were my first thought today.",
  "Rise and shine, my love. The world is better with you awake in it.",
  "Good morning ☀️ — I hope today is as sweet as you are.",
  "Just a little reminder before your day starts: you're loved, endlessly.",
  "Good morning ❤️ — wherever you are today, I'm rooting for you.",
  "Hey you. Yes you. Good morning, and I love you.",
  "Good morning ☀️ — may today bring you something small and lovely.",
  "Waking up knowing I get to love you is the best part of my day.",
  "Good morning ❤️ — go make today yours.",
  "A little sunshine for you this morning, straight from my heart.",
  "Good morning — today is one more page in our story, and I like where it's going.",
  "Good morning ❤️ — breathe, smile, you've got this.",
  "Sending you warmth this morning, wherever you wake up.",
  "Good morning, my favorite person.",
];

export function getDailyMessage(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) /
      86_400_000,
  );

  return goodMorningMessages[dayOfYear % goodMorningMessages.length];
}
