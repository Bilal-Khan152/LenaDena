import { ageText, firstName, formatMoney } from "./format";
import type { PersonWithBalance } from "./types";

export type NextStep = {
  title: string;
  body: string;
  cta: string;
  // A real route in the app. Tapping the card does this, nothing else.
  href: string;
};

// The brain of the home screen. LenaDena looks at where you are
// and suggests the ONE thing that makes sense next — so a new
// user never stares at an empty app wondering what to press.
//
// Order matters: first match wins.
export function getNextStep(
  people: PersonWithBalance[],
  oldestOpen: { personId: number; personName: string; entryDate: string } | null,
  oldAfterDays = 30
): NextStep {
  // 1. Brand new user.
  if (people.length === 0) {
    return {
      title: "Start with one person",
      body: "Who did you last lend money to, or borrow from? Add them first — everything else follows from there.",
      cta: "Add your first person",
      href: "/add-person",
    };
  }

  // 2. People exist, but nobody has an entry yet.
  const withoutEntries = people.find((p) => p.entryCount === 0);
  if (withoutEntries && people.every((p) => p.entryCount === 0)) {
    return {
      title: `Add the first entry for ${firstName(withoutEntries.name)}`,
      body: "Tap gave or took, write the amount. That is the whole job.",
      cta: "Add an entry",
      href: `/add-entry?personId=${withoutEntries.id}`,
    };
  }
  if (withoutEntries) {
    return {
      title: `${firstName(withoutEntries.name)} has no entries yet`,
      body: "You added them but wrote nothing down. Add the amount while you still remember it.",
      cta: "Add an entry",
      href: `/add-entry?personId=${withoutEntries.id}`,
    };
  }

  // 3. Everything is settled. Rare, and worth enjoying.
  const open = people.filter((p) => p.balance !== 0);
  if (open.length === 0) {
    return {
      title: "All settled. Nice and clean.",
      body: "Nobody owes anybody anything right now. Next time money moves, write it here in ten seconds.",
      cta: "Add a new entry",
      href: "/add-entry",
    };
  }

  // 4. An old open balance — the gentle reminder case.
  if (oldestOpen) {
    const days = Math.floor(
      (Date.now() - new Date(oldestOpen.entryDate + "T00:00:00").getTime()) / 86400000
    );
    if (days >= oldAfterDays) {
      const person = people.find((p) => p.id === oldestOpen.personId);
      return {
        title: `The balance with ${firstName(oldestOpen.personName)} is getting old`,
        body: `Open since ${ageText(oldestOpen.entryDate)}${
          person ? ` — ${formatMoney(person.balance)} still open` : ""
        }. A soft reminder now is easier than a hard one later.`,
        cta: "Open and share a reminder",
        href: `/person/${oldestOpen.personId}`,
      };
    }
  }

  // 5. Normal day: point at the biggest open balance.
  const biggest = [...open].sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))[0];
  return {
    title:
      biggest.balance > 0
        ? `${firstName(biggest.name)} is top of the list`
        : `You owe ${firstName(biggest.name)} the most`,
    body:
      biggest.balance > 0
        ? `${formatMoney(biggest.balance)} to get back. Open the page to see the full history or share a summary.`
        : `${formatMoney(biggest.balance)} to give back. Settle it and the list gets shorter.`,
    cta: "Open history",
    href: `/person/${biggest.id}`,
  };
}
