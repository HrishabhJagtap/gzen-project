import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import GzenLogo from "../src/components/GzenLogo";
import PrimaryButton from "../src/components/PrimaryButton";
import AmbientGlow from "../src/components/AmbientGlow";
import { colors, spacing } from "../src/theme";

const features = [
  { icon: "shield-check", label: "Privacy First" },
  { icon: "flash", label: "Smart AI" },
  { icon: "trophy", label: "Build Habits" },
  { icon: "brain", label: "Mindful Tech" },
];

export default function Onboarding() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} testID="onboarding-screen">
      <AmbientGlow size={500} top={-150} left={-100} opacity={0.2} />
      <AmbientGlow
        color={colors.accent.blue}
        size={400}
        top={400}
        left={150}
        opacity={0.1}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoRow}>
          <GzenLogo size={48} wordmarkSize={32} />
        </View>

        <View style={styles.heroIconWrap}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="leaf" size={64} color={colors.accent.primary} />
          </View>
          <View style={[styles.satellite, { top: 30, left: 20 }]}>
            <Ionicons name="time-outline" size={20} color={colors.accent.primary} />
          </View>
          <View style={[styles.satellite, { top: 30, right: 20 }]}>
            <Ionicons name="scan-outline" size={20} color={colors.accent.primary} />
          </View>
          <View style={[styles.satellite, { bottom: 30, left: 30 }]}>
            <Ionicons name="bar-chart-outline" size={20} color={colors.accent.primary} />
          </View>
          <View style={[styles.satellite, { bottom: 30, right: 30 }]}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent.primary} />
          </View>
        </View>

        <Text style={styles.title}>Reclaim your time.</Text>
        <Text style={styles.title}>Rewire your habits.</Text>
        <Text style={[styles.title, { color: colors.accent.primary }]}>Reset your life.</Text>

        <Text style={styles.subtitle}>
          Gzen uses on-device AI to intercept doomscrolling at the exact moment of distraction —
          replacing it with a 60-second value-gate.
        </Text>

        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <View style={styles.features}>
          {features.map((f) => (
            <View key={f.label} style={styles.featurePill}>
              <MaterialCommunityIcons
                name={f.icon as any}
                size={16}
                color={colors.accent.primary}
              />
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          testID="get-started-btn"
          label="Get Started"
          onPress={() => router.push("/login")}
        />
        <Text style={styles.footerText}>
          AI that protects your{" "}
          <Text style={{ color: colors.accent.primary, fontWeight: "700" }}>Golden Hour</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  logoRow: { alignItems: "flex-start", marginBottom: spacing.xl },
  heroIconWrap: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  heroIconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderWidth: 1.5,
    borderColor: "rgba(34, 197, 94, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
  },
  satellite: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.text.primary,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -1,
    lineHeight: 38,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  dots: {
    flexDirection: "row",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.medium,
    marginRight: 6,
  },
  dotActive: { width: 24, backgroundColor: colors.accent.primary },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8 as any,
    marginTop: spacing.sm,
  },
  featurePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(34, 197, 94, 0.08)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.25)",
    marginRight: 8,
    marginBottom: 8,
  },
  featureLabel: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  footerText: {
    color: colors.text.tertiary,
    textAlign: "center",
    marginTop: spacing.md,
    fontSize: 13,
  },
});
