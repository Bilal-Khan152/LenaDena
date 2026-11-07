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

      <Text style={styles.label}>Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Ali, Hassan bhai, Office wala Ahmed"
        placeholderTextColor={colors.muted}
        value={name}
        onChangeText={setName}
        autoFocus
      />

      <Text style={styles.label}>Phone (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="03xx xxxxxxx"
        placeholderTextColor={colors.muted}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Small note (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Cousin, office friend, neighbour..."
        placeholderTextColor={colors.muted}
        value={note}
        onChangeText={setNote}
      />

      <Pressable style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save and add first entry →</Text>
      </Pressable>
      <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.page },
  hint: { fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: "700", color: colors.ink, marginTop: 16, marginBottom: 7 },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    borderRadius: radius.button, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 16, color: colors.ink,
  },
  saveBtn: {
    backgroundColor: colors.ink, borderRadius: radius.button,
    paddingVertical: 15, alignItems: "center", marginTop: 26,
  },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cancelBtn: { alignItems: "center", paddingVertical: 14 },
  cancelText: { color: colors.muted, fontWeight: "600" },
});
