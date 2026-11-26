import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="host-run"
        options={{ headerShown: true, title: "Host A Run" }}
      />
      <Stack.Screen
        name="stopwatch"
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          title: "Stopwatch",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{ headerShown: true, title: "Settings" }}
      />
    </Stack>
  );
}
