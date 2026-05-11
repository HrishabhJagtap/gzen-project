import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../src/components/ScreenHeader";
import GlassCard from "../src/components/GlassCard";
import AmbientGlow from "../src/components/AmbientGlow";
import StaggerFade from "../src/components/StaggerFade";
import AnimatedCounter from "../src/components/AnimatedCounter";
import { mockUser, mockBadges, mockAchievements } from "../src/data/mock";
import { useAuth } from "../src/context/AuthContext";
import { api } from "../src/api/client";
import { colors, spacing, radius } from "../src/theme";

export default function Rewards() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number>(user?.streak ?? mockUser.streak);
  const [points, setPoints] = useState<number>(user?.points ?? mockUser.totalPoints);
  const [level, setLevel] = useState<number>(user?.level ?? mockUser.level);
  const [xp, setXp] = useState<number>(user?.xp ?? mockUser.xp);
  const [xpFor, setXpFor] = useState<number>(mockUser.xpForNext);
  const [badges, setBadges] = useState<any[]>(mockBadges);

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([api.streak(), api.points()]);
        if (s) setStreak(s.streak);
        if (p) {
          setPoints(p.points);
          setLevel(p.level);
          setXp(p.xp);
          setXpFor(p.xp_for_next_level);
          if (Array.isArray(p.badges) && p.badges.length) setBadges(p.badges);
        }
      } catch {}
    })();
  }, []);

  const xpPercent = xpFor ? Math.min(100, (xp / xpFor) * 100) : 0;
  return (
    <SafeAreaView style={styles.container} testID="rewards-screen">
      <AmbientGlow size={400} top={-180} left={-80} opacity={0.18} />
      <ScreenHeader title="Your Progress" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <StaggerFade index={0}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.streakIcon}>
              <MaterialCommunityIcons name="fire" size={22} color={colors.accent.orange} />
            </View>
            <AnimatedCounter style={styles.statValue} value={streak} />
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.streakIcon, { backgroundColor: "rgba(34,197,94,0.14)" }]}>
              <Ionicons name="star" size={22} color={colors.accent.primary} />
            </View>
            <AnimatedCounter style={styles.statValue} value={points} />
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
        </View>
        </StaggerFade>

        <StaggerFade index={1}>
        <GlassCard style={{ marginTop: spacing.md }}>
          <View style={styles.row}>
            <View>
              <Text style={styles.cardLabel}>Level {level}</Text>
              <Text style={styles.cardSub}>{"Keep going! You're doing great."}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{level}</Text>
            </View>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${xpPercent}%` }]} />
          </View>
          <Text style={styles.xp}>
            {xp} / {xpFor} XP
          </Text>
        </GlassCard>
        </StaggerFade>

        <Text style={styles.sectionLabel}>Badges</Text>
        <StaggerFade index={2}>
        <View style={styles.badgesRow}>
          {badges.map((b) => (
            <View key={b.id} style={[styles.badge, !b.earned && { opacity: 0.4 }]}>
              <View
                style={[
                  styles.badgeIcon,
                  { backgroundColor: (b.color || "#22C55E") + "22", borderColor: (b.color || "#22C55E") + "60" },
                ]}
              >
                <Ionicons name={(b.icon || "ribbon") as any} size={26} color={b.color || colors.accent.primary} />
              </View>
              <Text style={styles.badgeName}>{b.name}</Text>
            </View>
          ))}
        </View>
        </StaggerFade>

        <Text style={styles.sectionLabel}>Recent Achievements</Text>
        {mockAchievements.map((a, idx) => (
          <StaggerFade key={a.id} index={idx + 3}>
          <View style={styles.achRow}>
            <View style={styles.achIcon}>
              <Ionicons name="trophy" size={18} color={colors.accent.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.achPoints}>+{a.points} points</Text>
              <Text style={styles.achTitle}>{a.title}</Text>
            </View>
            <Text style={styles.achTime}>{a.time}</Text>
          </View>
          </StaggerFade>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  statsRow: { flexDirection: "row", gap: 12 as any, marginTop: spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: colors.bg.cardSolid,
    borderColor: colors.border.medium,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 18,
    marginRight: 6,
  },
  streakIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(245, 158, 11, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: { color: colors.text.primary, fontSize: 28, fontWeight: "700", letterSpacing: -1 },
  statLabel: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { color: colors.text.primary, fontSize: 18, fontWeight: "700" },
  cardSub: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  levelBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadgeText: { color: "#0A0E17", fontSize: 16, fontWeight: "700" },
  track: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: spacing.md,
  },
  fill: { height: 8, backgroundColor: colors.accent.primary, borderRadius: 4 },
  xp: { color: colors.text.tertiary, fontSize: 11, marginTop: 8, textAlign: "right" },
  sectionLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.bg.cardSolid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.medium,
    padding: 16,
  },
  badge: { alignItems: "center", flex: 1 },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeName: { color: colors.text.secondary, fontSize: 11, textAlign: "center" },
  achRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.cardSolid,
    borderColor: colors.border.soft,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 10,
  },
  achIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(34, 197, 94, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  achPoints: { color: colors.accent.primary, fontSize: 13, fontWeight: "700" },
  achTitle: { color: colors.text.primary, fontSize: 12, marginTop: 2 },
  achTime: { color: colors.text.tertiary, fontSize: 11 },
});
