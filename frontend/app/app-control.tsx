import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../src/components/ScreenHeader";
import PrimaryButton from "../src/components/PrimaryButton";
import AmbientGlow from "../src/components/AmbientGlow";
import { mockApps } from "../src/data/mock";
import { colors, spacing, radius } from "../src/theme";

export default function AppControl() {
  const [tab, setTab] = useState<"apps" | "features">("apps");
  const [appsState, setAppsState] = useState(
    mockApps.reduce((acc, a) => ({ ...acc, [a.id]: a.blocked }), {} as Record<string, boolean>)
  );

  return (
    <SafeAreaView style={styles.container} testID="app-control-screen">
      <AmbientGlow size={350} top={-150} left={-80} opacity={0.16} />
      <ScreenHeader title="App Control" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>App Control</Text>
        <Text style={styles.subtitle}>Customize what you want to block.</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            testID="app-tab-apps"
            style={[styles.tab, tab === "apps" && styles.tabActive]}
            onPress={() => setTab("apps")}
          >
            <Text style={[styles.tabText, tab === "apps" && styles.tabTextActive]}>Apps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="app-tab-features"
            style={[styles.tab, tab === "features" && styles.tabActive]}
            onPress={() => setTab("features")}
          >
            <Text style={[styles.tabText, tab === "features" && styles.tabTextActive]}>
              Features
            </Text>
          </TouchableOpacity>
        </View>

        {mockApps.map((app) => (
          <View key={app.id} style={styles.row} testID={`app-row-${app.id}`}>
            <View style={[styles.iconBox, { backgroundColor: app.color + "22" }]}>
              <Ionicons
                name={app.icon as any}
                size={22}
                color={app.color === "#FFFC00" ? "#000" : app.color}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.appFeature}>
                {tab === "features" ? app.feature : `Block ${app.feature}`}
              </Text>
            </View>
            <Switch
              testID={`app-switch-${app.id}`}
              value={appsState[app.id]}
              onValueChange={(v) =>
                setAppsState((s) => ({ ...s, [app.id]: v }))
              }
              trackColor={{ false: "rgba(255,255,255,0.12)", true: colors.accent.primary }}
              thumbColor="#fff"
              ios_backgroundColor="rgba(255,255,255,0.12)"
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton testID="add-rule-btn" label="Add Custom Rule" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  title: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  subtitle: { color: colors.text.secondary, fontSize: 13, marginTop: 6 },
  tabs: {
    flexDirection: "row",
    marginTop: spacing.md,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    padding: 4,
    marginBottom: spacing.md,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 999 },
  tabActive: { backgroundColor: colors.accent.primary },
  tabText: { color: colors.text.secondary, fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: "#0A0E17" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.cardSolid,
    borderColor: colors.border.soft,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  appName: { color: colors.text.primary, fontSize: 15, fontWeight: "700" },
  appFeature: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
