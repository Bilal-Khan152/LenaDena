import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowDownLeft, ArrowUpRight, BadgeCheck, BellRing, CircleCheck, Plus, Share2,
} from "lucide-react-native";
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
                      ? { color: colors.green }
                      : { color: colors.red },
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
                <Plus size={16} color={colors.goldDark} strokeWidth={2.6} />
                <Text style={styles.primaryText}>Add entry</Text>
              </Pressable>
              {!settled && (
                <Pressable style={styles.softBtn} onPress={confirmSettle}>
                  <BadgeCheck size={16} color={colors.ink} strokeWidth={2.2} />
                  <Text style={styles.softText}>Settle up</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.softBtn} onPress={() => shareSummary(person, entries)}>
                <Share2 size={16} color={colors.ink} strokeWidth={2.2} />
                <Text style={styles.softText}>Share summary</Text>
              </Pressable>
              {!settled && (
                <Pressable style={styles.softBtn} onPress={() => shareReminder(person)}>
                  <BellRing size={16} color={colors.ink} strokeWidth={2.2} />
                  <Text style={styles.softText}>Send reminder</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.sectionTitle}>HISTORY</Text>
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
            <View style={styles.entryLeft}>
              <View style={styles.entryIcon}>
                {item.kind === "gave" ? (
                  <ArrowUpRight size={16} color={colors.green} strokeWidth={2.4} />
                ) : item.kind === "took" ? (
                  <ArrowDownLeft size={16} color={colors.red} strokeWidth={2.4} />
                ) : (
                  <CircleCheck size={16} color={colors.settled} strokeWidth={2.4} />
                )}
              </View>
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
    backgroundColor: colors.surface, borderRadius: radius.card, padding: 20,
    borderWidth: 1, borderColor: colors.line, alignItems: "center",
  },
  avatar: {
    width: 58, height: 58, borderRadius: 29, backgroundColor: colors.goldSoft,
    borderWidth: 1, borderColor: "#3A2F16",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "800", color: colors.gold },
  name: { fontSize: 21, fontWeight: "800", color: colors.ink, marginTop: 10 },
  muted: { fontSize: 13, color: colors.muted, marginTop: 3 },
  balance: { fontSize: 18, fontWeight: "800", marginTop: 8 },
  actions: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: colors.gold, borderRadius: radius.button, paddingVertical: 13,
  },
  primaryText: { color: colors.goldDark, fontWeight: "800", fontSize: 14 },
  softBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingVertical: 13,
  },
  softText: { fontWeight: "700", color: colors.ink, fontSize: 14 },
  sectionTitle: { fontSize: 12, fontWeight: "700", letterSpacing: 1.2, color: colors.muted, marginTop: 24, marginBottom: 10 },
  entryRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start",
    backgroundColor: colors.surface, borderRadius: 14, padding: 13,
    borderWidth: 1, borderColor: colors.line,
  },
  entryLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  entryIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface2,
    alignItems: "center", justifyContent: "center",
  },
  entryTitle: { fontSize: 15, fontWeight: "600", color: colors.ink },
  entryDate: { fontSize: 12, color: colors.faint },
});
