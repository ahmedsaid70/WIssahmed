export function nextOccurrence(monthDayOf: string, now: Date) {
  const source = new Date(monthDayOf + "T00:00:00");
  let next = new Date(now.getFullYear(), source.getMonth(), source.getDate());
  if (next.getTime() <= now.getTime()) {
    next = new Date(now.getFullYear() + 1, source.getMonth(), source.getDate());
  }
  return next;
}

export function ageParts(birthDate: string, now: Date) {
  const birth = new Date(birthDate + "T00:00:00");

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years,
    months,
    days,
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  };
}

export function timeParts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}
