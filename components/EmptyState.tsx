import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius } from "../constants/theme";

export function EmptyState() {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>📒</Text>
      <Text style={styles.title}>Your book is empty</Text>
      <Text style={styles.body}>
        No shame in that — every book starts with one name. Add the first
        person and write down the amount while it is fresh.
      </Text>
      <Pressable style={styles.button} onPress={() => router.push("/add-person")}>
        <Text style={styles.buttonText}>Add your first person</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingHorizontal: 28, paddingTop: 36 },
  emoji: { fontSize: 40 },
  title: { fontSize: 20, fontWeight: "700", color: colors.ink, marginTop: 12 },
  body: { fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 20, marginTop: 8 },
  button: {
    backgroundColor: colors.ink, borderRadius: radius.button,
    paddingHorizontal: 20, paddingVertical: 13, marginTop: 18,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
