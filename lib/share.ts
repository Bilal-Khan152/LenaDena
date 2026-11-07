import { Share } from "react-native";
import { balanceLabel, formatMoney, prettyDate } from "./format";
import type { Entry, PersonWithBalance } from "./types";

// One clean text block. It opens the share sheet, so the user
// picks WhatsApp themselves. No special WhatsApp code needed.

export function buildSummary(
  person: PersonWithBalance,
  entries: Entry[]
): string {
  const lines: string[] = [`LenaDena summary for ${person.name}`, ""];
  const recent = [...entries].slice(0, 8).reverse();
  for (const e of recent) {
    const what =
      e.kind === "gave" ? "Gave" : e.kind === "took" ? "Took" : "Settled";
    lines.push(
      `${prettyDate(e.entryDate)}: ${what} ${formatMoney(e.amount)}${e.note ? ` (${e.note})` : ""}`
    );
  }
  lines.push("", `Balance: ${balanceLabel(person.balance)}`);
  return lines.join("\n");
}

export async function shareSummary(person: PersonWithBalance, entries: Entry[]) {
  await Share.share({ message: buildSummary(person, entries) });
}

export async function shareReminder(person: PersonWithBalance) {
  const text =
    person.balance > 0
      ? `Hi ${person.name}, hope you are well. Just a small reminder from my LenaDena book: ${formatMoney(person.balance)} is still open from our side. No rush, just keeping the record clear for both of us.`
      : `Hi ${person.name}, a note from my LenaDena book: I still have ${formatMoney(person.balance)} to give you back. Reminding myself here so I do not forget.`;
  await Share.share({ message: text });
}
