import { StyleSheet, Text, View } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { colors } from "../constants/theme";

// The LenaDena mark: two arrows passing each other.
// Gold goes out (dena, giving), cream comes back (lena, taking).
// Same mark as the app icon, drawn here with icons so it stays
// sharp at any size.
export function LogoMark({ size = 44 }: { size?: number }) {
  const arrow = Math.round(size * 0.42);
  return (
    <View
      style={[
        styles.mark,
        { width: size, height: size, borderRadius: Math.round(size * 0.28) },
      ]}
    >
      <ArrowRight size={arrow} color={colors.gold} strokeWidth={3} style={styles.top} />
      <ArrowLeft size={arrow} color={colors.ink} strokeWidth={3} style={styles.bottom} />
    </View>
  );
}

export function LogoLockup() {
  return (
    <View style={styles.row}>
      <LogoMark />
      <View>
        <Text style={styles.name}>LenaDena</Text>
        <Text style={styles.tag}>LEN DENA, RECORDED CLEAN</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  top: { marginBottom: -7 },
  bottom: { marginTop: -7 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontSize: 22, fontWeight: "800", color: colors.ink, letterSpacing: 0.2 },
  tag: { fontSize: 9, fontWeight: "700", letterSpacing: 1.6, color: colors.faint, marginTop: 2 },
});
