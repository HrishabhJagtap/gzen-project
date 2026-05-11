import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ScreenHeader from "../src/components/ScreenHeader";
import GlassCard from "../src/components/GlassCard";
import CircularProgress from "../src/components/CircularProgress";
import PrimaryButton from "../src/components/PrimaryButton";
import AmbientGlow from "../src/components/AmbientGlow";
import { colors, spacing, radius } from "../src/theme";

export default function DailySummary() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} testID="daily-summary-screen">
      <AmbientGlow size={400} top={-150} left={-80} opacity={0.18} />
      <ScreenHeader title="Daily Summary" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Daily Summary</Text>
        <Text style={styles.date}>Feb 18, 2026</Text>

        <View style={styles.scoreWrap}>
          <CircularProgress
            size={180}
            stroke={14}
            progress={82}
            centerLabel={
              <View style={{ alignItems: "center" }}>
                <Text style={styles.score}>82</Text>
                <Text style={styles.scoreSub}>Great Day!</Text>
              </View>
            }
          />
        </View>

        <View style={styles.statsRow}>
          <GlassCard style={{ flex: 1, marginRight: 6 }}>
            <Text style={styles.statLabel}>Screen Time</Text>
            <Text style={styles.statValue}>2h 40m</Text>
          </GlassCard>
          <GlassCard style={{ flex: 1, marginLeft: 6 }}>
            <Text style={styles.statLabel}>Tasks Completed</Text>
            <Text style={styles.statValue}>4</Text>
          </GlassCard>
        </View>

        <GlassCard style={{ marginTop: spacing.md }}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>Focus Time</Text>
              <Text style={styles.statValue}>1h 30m</Text>
            </View>
            <View style={styles.divider} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.statLabel}>Top Improvement</Text>
              <Text style={[styles.statValue, { fontSize: 15, color: colors.accent.primary }]}>
                Morning Focus
              </Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard
          style={{ marginTop: spacing.md }}
          bg="rgba(34, 197, 94, 0.06)"
          borderColor="rgba(34, 197, 94, 0.3)"
          glow
        >
          <View style={styles.aiRow}>
            <Ionicons name="sparkles" size={18} color={colors.accent.primary} />
            <Text style={styles.aiTitle}>{"Today's Highlight"}</Text>
          </View>
          <Text style={styles.aiBody}>
            You completed 4 micro-tasks and beat your morning doomscroll window. Your focus time is
            up <Text style={{ color: colors.accent.primary, fontWeight: "700" }}>23%</Text> from
            yesterday — keep the momentum going.
          </Text>
        </GlassCard>

        <PrimaryButton
          testID="view-details-btn"
          label="View Details"
          onPress={() => router.push("/(tabs)/insights")}
          style={{ marginTop: spacing.lg }}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  date: { color: colors.text.secondary, fontSize: 13, marginTop: 4 },
  scoreWrap: { alignItems: "center", marginVertical: spacing.xl },
  score: { color: colors.text.primary, fontSize: 56, fontWeight: "700", letterSpacing: -2 },
  scoreSub: { color: colors.accent.primary, fontSize: 13, fontWeight: "600" },
  statsRow: { flexDirection: "row" },
  statLabel: { color: colors.text.secondary, fontSize: 12 },
  statValue: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.6,
    marginTop: 6,
  },
  row: { flexDirection: "row", alignItems: "center" },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.medium,
    marginHorizontal: 14,
  },
  aiRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  aiTitle: { color: colors.text.primary, fontSize: 14, fontWeight: "700", marginLeft: 8 },
  aiBody: { color: colors.text.secondary, fontSize: 13, lineHeight: 20 },
});
