import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import GlassCard from "../../src/components/GlassCard";
import PrimaryButton from "../../src/components/PrimaryButton";
import AmbientGlow from "../../src/components/AmbientGlow";
import { mockModes } from "../../src/data/mock";
import { colors, spacing, radius } from "../../src/theme";

export default function Focus() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} testID="focus-screen">
      <AmbientGlow size={350} top={-120} left={-100} opacity={0.18} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose your mode.</Text>
        <Text style={styles.subtitle}>Gzen adapts your experience.</Text>

        <View style={{ marginTop: spacing.lg }}>
          {mockModes.map((m) => (
            <TouchableOpacity
              key={m.id}
              testID={`mode-${m.id}`}
              activeOpacity={0.85}
              onPress={() => router.push("/intent-mode")}
              style={[
                styles.modeCard,
                { backgroundColor: m.bg, borderColor: m.border },
              ]}
            >
              <View style={[styles.iconBox, { backgroundColor: "rgba(0,0,0,0.25)" }]}>
                <Ionicons name={m.icon as any} size={28} color={m.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modeTitle}>{m.name}</Text>
                <Text style={styles.modeDesc}>{m.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={m.iconColor} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Quick Tools</Text>
        <View style={styles.toolsRow}>
          <TouchableOpacity
            style={styles.tool}
            onPress={() => router.push("/app-control")}
            activeOpacity={0.85}
            testID="tool-app-control"
          >
            <View style={styles.toolIcon}>
              <Ionicons name="apps" size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.toolTitle}>App Control</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tool}
            onPress={() => router.push("/settings")}
            activeOpacity={0.85}
            testID="tool-settings"
          >
            <View style={styles.toolIcon}>
              <Ionicons name="settings" size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.toolTitle}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tool}
            onPress={() => router.push("/daily-summary")}
            activeOpacity={0.85}
            testID="tool-daily-summary"
          >
            <View style={styles.toolIcon}>
              <Ionicons name="calendar" size={20} color={colors.accent.primary} />
            </View>
            <Text style={styles.toolTitle}>Daily Summary</Text>
          </TouchableOpacity>
        </View>

        <GlassCard style={{ marginTop: spacing.lg }} bg="rgba(34, 197, 94, 0.06)" borderColor="rgba(34, 197, 94, 0.3)">
          <Text style={styles.aiTitle}>Ready to start?</Text>
          <Text style={styles.aiSub}>
            Trigger the demo Value-Gate to see how Gzen intercepts at the exact moment of distraction.
          </Text>
          <PrimaryButton
            testID="start-focus-btn"
            label="Start Focus Mode"
            onPress={() => router.push("/value-gate")}
            style={{ marginTop: spacing.md }}
          />
        </GlassCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginTop: spacing.sm,
  },
  subtitle: { color: colors.text.secondary, fontSize: 14, marginTop: 6 },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 12,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  modeTitle: { color: colors.text.primary, fontSize: 17, fontWeight: "700" },
  modeDesc: { color: colors.text.secondary, fontSize: 12, marginTop: 4, lineHeight: 17 },
  sectionLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  toolsRow: { flexDirection: "row", gap: 10 as any },
  tool: {
    flex: 1,
    backgroundColor: colors.bg.cardSolid,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: radius.lg,
    padding: 14,
    alignItems: "center",
    marginRight: 6,
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(34,197,94,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  toolTitle: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  aiTitle: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  aiSub: { color: colors.text.secondary, fontSize: 13, marginTop: 6, lineHeight: 19 },
});
