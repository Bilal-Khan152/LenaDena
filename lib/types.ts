export type EntryKind = "gave" | "took" | "settled";

export type Person = {
  id: number;
  name: string;
  phone: string | null;
  note: string | null;
  createdAt: string;
};

export type PersonWithBalance = Person & {
  // Positive = this person owes you. Negative = you owe them. 0 = settled.
  balance: number;
  entryCount: number;
  lastEntryAt: string | null;
  lastNote: string | null;
};

export type Entry = {
  id: number;
  personId: number;
  kind: EntryKind;
  amount: number; // always positive, as written by the user
  signedAmount: number; // gave: +, took: -, settled: closes the balance
  note: string | null;
  entryDate: string; // YYYY-MM-DD, the day it really happened
  createdAt: string;
};
