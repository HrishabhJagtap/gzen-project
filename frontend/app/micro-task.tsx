import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import CircularProgress from "../src/components/CircularProgress";
import GlassCard from "../src/components/GlassCard";
import AmbientGlow from "../src/components/AmbientGlow";
import { mockMicroTasks } from "../src/data/mock";
import { colors, spacing, radius } from "../src/theme";

export default function MicroTask() {
  const router = useRouter();
  const params = useLocalSearchParams<{ answer?: string; session_id?: string }>();
  const [secondsLeft, setSecondsLeft] = useState(35);
  const task = mockMicroTasks[0];
  const userAnswer = (params.answer as string) || task.suggestedAnswer;
  const sessionId = (params.session_id as string) || "";

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const progress = ((60 - secondsLeft) / 60) * 100;

  return (
    <SafeAreaView style={styles.container} testID="micro-task-screen">
      <AmbientGlow size={420} top={-180} left={-80} opacity={0.18} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
            testID="micro-task-back"
          >
            <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.titleSmall}>Micro-Task</Text>
            <Text style={styles.subSmall}>Learn. Reflect. Grow.</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.timerWrap}>
          <CircularProgress
            size={220}
            stroke={14}
            progress={progress}
            centerLabel={
              <View style={{ alignItems: "center" }}>
                <Text style={styles.timerBig}>{fmt(secondsLeft)}</Text>
                <Text style={styles.timerLabel}>Time Left</Text>
              </View>
            }
          />
        </View>

        <GlassCard style={{ marginTop: spacing.lg }}>
          <Text style={styles.taskLabel}>Task</Text>
          <Text style={styles.taskPrompt}>{task.prompt}</Text>
          <View style={styles.snippetBox}>
            <Text style={styles.snippetText}>{task.context}</Text>
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: spacing.md }}>
          <Text style={styles.taskLabel}>Your Answer</Text>
          <View style={styles.answerRow}>
            <Text style={styles.answerText} numberOfLines={3}>
              {userAnswer}
            </Text>
            <View style={styles.checkBadge}>
              <Ionicons name="checkmark" size={14} color="#0A0E17" />
            </View>
          </View>
        </GlassCard>

        <GlassCard
          style={{ marginTop: spacing.md }}
          bg="rgba(34, 197, 94, 0.06)"
          borderColor="rgba(34, 197, 94, 0.3)"
        >
          <View style={styles.encourageRow}>
            <Ionicons name="sparkles" size={18} color={colors.accent.primary} />
            <Text style={styles.encourageTitle}>{"Great! You're all set."}</Text>
          </View>
          <Text style={styles.encourageDesc}>
            You can now use Instagram for the next 10 minutes.
          </Text>
        </GlassCard>

        <TouchableOpacity
          testID="micro-task-continue-btn"
          style={styles.cta}
          onPress={() =>
            router.replace({ pathname: "/access-granted", params: { session_id: sessionId } })
          }
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>Continue to App</Text>
          <Ionicons name="arrow-forward" size={18} color="#0A0E17" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  titleSmall: { color: colors.text.primary, fontSize: 17, fontWeight: "700" },
  subSmall: { color: colors.text.secondary, fontSize: 11, marginTop: 2 },
  timerWrap: { alignItems: "center", marginTop: spacing.lg },
  timerBig: {
    color: colors.text.primary,
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -2,
  },
  timerLabel: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  taskLabel: {
    color: colors.text.tertiary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  taskPrompt: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  snippetBox: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: radius.md,
    padding: 12,
    marginTop: 12,
  },
  snippetText: { color: colors.text.secondary, fontSize: 13, lineHeight: 19 },
  answerRow: { flexDirection: "row", alignItems: "center" },
  answerText: { flex: 1, color: colors.text.primary, fontSize: 14, lineHeight: 20 },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  encourageRow: { flexDirection: "row", alignItems: "center" },
  encourageTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
  encourageDesc: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    backgroundColor: colors.accent.primary,
    borderRadius: 999,
    marginTop: spacing.lg,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  ctaText: {
    color: "#0A0E17",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});
