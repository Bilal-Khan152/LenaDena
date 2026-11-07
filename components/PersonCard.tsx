import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";
import { ageText, balanceLabel } from "../lib/format";
import type { PersonWithBalance } from "../lib/types";

export function PersonCard({ person }: { person: PersonWithBalance }) {
  const router = useRouter();
  const settled = person.balance === 0;
  const owesYou = person.balance > 0;

  return (
    <Pressable
      onPress={() => router.push(`/person/${person.id}` as any)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {person.name.trim().charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.name} numberOfLines={1}>{person.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {person.entryCount === 0
            ? "No entries yet"
            : person.lastEntryAt
              ? `Last entry ${ageText(person.lastEntryAt)}${person.lastNote ? ` · ${person.lastNote}` : ""}`
              : ""}
        </Text>
      </View>
      <View
        style={[
          styles.pill,
          settled ? styles.pillSettled : owesYou ? styles.pillGet : styles.pillGive,
        ]}
      >
        <Text
          style={[
            styles.pillText,
            settled ? styles.textSettled : owesYou ? styles.textGet : styles.textGive,
          ]}
        >
          {balanceLabel(person.balance)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  pressed: { opacity: 0.75 },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.goldSoft,
    borderWidth: 1, borderColor: "#3A2F16",
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: colors.gold },
  middle: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: colors.ink },
  sub: { fontSize: 13, color: colors.muted, marginTop: 2 },
  pill: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  pillGet: { backgroundColor: colors.greenSoft },
  pillGive: { backgroundColor: colors.redSoft },
  pillSettled: { backgroundColor: colors.settledSoft },
  pillText: { fontSize: 12, fontWeight: "700" },
  textGet: { color: colors.green },
  textGive: { color: colors.red },
  textSettled: { color: colors.settled },
});
