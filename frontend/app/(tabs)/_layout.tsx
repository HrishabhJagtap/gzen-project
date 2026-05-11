import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";
import { colors } from "../../src/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: "rgba(10, 14, 23, 0.95)",
          borderTopColor: colors.border.medium,
          borderTopWidth: 1,
          height: 78,
          paddingTop: 10,
          paddingBottom: 18,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, focused }) => {
          const map: Record<string, [string, string]> = {
            home: ["home-outline", "home"],
            insights: ["pie-chart-outline", "pie-chart"],
            focus: ["scan-outline", "scan"],
            learn: ["book-outline", "book"],
            profile: ["person-outline", "person"],
          };
          const [out, fill] = map[route.name] ?? ["ellipse-outline", "ellipse"];
          return (
            <View style={focused ? styles.activeIconWrap : undefined}>
              <Ionicons
                name={(focused ? fill : out) as any}
                size={focused ? 22 : 22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="insights" options={{ title: "Insights" }} />
      <Tabs.Screen name="focus" options={{ title: "Focus" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconWrap: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
