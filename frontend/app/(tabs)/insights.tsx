import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassCard from "../../src/components/GlassCard";
import BarChart from "../../src/components/BarChart";
import DonutChart from "../../src/components/DonutChart";
import AmbientGlow from "../../src/components/AmbientGlow";
import StaggerFade from "../../src/components/StaggerFade";
import { mockUsageHourly, mockTimeDistribution } from "../../src/data/mock";
import { api } from "../../src/api/client";
import { colors, spacing, radius } from "../../src/theme";

const tabs = ["Today", "7 Days", "30 Days"];

export default function Insights() {
  const [tab, setTab] = useState("Today");
  const [daily, setDaily] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await api.daily();
      setDaily(res);
    } catch {}
  };
  useEffect(() => { load(); }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const total = daily?.total_minutes ?? 165;
  const hours = Math.floor(total / 60);
  const mins = Math.round(total - hours * 60);
  const hourly = (daily?.hourly && daily.hourly.length ? daily.hourly : mockUsageHourly);
  const dist = (daily?.distribution && daily.distribution.length ? daily.distribution.map((d: any) => ({...d, percent: d.percent})) : mockTimeDistribution);
  const peakHour = daily?.peak_hour ?? 9;
  const peakLabel = `${(peakHour % 12) || 12}:30 ${peakHour < 12 ? "AM" : "PM"} – ${(((peakHour + 1) % 12) || 12)}:30 ${peakHour + 1 < 12 ? "AM" : "PM"}`;

  return (
    <SafeAreaView style={styles.container} testID="insights-screen">
      <AmbientGlow size={350} top={-150} left={120} opacity={0.14} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />
        }
      >
        <View style={styles.titleRow}>
          <Text style={styles.title}>Insights</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="calendar-outline" size={18} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabs}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t}
              testID={`tab-${t}`}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Screen Time card */}
        <StaggerFade index={0}>
        <GlassCard style={{ marginTop: spacing.lg }}>
          <View style={styles.row}>
            <Text style={styles.label}>Screen Time</Text>
            <View style={styles.diffPill}>
              <Ionicons name="arrow-down" size={10} color={colors.accent.primary} />
              <Text style={styles.diffText}>18% vs yesterday</Text>
            </View>
          </View>
          <Text style={styles.big}>
            {hours}h <Text style={{ fontSize: 26, color: colors.text.secondary }}>{mins}m</Text>
          </Text>
          <BarChart data={hourly} width={300} height={80} />
        </GlassCard>
        </StaggerFade>

        {/* Time Distribution */}
        <StaggerFade index={1}>
        <GlassCard style={{ marginTop: spacing.md }}>
          <Text style={styles.label}>Time Distribution</Text>
          <View style={styles.distRow}>
            <DonutChart
              data={dist}
              size={130}
              thickness={18}
              centerLabel={`${hours}h ${mins}m`}
              centerSub="Total"
            />
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              {dist.map((s: any) => (
                <View key={s.label} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                  <Text style={styles.legendLabel}>{s.label}</Text>
                  <Text style={styles.legendValue}>
                    {Math.floor((s.minutes ?? 0) / 60)}h {Math.round((s.minutes ?? 0) % 60)}m
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </GlassCard>
        </StaggerFade>

        {/* AI Insight */}
        <StaggerFade index={2}>
        <GlassCard
          style={{ marginTop: spacing.md }}
          borderColor="rgba(34, 197, 94, 0.35)"
          bg="rgba(34, 197, 94, 0.06)"
          glow
        >
          <View style={styles.aiHeader}>
            <View style={styles.aiIcon}>
              <Ionicons name="sparkles" size={16} color={colors.accent.primary} />
            </View>
            <Text style={styles.aiHeaderText}>AI Insight</Text>
          </View>
          <Text style={styles.aiText}>
            Your doomscroll risk is highest around{" "}
            <Text style={{ color: colors.accent.primary, fontWeight: "700" }}>
              {peakLabel}
            </Text>
            . Try a morning routine — block social apps for the first 60 minutes.
          </Text>
        </GlassCard>
        </StaggerFade>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: colors.border.medium,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: {
    flexDirection: "row",
    marginTop: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 999,
    padding: 4,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 999 },
  tabActive: { backgroundColor: colors.accent.primary },
  tabText: { color: colors.text.secondary, fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: "#0A0E17" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { color: colors.text.secondary, fontSize: 13, fontWeight: "500" },
  diffPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  diffText: { color: colors.accent.primary, fontSize: 11, fontWeight: "700", marginLeft: 4 },
  big: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -1.2,
    marginTop: 8,
    marginBottom: 12,
  },
  distRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  legendRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  legendLabel: { color: colors.text.primary, fontSize: 12, flex: 1 },
  legendValue: { color: colors.text.secondary, fontSize: 11 },
  aiHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(34, 197, 94, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  aiHeaderText: { color: colors.text.primary, fontSize: 14, fontWeight: "700" },
  aiText: { color: colors.text.secondary, fontSize: 13, lineHeight: 20 },
});
