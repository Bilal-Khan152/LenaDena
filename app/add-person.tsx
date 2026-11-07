import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, spacing } from "../constants/theme";
import { addPerson } from "../lib/db";

export default function AddPersonScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  function save() {
    if (!name.trim()) {
      Alert.alert("Name is missing", "Write the person's name first.");
      return;
    }
    const id = addPerson(name, phone, note);
    // The app decides the next step: a new person with no entry
    // is a dead end, so go straight to their first entry.
    // The user can skip it on the next screen if they want.
    router.replace(`/add-entry?personId=${id}` as any);
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.hint}>
        Just a name is enough. Phone and note are only if you want them.
      </Text>

      <Text style={styles.label}>NAME</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Ali, Hassan bhai, Office wala Ahmed"
        placeholderTextColor={colors.faint}
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={styles.label}>PHONE (OPTIONAL)</Text>
      <TextInput
        style={styles.input}
        placeholder="03xx xxxxxxx"
        placeholderTextColor={colors.faint}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>SMALL NOTE (OPTIONAL)</Text>
      <TextInput
        style={styles.input}
        placeholder="Cousin, office friend, neighbour..."
        placeholderTextColor={colors.faint}
        value={note}
        onChangeText={setNote}
      />

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save and add first entry</Text>
      </Pressable>
      <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.page },
  hint: { fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 6 },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 1.1, color: colors.muted, marginTop: 18, marginBottom: 7 },
  input: {
    backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 16, color: colors.ink,
  },
  saveBtn: {
    backgroundColor: colors.gold, borderRadius: radius.button,
    paddingVertical: 15, alignItems: "center", marginTop: 28,
  },
  saveText: { color: colors.goldDark, fontWeight: "800", fontSize: 15 },
  cancelBtn: { alignItems: "center", paddingVertical: 14 },
  cancelText: { color: colors.muted, fontWeight: "600" },
});
