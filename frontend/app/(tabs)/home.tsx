import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import GlassCard from "../../src/components/GlassCard";
import CircularProgress from "../../src/components/CircularProgress";
import BarChart from "../../src/components/BarChart";
import AmbientGlow from "../../src/components/AmbientGlow";
import StaggerFade from "../../src/components/StaggerFade";
import AnimatedCounter from "../../src/components/AnimatedCounter";
import { mockUser, mockUsageHourly } from "../../src/data/mock";
import { useAuth } from "../../src/context/AuthContext";
import { api } from "../../src/api/client";
import { colors, spacing, radius } from "../../src/theme";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [daily, setDaily] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const res = await api.daily();
      setDaily(res);
    } catch {
      // keep null → fall through to mock
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const totalMin = daily?.total_minutes ?? 165;
  const hours = Math.floor(totalMin / 60);
  const mins = Math.round(totalMin - hours * 60);
  const riskScore = daily?.risk_score ?? 78;
  const riskLabel = daily?.risk_label ?? "High Risk";
  const hourly = (daily?.hourly && daily.hourly.length ? daily.hourly : mockUsageHourly);
  const goalPct = user
    ? Math.min(100, Math.round((user.focus_score ?? 68)))
    : 68;
  const greetingName = user?.name?.split(" ")[0] || mockUser.name;

  return (
    <SafeAreaView style={styles.container} testID="home-screen">
      <AmbientGlow size={400} top={-180} left={-80} opacity={0.15} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />
        }
      >
        {/* Greeting */}
        <StaggerFade index={0}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.name}>
              {greetingName} <Text style={{ fontSize: 24 }}>👋</Text>
            </Text>
          </View>
          <TouchableOpacity
            testID="header-profile-btn"
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
        </StaggerFade>

        {/* Screen Time */}
        <StaggerFade index={1}>
        <GlassCard style={{ marginTop: spacing.lg }}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardLabel}>Screen Time Today</Text>
            <View style={styles.diffPill}>
              <Ionicons name="arrow-up" size={10} color={colors.accent.primary} />
              <Text style={styles.diffText}>18% vs yesterday</Text>
            </View>
          </View>
          <Text style={styles.bigNumber}>
            {hours}h <Text style={{ fontSize: 28, color: colors.text.secondary }}>{mins}m</Text>
          </Text>
          <View style={{ marginTop: 16 }}>
            <BarChart data={hourly} width={300} height={70} />
          </View>
        </GlassCard>
        </StaggerFade>

        {/* Doomscroll Risk */}
        <StaggerFade index={2}>
        <GlassCard
          style={{ marginTop: spacing.md }}
          borderColor="rgba(239, 68, 68, 0.25)"
        >
          <View style={styles.rowBetween}>
            <Text style={styles.cardLabel}>Doomscroll Risk</Text>
            <View style={styles.riskPill}>
              <View style={styles.dotPulse} />
              <Text style={styles.riskPillText}>Live</Text>
            </View>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.riskTitle}>{riskLabel} Risk</Text>
            <AnimatedCounter
              value={riskScore}
              format={(n) => `${Math.round(n)}%`}
              style={styles.riskPercent}
            />
          </View>
          <View style={styles.riskTrack}>
            <View style={[styles.riskFill, { width: `${riskScore}%` }]} />
          </View>
          <View style={styles.peakRow}>
            <Ionicons name="alert-circle" size={14} color={colors.accent.orange} />
            <Text style={styles.peakText}>
              Peak Time: <Text style={{ color: colors.text.primary, fontWeight: "600" }}>6:30 AM – 9:30 AM</Text>
            </Text>
          </View>
        </GlassCard>
        </StaggerFade>

        {/* Today's Goal */}
        <StaggerFade index={3}>
        <GlassCard style={{ marginTop: spacing.md }}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardLabel}>{"Today's Goal"}</Text>
              <Text style={styles.bigNumber}>3h 30m</Text>
              <Text style={styles.cardSub}>Focus Time</Text>
            </View>
            <CircularProgress
              size={92}
              stroke={9}
              progress={goalPct}
              centerLabel={
                <AnimatedCounter
                  value={goalPct}
                  format={(n) => `${Math.round(n)}%`}
                  style={{ color: colors.accent.primary, fontWeight: "700", fontSize: 18 }}
                />
              }
            />
          </View>
        </GlassCard>
        </StaggerFade>

        {/* Quick Actions */}
        <Text style={styles.sectionLabel}>Quick Actions</Text>
        <StaggerFade index={4}>
        <View style={styles.quickRow}>
          <TouchableOpacity
            testID="quick-focus-mode"
            style={[styles.quickCard, styles.quickPrimary]}
            onPress={() => router.push("/intent-mode")}
            activeOpacity={0.85}
          >
            <View style={styles.quickIconPrimary}>
              <Ionicons name="scan" size={22} color="#0A0E17" />
            </View>
            <Text style={[styles.quickTitle, { color: "#0A0E17" }]}>Focus Mode</Text>
            <Text style={[styles.quickDesc, { color: "rgba(10,14,23,0.7)" }]}>
              Start a deep work session
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="quick-view-insights"
            style={styles.quickCard}
            onPress={() => router.push("/(tabs)/insights")}
            activeOpacity={0.85}
          >
            <View style={styles.quickIcon}>
              <Ionicons name="bar-chart" size={22} color={colors.accent.primary} />
            </View>
            <Text style={styles.quickTitle}>View Insights</Text>
            <Text style={styles.quickDesc}>See your full report</Text>
          </TouchableOpacity>
        </View>
        </StaggerFade>

        {/* Demo: simulate Instagram open */}
        <StaggerFade index={5}>
        <TouchableOpacity
          testID="simulate-instagram-btn"
          style={styles.simulate}
          onPress={() => router.push("/value-gate")}
          activeOpacity={0.9}
        >
          <View style={styles.simulateIcon}>
            <Ionicons name="logo-instagram" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.simulateTitle}>Demo: Try opening Instagram</Text>
            <Text style={styles.simulateDesc}>Trigger the Value-Gate intervention</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.accent.primary} />
        </TouchableOpacity>
        </StaggerFade>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  greeting: { color: colors.text.secondary, fontSize: 14 },
  name: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.accent.primary,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: { color: colors.text.secondary, fontSize: 13, fontWeight: "500" },
  cardSub: { color: colors.text.tertiary, fontSize: 12, marginTop: 2 },
  diffPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4 as any,
  },
  diffText: { color: colors.accent.primary, fontSize: 11, fontWeight: "700", marginLeft: 4 },
  bigNumber: {
    color: colors.text.primary,
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -1.2,
    marginTop: 8,
  },
  riskPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dotPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.red,
    marginRight: 6,
  },
  riskPillText: { color: colors.accent.red, fontSize: 11, fontWeight: "700" },
  riskTitle: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: spacing.sm,
  },
  riskPercent: {
    color: colors.accent.red,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1,
    marginTop: spacing.sm,
  },
  riskTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: spacing.md,
  },
  riskFill: {
    height: 6,
    backgroundColor: colors.accent.red,
    borderRadius: 3,
  },
  peakRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  peakText: { color: colors.text.secondary, fontSize: 12, marginLeft: 6 },
  sectionLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  quickRow: { flexDirection: "row", gap: 12 as any },
  quickCard: {
    flex: 1,
    backgroundColor: colors.bg.cardSolid,
    borderColor: colors.border.medium,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 16,
    marginRight: 6,
  },
  quickPrimary: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
    marginRight: 0,
    marginLeft: 0,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  quickIconPrimary: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(10,14,23,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(34, 197, 94, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  quickTitle: { color: colors.text.primary, fontSize: 14, fontWeight: "700" },
  quickDesc: { color: colors.text.secondary, fontSize: 11, marginTop: 2 },
  simulate: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.06)",
    borderColor: "rgba(34, 197, 94, 0.3)",
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 14,
    marginTop: spacing.md,
  },
  simulateIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E1306C",
    alignItems: "center",
    justifyContent: "center",
  },
  simulateTitle: { color: colors.text.primary, fontSize: 13, fontWeight: "700" },
  simulateDesc: { color: colors.text.secondary, fontSize: 11, marginTop: 2 },
});
