import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/AuthContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#050505" }}>
      <SafeAreaProvider>
        <AuthProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#050505" },
            animation: "fade",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="goal-setup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="value-gate"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
          <Stack.Screen name="micro-task" options={{ animation: "fade" }} />
          <Stack.Screen name="access-granted" options={{ animation: "fade" }} />
          <Stack.Screen name="intent-mode" />
          <Stack.Screen name="app-control" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="rewards" />
          <Stack.Screen name="daily-summary" />
        </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
