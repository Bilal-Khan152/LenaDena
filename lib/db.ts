import * as SQLite from "expo-sqlite";
import type { Entry, EntryKind, PersonWithBalance } from "./types";

// Everything lives in one small file on the phone: lenadena.db
// No account, no server. Delete the app, the data is gone —
// that privacy is the whole point of LenaDena.

const db = SQLite.openDatabaseSync("lenadena.db");

export function initDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      note TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      person_id INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
      kind TEXT NOT NULL CHECK (kind IN ('gave', 'took', 'settled')),
      amount REAL NOT NULL,
      signed_amount REAL NOT NULL,
      note TEXT,
      entry_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_entries_person ON entries(person_id);
  `);
}

export function addPerson(name: string, phone?: string, note?: string): number {
  const result = db.runSync(
    "INSERT INTO people (name, phone, note) VALUES (?, ?, ?)",
    [name.trim(), phone?.trim() || null, note?.trim() || null]
  );
  return Number(result.lastInsertRowId);
}

export function getPeopleWithBalances(): PersonWithBalance[] {
  const rows = db.getAllSync<any>(
    `SELECT p.id, p.name, p.phone, p.note, p.created_at AS createdAt,
       COALESCE(SUM(e.signed_amount), 0) AS balance,
       COUNT(e.id) AS entryCount,
       MAX(e.entry_date) AS lastEntryAt,
       (SELECT note FROM entries WHERE person_id = p.id ORDER BY entry_date DESC, id DESC LIMIT 1) AS lastNote
     FROM people p
     LEFT JOIN entries e ON e.person_id = p.id
     GROUP BY p.id
     ORDER BY (balance = 0), ABS(balance) DESC, p.name COLLATE NOCASE`
  );
  return rows.map((r) => ({ ...r, balance: Number(r.balance) || 0 }));
}

export function getPerson(id: number): PersonWithBalance | null {
  const all = getPeopleWithBalances();
  return all.find((p) => p.id === id) ?? null;
}

export function getEntriesForPerson(personId: number): Entry[] {
  const rows = db.getAllSync<any>(
    `SELECT id, person_id AS personId, kind, amount, signed_amount AS signedAmount,
            note, entry_date AS entryDate, created_at AS createdAt
     FROM entries WHERE person_id = ?
     ORDER BY entry_date DESC, id DESC`,
    [personId]
  );
  return rows.map((r) => ({
    ...r,
    amount: Number(r.amount),
    signedAmount: Number(r.signedAmount),
  }));
}

export function getBalance(personId: number): number {
  const row = db.getFirstSync<{ balance: number }>(
    "SELECT COALESCE(SUM(signed_amount), 0) AS balance FROM entries WHERE person_id = ?",
    [personId]
  );
  return Number(row?.balance) || 0;
}

export function addEntry(
  personId: number,
  kind: Exclude<EntryKind, "settled">,
  amount: number,
  note: string | undefined,
  entryDate: string
) {
  const signed = kind === "gave" ? amount : -amount;
  db.runSync(
    `INSERT INTO entries (person_id, kind, amount, signed_amount, note, entry_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [personId, kind, amount, signed, note?.trim() || null, entryDate]
  );
}

// Settle up = write one closing entry that brings the balance to zero.
// The history stays honest: you can still see everything before it.
export function settleUp(personId: number) {
  const balance = getBalance(personId);
  if (balance === 0) return;
  const today = new Date().toISOString().slice(0, 10);
  db.runSync(
    `INSERT INTO entries (person_id, kind, amount, signed_amount, note, entry_date)
     VALUES (?, 'settled', ?, ?, 'Settled up', ?)`,
    [personId, Math.abs(balance), -balance, today]
  );
}

// The oldest still-open entry, used by the next-step guide
// to gently surface "this balance is getting old".
export function getOldestOpenEntry(): {
  personId: number;
  personName: string;
  entryDate: string;
  amount: number;
} | null {
  const row = db.getFirstSync<any>(
    `SELECT e.person_id AS personId, p.name AS personName,
            e.entry_date AS entryDate, e.amount
     FROM entries e JOIN people p ON p.id = e.person_id
     WHERE e.kind != 'settled'
       AND (SELECT COALESCE(SUM(signed_amount), 0) FROM entries WHERE person_id = p.id) != 0
     ORDER BY e.entry_date ASC LIMIT 1`
  );
  return row ?? null;
}
