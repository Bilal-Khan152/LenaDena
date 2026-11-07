import { useMemo, useState } from "react";
import {
  Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react-native";
import { colors, radius, spacing } from "../constants/theme";
import { addEntry, getPeopleWithBalances } from "../lib/db";
import { todayISO } from "../lib/format";

// This screen is reachable from everywhere: home button, a person
// page, the next-step card. If no person is picked yet, it shows
// a simple picker first, so the user is never stuck.
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
          <Text style={styles.saveText}>Add a person first</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>WHO IS THIS FOR?</Text>
      {person ? (
        <Pressable style={styles.picked} onPress={() => setPersonId(null)}>
          <Text style={styles.pickedText}>{person.name}</Text>
          <Text style={styles.changeText}>Change</Text>
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

      <Text style={styles.label}>WHAT HAPPENED?</Text>
      <View style={styles.toggleRow}>
        <Pressable
          style={[styles.toggle, kind === "gave" && styles.toggleGave]}
          onPress={() => setKind("gave")}
        >
          <ArrowUpRight
            size={22}
            color={kind === "gave" ? colors.green : colors.muted}
            strokeWidth={2.4}
          />
          <Text style={styles.toggleText}>I gave</Text>
          <Text style={styles.toggleSub}>They owe me</Text>
        </Pressable>
        <Pressable
          style={[styles.toggle, kind === "took" && styles.toggleTook]}
          onPress={() => setKind("took")}
        >
          <ArrowDownLeft
            size={22}
            color={kind === "took" ? colors.red : colors.muted}
            strokeWidth={2.4}
          />
          <Text style={styles.toggleText}>I took</Text>
          <Text style={styles.toggleSub}>I owe them</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>AMOUNT (RS)</Text>
      <TextInput
        style={styles.amountInput}
        placeholder="2000"
        placeholderTextColor={colors.faint}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>NOTE (OPTIONAL)</Text>
      <TextInput
        style={styles.input}
        placeholder="For petrol, till salary, lunch..."
        placeholderTextColor={colors.faint}
        value={note}
        onChangeText={setNote}
      />

      <Text style={styles.label}>DATE</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="2026-11-08"
        placeholderTextColor={colors.faint}
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
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 1.1, color: colors.muted, marginTop: 18, marginBottom: 7 },
  picker: { maxHeight: 180, backgroundColor: colors.surface, borderRadius: radius.button, borderWidth: 1, borderColor: colors.line },
  pickerRow: { paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.line },
  pickerName: { fontSize: 15, color: colors.ink, fontWeight: "600" },
  picked: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: colors.goldSoft, borderRadius: radius.button, padding: 14,
    borderWidth: 1, borderColor: "#3A2F16",
  },
  pickedText: { fontSize: 16, fontWeight: "700", color: colors.ink },
  changeText: { fontSize: 13, fontWeight: "700", color: colors.gold },
  toggleRow: { flexDirection: "row", gap: 10 },
  toggle: {
    flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, padding: 14, gap: 4,
  },
  toggleGave: { backgroundColor: colors.greenSoft, borderColor: colors.green },
  toggleTook: { backgroundColor: colors.redSoft, borderColor: colors.red },
  toggleText: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 4 },
  toggleSub: { fontSize: 12, color: colors.muted },
  amountInput: {
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 24, fontWeight: "800", color: colors.ink,
  },
  input: {
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 16, color: colors.ink,
  },
  saveBtn: {
    backgroundColor: colors.gold, borderRadius: radius.button,
    paddingVertical: 15, alignItems: "center", marginTop: 28,
  },
  saveText: { color: colors.goldDark, fontWeight: "800", fontSize: 15 },
  cancelBtn: { alignItems: "center", paddingVertical: 14 },
  cancelText: { color: colors.muted, fontWeight: "600" },
});
