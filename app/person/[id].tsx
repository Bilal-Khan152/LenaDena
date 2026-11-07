import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius, spacing } from "../../constants/theme";
import { getEntriesForPerson, getPerson, settleUp } from "../../lib/db";
import { balanceLabel, formatMoney, prettyDate } from "../../lib/format";
import { shareReminder, shareSummary } from "../../lib/share";
import type { Entry, PersonWithBalance } from "../../lib/types";

export default function PersonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const personId = Number(id);
  const [person, setPerson] = useState<PersonWithBalance | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  useFocusEffect(
    useCallback(() => {
      setPerson(getPerson(personId));
      setEntries(getEntriesForPerson(personId));
    }, [personId])
  );

  if (!person) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Person not found.</Text>
      </View>
    );
  }

  const settled = person.balance === 0;

  function confirmSettle() {
    Alert.alert(
      "Settle up?",
      `This will close the balance of ${formatMoney(person!.balance)} with ${person!.name}. The full history stays saved.`,
      [
        { text: "Not yet", style: "cancel" },
        {
          text: "Yes, settle it",
          onPress: () => {
            settleUp(personId);
            setPerson(getPerson(personId));
            setEntries(getEntriesForPerson(personId));
          },
        },
      ]
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={entries}
        keyExtractor={(e) => String(e.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.headCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {person.name.trim().charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.name}>{person.name}</Text>
              {person.note ? <Text style={styles.muted}>{person.note}</Text> : null}
              <Text
                style={[
                  styles.balance,
                  settled
                    ? { color: colors.settled }
                    : person.balance > 0
                      ? { color: colors.owesYou }
                      : { color: colors.youOwe },
                ]}
              >
                {balanceLabel(person.balance)}
              </Text>
            </View>

            {/* Actions follow the state: settled people do not
                need a settle button, open balances do. */}
            <View style={styles.actions}>
              <Pressable
                style={styles.primaryBtn}
                onPress={() => router.push(`/add-entry?personId=${person.id}` as any)}
              >
                <Text style={styles.primaryText}>+ Add entry</Text>
              </Pressable>
              {!settled && (
                <Pressable style={styles.softBtn} onPress={confirmSettle}>
                  <Text style={styles.softText}>Settle up</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.softBtn} onPress={() => shareSummary(person, entries)}>
                <Text style={styles.softText}>Share summary</Text>
              </Pressable>
              {!settled && (
                <Pressable style={styles.softBtn} onPress={() => shareReminder(person)}>
                  <Text style={styles.softText}>Send reminder</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.sectionTitle}>History</Text>
            {entries.length === 0 && (
              <Text style={styles.muted}>
                Nothing written yet. Add the first entry and this page fills up.
              </Text>
            )}
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View style={styles.entryRow}>
            <View>
              <Text style={styles.entryTitle}>
                {item.kind === "gave"
                  ? `Gave ${formatMoney(item.amount)}`
                  : item.kind === "took"
                    ? `Took ${formatMoney(item.amount)}`
                    : `Settled ${formatMoney(item.amount)}`}
              </Text>
              {item.note ? <Text style={styles.muted}>{item.note}</Text> : null}
            </View>
            <Text style={styles.entryDate}>{prettyDate(item.entryDate)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  listContent: { padding: spacing.page, paddingBottom: 40 },
  headCard: {
    backgroundColor: colors.card, borderRadius: radius.card, padding: 18,
    borderWidth: 1, borderColor: colors.line, alignItems: "center",
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accentSoft,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "800", color: colors.accent },
  name: { fontSize: 21, fontWeight: "800", color: colors.ink, marginTop: 10 },
  muted: { fontSize: 13, color: colors.muted, marginTop: 3 },
  balance: { fontSize: 18, fontWeight: "800", marginTop: 8 },
  actions: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryBtn: {
    flex: 1, backgroundColor: colors.ink, borderRadius: radius.button,
    paddingVertical: 13, alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  softBtn: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingVertical: 13, alignItems: "center",
  },
  softText: { fontWeight: "700", color: colors.ink, fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.ink, marginTop: 22, marginBottom: 10 },
  entryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    backgroundColor: colors.card, borderRadius: 12, padding: 13,
    borderWidth: 1, borderColor: colors.line,
  },
  entryTitle: { fontSize: 15, fontWeight: "600", color: colors.ink },
  entryDate: { fontSize: 12, color: colors.muted },
});
