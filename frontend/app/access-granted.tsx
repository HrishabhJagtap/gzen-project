import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import GlassCard from "../src/components/GlassCard";
import AmbientGlow from "../src/components/AmbientGlow";
import { api } from "../src/api/client";
import { colors, spacing, radius } from "../src/theme";

export default function AccessGranted() {
  const router = useRouter();
  const params = useLocalSearchParams<{ session_id?: string }>();
  const sessionId = (params.session_id as string) || "";
  const [minutesAllowed, setMinutesAllowed] = useState(10);
  const [completed, setCompleted] = useState(2);
  const [target, setTarget] = useState(5);

  useEffect(() => {
    if (!sessionId) return;
    (async () => {
      try {
        const res = await api.unlockSession({ session_id: sessionId, duration_minutes: 10 });
        setMinutesAllowed(res.minutes_allowed);
        setCompleted(res.completed_today);
        setTarget(res.target_today);
      } catch {
        // keep defaults
      }
    })();
  }, [sessionId]);

  const percent = target ? Math.min(100, Math.round((completed / target) * 100)) : 0;
  return (
    <SafeAreaView style={styles.container} testID="access-granted-screen">
      <AmbientGlow size={500} top={-100} left={-50} opacity={0.25} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.center}>
          <PulseRing size={140} color="rgba(34, 197, 94, 0.45)" rings={3} duration={2200} maxScale={2.0} />
          <Animated.View entering={ZoomIn.duration(560).springify().damping(11)} style={styles.checkCircle}>
            <Ionicons name="checkmark" size={56} color="#0A0E17" />
          </Animated.View>
        </View>

        <Animated.Text entering={FadeInUp.delay(280).duration(420)} style={styles.title}>
          Access Granted!
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(360).duration(420)} style={styles.subtitle}>
          Enjoy Instagram mindfully.
        </Animated.Text>

        <StaggerFade index={0} delay={500}>
        <GlassCard style={{ marginTop: spacing.xl }}>
          <View style={styles.row}>
            <View>
              <Text style={styles.cardLabel}>Time Unlocked</Text>
              <Text style={styles.bigNumber}>{minutesAllowed} Minutes</Text>
              <Text style={styles.warning}>Use it intentionally.</Text>
            </View>
            <View style={styles.timeIcon}>
              <Ionicons name="time" size={28} color={colors.accent.primary} />
            </View>
          </View>
        </GlassCard>
        </StaggerFade>

        <StaggerFade index={1} delay={500}>
        <GlassCard style={{ marginTop: spacing.md }}>
          <View style={styles.row}>
            <Text style={styles.progressLabel}>{"Today's Progress"}</Text>
            <Text style={styles.progressNum}>{completed}/{target}</Text>
          </View>
          <Text style={styles.progressSub}>Value-Gates Completed</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
        </GlassCard>
        </StaggerFade>

        <StaggerFade index={2} delay={500}>
        <TouchableOpacity
          testID="continue-btn"
          style={styles.cta}
          onPress={() => router.replace("/(tabs)/home")}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="open-app-btn"
          style={styles.linkBtn}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.linkText}>Open Instagram now</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.accent.primary} />
        </TouchableOpacity>
        </StaggerFade>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, paddingTop: spacing.xl },
  center: { alignItems: "center", justifyContent: "center", marginTop: spacing.xl },
  ringOuter: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.18)",
  },
  ringMid: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.28)",
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.6,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { color: colors.text.secondary, fontSize: 13 },
  bigNumber: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginTop: 4,
  },
  warning: { color: colors.accent.orange, fontSize: 11, marginTop: 4 },
  timeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(34, 197, 94, 0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressLabel: { color: colors.text.secondary, fontSize: 13 },
  progressNum: { color: colors.accent.primary, fontSize: 22, fontWeight: "700" },
  progressSub: { color: colors.text.tertiary, fontSize: 11, marginTop: 4 },
  track: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 12,
  },
  fill: { height: 8, backgroundColor: colors.accent.primary, borderRadius: 4 },
  cta: {
    height: 56,
    backgroundColor: colors.accent.primary,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  ctaText: { color: "#0A0E17", fontSize: 16, fontWeight: "700" },
  linkBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  linkText: { color: colors.accent.primary, fontSize: 13, fontWeight: "600", marginRight: 6 },
});
