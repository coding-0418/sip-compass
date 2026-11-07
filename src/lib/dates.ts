/**
 * All demo dates are derived from the real current date at render time —
 * never hardcoded — so the prototype can never show a "debited" date that
 * is in the future relative to whoever is actually viewing it.
 */

export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  const targetMonth = d.getMonth() + months;
  d.setMonth(targetMonth);
  return d;
}

export function daysBetween(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((to.getTime() - from.getTime()) / msPerDay);
}

const formatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" });

export function formatDate(date: Date): string {
  return formatter.format(date);
}

export function monthYearOf(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(date);
}

/** "Yesterday" / "3 days ago" / "2 months ago" / "On 9 March 2024" — always computed relative to real today. */
export function relativeLabel(date: Date, ref: Date = today()): string {
  const days = daysBetween(date, ref);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 18) return months === 1 ? "1 month ago" : `${months} months ago`;
  return `On ${formatDate(date)}`;
}
