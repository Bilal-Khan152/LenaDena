import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight, Compass } from "lucide-react-native";
import { colors, radius, spacing } from "../constants/theme";
import type { NextStep } from "../lib/nextStep";

// The guide card at the top of home. Always one clear next step,
// always tappable. This is what makes the app feel like it
// understands the user instead of just listing data.
export function NextStepCard({ step }: { step: NextStep }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(step.href as any)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.head}>
        <View style={styles.iconCircle}>
          <Compass size={17} color={colors.gold} strokeWidth={2.2} />
        </View>
        <Text style={styles.kicker}>YOUR NEXT STEP</Text>
      </View>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.body}>{step.body}</Text>
      <View style={styles.ctaRow}>
        <Text style={styles.cta}>{step.cta}</Text>
        <ChevronRight size={17} color={colors.gold} strokeWidth={2.5} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.goldSoft,
    borderRadius: radius.card,
    padding: 18,
    marginHorizontal: spacing.page,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#3A2F16",
  },
  pressed: { opacity: 0.85 },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#3A2F16",
    alignItems: "center", justifyContent: "center",
  },
  kicker: { fontSize: 11, fontWeight: "700", letterSpacing: 1.4, color: colors.gold },
  title: { fontSize: 19, fontWeight: "700", color: colors.ink, marginTop: 10, lineHeight: 25 },
  body: { fontSize: 14, color: "#CFC9BB", marginTop: 6, lineHeight: 20 },
  ctaRow: { flexDirection: "row", alignItems: "center", marginTop: 13, gap: 3 },
  cta: { fontSize: 15, fontWeight: "700", color: colors.gold },
});
