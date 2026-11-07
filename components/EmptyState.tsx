import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { BookOpen, UserPlus } from "lucide-react-native";
import { colors, radius } from "../constants/theme";

export function EmptyState() {
  const router = useRouter();
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <BookOpen size={30} color={colors.gold} strokeWidth={1.8} />
      </View>
      <Text style={styles.title}>Your book is empty</Text>
      <Text style={styles.body}>
        Every book starts with one name. Add the first person and write
        down the amount while it is still fresh in your mind.
      </Text>
      <Pressable style={styles.button} onPress={() => router.push("/add-person")}>
        <UserPlus size={17} color={colors.goldDark} strokeWidth={2.4} />
        <Text style={styles.buttonText}>Add your first person</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingHorizontal: 28, paddingTop: 40 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.line,
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.ink, marginTop: 16 },
  body: { fontSize: 14, color: colors.muted, textAlign: "center", lineHeight: 21, marginTop: 8 },
  button: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.gold, borderRadius: radius.button,
    paddingHorizontal: 20, paddingVertical: 13, marginTop: 20,
  },
  buttonText: { color: colors.goldDark, fontWeight: "800", fontSize: 15 },
});
