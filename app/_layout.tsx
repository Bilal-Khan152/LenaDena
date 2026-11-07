import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initDb } from "../lib/db";
import { colors } from "../constants/theme";

// One stack for the whole app. Add-person and add-entry open as
// sheets (modal) so the user never feels lost. One back tap and
// they are home again. Person detail pushes in normally.
export default function RootLayout() {
  useEffect(() => {
    initDb();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "700", color: colors.ink },
          headerTintColor: colors.ink,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-person"
          options={{ title: "Add a person", presentation: "modal" }}
        />
        <Stack.Screen
          name="add-entry"
          options={{ title: "Add an entry", presentation: "modal" }}
        />
        <Stack.Screen name="person/[id]" options={{ title: "History" }} />
      </Stack>
    </>
  );
}
