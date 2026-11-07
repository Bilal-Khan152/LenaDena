import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
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
      <Text style={styles.kicker}>YOUR NEXT STEP</Text>
      <Text style={styles.title}>{step.title}</Text>
      <Text style={styles.body}>{step.body}</Text>
      <View style={styles.ctaRow}>
        <Text style={styles.cta}>{step.cta}</Text>
        <Text style={styles.arrow}>→</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.card,
    padding: 18,
    marginHorizontal: spacing.page,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#F3DFA7",
  },
  pressed: { opacity: 0.85 },
  kicker: { fontSize: 11, fontWeight: "700", letterSpacing: 1.2, color: colors.accent },
  title: { fontSize: 19, fontWeight: "700", color: colors.ink, marginTop: 6, lineHeight: 25 },
  body: { fontSize: 14, color: "#5C554B", marginTop: 6, lineHeight: 20 },
  ctaRow: { flexDirection: "row", alignItems: "center", marginTop: 12, gap: 6 },
  cta: { fontSize: 15, fontWeight: "700", color: colors.ink },
  arrow: { fontSize: 16, fontWeight: "700", color: colors.ink },
});
