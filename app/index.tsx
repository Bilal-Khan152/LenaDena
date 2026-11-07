import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  ArrowDownCircle, ArrowUpCircle, ListPlus, Lock, Plus, UserPlus,
} from "lucide-react-native";
import { EmptyState } from "../components/EmptyState";
import { LogoLockup } from "../components/Logo";
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
  const [oldestOpen, setOldestOpen] = useState<ReturnType<typeof getOldestOpenEntry>>(null);

  // Reload every time the screen comes back into view.
  // Add a person, come back, the list is already right.
  // All database reads live here, never during render.
  useFocusEffect(
    useCallback(() => {
      setPeople(getPeopleWithBalances());
      setOldestOpen(getOldestOpenEntry());
    }, [])
  );

  const toGet = people.reduce((s, p) => s + (p.balance > 0 ? p.balance : 0), 0);
  const toGive = people.reduce((s, p) => s + (p.balance < 0 ? -p.balance : 0), 0);
  const step = getNextStep(people, oldestOpen);

  return (
    <View style={styles.screen}>
      <FlatList
        data={people}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          <View>
            <View style={styles.brandRow}>
              <LogoLockup />
            </View>
            <View style={styles.privacyRow}>
              <Lock size={12} color={colors.faint} strokeWidth={2.4} />
              <Text style={styles.privacy}>
                Private by design. Everything stays on this phone.
              </Text>
            </View>

            {people.length > 0 && (
              <View style={styles.totalsRow}>
                <View style={styles.totalCard}>
                  <View style={styles.totalHead}>
                    <ArrowDownCircle size={15} color={colors.green} strokeWidth={2.2} />
                    <Text style={styles.totalLabel}>TO RECEIVE</Text>
                  </View>
                  <Text style={[styles.totalValue, { color: colors.green }]}>
                    {formatMoney(toGet)}
                  </Text>
                </View>
                <View style={styles.totalCard}>
                  <View style={styles.totalHead}>
                    <ArrowUpCircle size={15} color={colors.red} strokeWidth={2.2} />
                    <Text style={styles.totalLabel}>TO GIVE BACK</Text>
                  </View>
                  <Text style={[styles.totalValue, { color: colors.red }]}>
                    {formatMoney(toGive)}
                  </Text>
                </View>
              </View>
            )}

            <NextStepCard step={step} />

            {people.length > 0 && (
              <View style={styles.quickRow}>
                <Pressable style={styles.quickBtn} onPress={() => router.push("/add-person")}>
                  <UserPlus size={16} color={colors.ink} strokeWidth={2.2} />
                  <Text style={styles.quickText}>Add person</Text>
                </Pressable>
                <Pressable style={styles.quickBtn} onPress={() => router.push("/add-entry")}>
                  <ListPlus size={16} color={colors.ink} strokeWidth={2.2} />
                  <Text style={styles.quickText}>Add entry</Text>
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
        <Pressable style={styles.fab} onPress={() => router.push("/add-entry")}>
          <Plus size={28} color={colors.goldDark} strokeWidth={2.6} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  listContent: { paddingHorizontal: spacing.page, paddingBottom: 110, paddingTop: 18 },
  brandRow: { marginTop: 6 },
  privacyRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10 },
  privacy: { fontSize: 12, color: colors.faint },
  totalsRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  totalCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.card,
    padding: 15, borderWidth: 1, borderColor: colors.line,
  },
  totalHead: { flexDirection: "row", alignItems: "center", gap: 6 },
  totalLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1, color: colors.muted },
  totalValue: { fontSize: 21, fontWeight: "800", marginTop: 7 },
  quickRow: { flexDirection: "row", gap: 10, marginTop: 14, marginHorizontal: spacing.page },
  quickBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingVertical: 12,
  },
  quickText: { fontWeight: "700", color: colors.ink, fontSize: 14 },
  sectionTitle: {
    fontSize: 13, fontWeight: "700", letterSpacing: 1.2, color: colors.muted,
    marginTop: 22, marginBottom: 10,
  },
  fab: {
    position: "absolute", right: 20, bottom: 26,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: colors.gold, alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
});
