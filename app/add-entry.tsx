import { useMemo, useState } from "react";
import {
  Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius, spacing } from "../constants/theme";
import { addEntry, getPeopleWithBalances } from "../lib/db";
import { todayISO } from "../lib/format";

// This screen is reachable from everywhere: home FAB, a person
// page, the next-step card. If no person is picked yet, it shows
// a simple picker first — the user is never stuck.
export default function AddEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ personId?: string }>();
  const people = useMemo(() => getPeopleWithBalances(), []);

  const [personId, setPersonId] = useState<number | null>(
    params.personId ? Number(params.personId) : null
  );
  const [kind, setKind] = useState<"gave" | "took">("gave");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  const person = people.find((p) => p.id === personId) ?? null;

  function save() {
    if (!personId) {
      Alert.alert("Pick a person", "Choose who this entry is for first.");
      return;
    }
    const value = Number(amount.replace(/[^0-9.]/g, ""));
    if (!value || value <= 0) {
      Alert.alert("Amount is missing", "Write the amount, e.g. 2000.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert("Check the date", "Use the format 2026-11-08.");
      return;
    }
    addEntry(personId, kind, value, note, date);
    // Land on the person's page so the user sees the new balance
    // with their own eyes. That small proof builds trust.
    router.replace(`/person/${personId}` as any);
  }

  // No people at all? Send them to add a person first.
  if (people.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.hint}>
          You need a person before an entry. One tap and you are there.
        </Text>
        <Pressable
          style={styles.saveBtn}
          onPress={() => router.replace("/add-person")}
        >
          <Text style={styles.saveText}>Add a person first →</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Who is this for?</Text>
      {person ? (
        <Pressable style={styles.picked} onPress={() => setPersonId(null)}>
          <Text style={styles.pickedText}>{person.name}</Text>
          <Text style={styles.changeText}>change</Text>
        </Pressable>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(p) => String(p.id)}
          style={styles.picker}
          renderItem={({ item }) => (
            <Pressable style={styles.pickerRow} onPress={() => setPersonId(item.id)}>
              <Text style={styles.pickerName}>{item.name}</Text>
            </Pressable>
          )}
        />
      )}

      <Text style={styles.label}>What happened?</Text>
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggle, kind === "gave" && styles.toggleGave]}
          onPress={() => setKind("gave")}
        >
          <Text style={[styles.toggleText, kind === "gave" && styles.toggleTextOn]}>
            I gave ↙
          </Text>
          <Text style={styles.toggleSub}>they owe me</Text>
        </Pressable>
        <Pressable
          style={[styles.toggle, kind === "took" && styles.toggleTook]}
          onPress={() => setKind("took")}
        >
          <Text style={[styles.toggleText, kind === "took" && styles.toggleTextOn]}>
            I took ↙
          </Text>
          <Text style={styles.toggleSub}>I owe them</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Amount (Rs) *</Text>
      <TextInput
        style={styles.amountInput}
        placeholder="2000"
        placeholderTextColor={colors.muted}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Note (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="For petrol, till salary, lunch..."
        placeholderTextColor={colors.muted}
        value={note}
        onChangeText={setNote}
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="2026-11-08"
        placeholderTextColor={colors.muted}
      />

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save entry</Text>
      </Pressable>
      <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.page },
  hint: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  label: { fontSize: 13, fontWeight: "700", color: colors.ink, marginTop: 16, marginBottom: 7 },
  picker: { maxHeight: 180, backgroundColor: colors.card, borderRadius: radius.button, borderWidth: 1, borderColor: colors.line },
  pickerRow: { paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.line },
  pickerName: { fontSize: 15, color: colors.ink, fontWeight: "600" },
  picked: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: colors.accentSoft, borderRadius: radius.button, padding: 14,
  },
  pickedText: { fontSize: 16, fontWeight: "700", color: colors.ink },
  changeText: { fontSize: 13, fontWeight: "700", color: colors.accent },
  toggleRow: { flexDirection: "row", gap: 10 },
  toggle: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, padding: 14,
  },
  toggleGave: { backgroundColor: colors.owesYouSoft, borderColor: colors.owesYou },
  toggleTook: { backgroundColor: colors.youOweSoft, borderColor: colors.youOwe },
  toggleText: { fontSize: 16, fontWeight: "700", color: colors.ink },
  toggleTextOn: { color: colors.ink },
  toggleSub: { fontSize: 12, color: colors.muted, marginTop: 3 },
  amountInput: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 22, fontWeight: "700", color: colors.ink,
  },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 16, color: colors.ink,
  },
  saveBtn: {
    backgroundColor: colors.ink, borderRadius: radius.button,
    paddingVertical: 15, alignItems: "center", marginTop: 26,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cancelBtn: { alignItems: "center", paddingVertical: 14 },
  cancelText: { color: colors.muted, fontWeight: "600" },
});
