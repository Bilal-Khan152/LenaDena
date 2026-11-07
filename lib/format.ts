// Small helpers, written the way a person would say it out loud.

export function formatMoney(value: number): string {
  const abs = Math.abs(Math.round(value));
  return "Rs " + abs.toLocaleString("en-PK");
}

export function balanceLabel(balance: number): string {
  if (balance > 0) return `${formatMoney(balance)} to get`;
  if (balance < 0) return `${formatMoney(balance)} to give`;
  return "Settled";
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function prettyDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function daysSince(iso: string): number {
  const then = new Date(iso + "T00:00:00").getTime();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.max(0, Math.floor((startOfToday - then) / 86400000));
}

export function ageText(iso: string): string {
  const days = daysSince(iso);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "about a month ago" : `about ${months} months ago`;
}

export function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] || full;
}
