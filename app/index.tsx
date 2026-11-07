import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { EmptyState } from "../components/EmptyState";
import { NextStepCard } from "../components/NextStepCard";
import { PersonCard } from "../components/PersonCard";
import { colors, radius, spacing } from "../constants/theme";
import { getOldestOpenEntry, getPeopleWithBalances } from "../lib/db";
import { formatMoney } from "../lib/format";
import { getNextStep } from "../lib/nextStep";
import type { PersonWithBalance } from "../lib/types";

export default function HomeScreen() {
  const router = useRouter();
  const [people, setPeople] = useState<PersonWithBalance[]>([]);

  // Reload every time the screen comes back into view.
  // Add a person, come back — the list is already right.
  useFocusEffect(
    useCallback(() => {
      setPeople(getPeopleWithBalances());
    }, [])
  );

  const toGet = people.reduce((s, p) => s + (p.balance > 0 ? p.balance : 0), 0);
  const toGive = people.reduce((s, p) => s + (p.balance < 0 ? -p.balance : 0), 0);
  const step = getNextStep(people, getOldestOpenEntry());

  return (
    <View style={styles.screen}>
      <FlatList
        data={people}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.hello}>Assalam-o-Alaikum 👋</Text>
            <Text style={styles.tagline}>
              Your money book. Everything stays on this phone.
            </Text>

            {people.length > 0 && (
              <View style={styles.totalsRow}>
                <View style={[styles.totalCard, { backgroundColor: colors.owesYouSoft }]}>
                  <Text style={styles.totalLabel}>TO GET BACK</Text>
                  <Text style={[styles.totalValue, { color: colors.owesYou }]}>
                    {formatMoney(toGet)}
                  </Text>
                </View>
                <View style={[styles.totalCard, { backgroundColor: colors.youOweSoft }]}>
                  <Text style={styles.totalLabel}>TO GIVE BACK</Text>
                  <Text style={[styles.totalValue, { color: colors.youOwe }]}>
                    {formatMoney(toGive)}
                  </Text>
                </View>
              </View>
            )}

            <NextStepCard step={step} />

            {people.length > 0 && (
              <View style={styles.quickRow}>
                <Pressable style={styles.quickBtn} onPress={() => router.push("/add-person")}>
                  <Text style={styles.quickText}>+ Add person</Text>
                </Pressable>
                <Pressable style={styles.quickBtn} onPress={() => router.push("/add-entry")}>
                  <Text style={styles.quickText}>+ Add entry</Text>
                </Pressable>
              </View>
            )}

            {people.length > 0 && (
              <Text style={styles.sectionTitle}>People</Text>
            )}
          </View>
        }
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => <PersonCard person={item} />}
      />

      {people.length > 0 && (
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/add-entry")}
        >
          <Text style={styles.fabText}>+</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  listContent: { paddingHorizontal: spacing.page, paddingBottom: 110 },
  hello: { fontSize: 26, fontWeight: "800", color: colors.ink, marginTop: 10 },
  tagline: { fontSize: 14, color: colors.muted, marginTop: 4 },
  totalsRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  totalCard: { flex: 1, borderRadius: radius.card, padding: 14 },
  totalLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.8, color: colors.muted },
  totalValue: { fontSize: 20, fontWeight: "800", marginTop: 5 },
  quickRow: { flexDirection: "row", gap: 10, marginTop: 14, marginHorizontal: spacing.page },
  quickBtn: {
    flex: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingVertical: 12, alignItems: "center",
  },
  quickText: { fontWeight: "700", color: colors.ink, fontSize: 14 },
  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: colors.ink,
    marginTop: 20, marginBottom: 10,
  },
  fab: {
    position: "absolute", right: 20, bottom: 26,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.ink, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 10, elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 30, fontWeight: "600", marginTop: -2 },
});
