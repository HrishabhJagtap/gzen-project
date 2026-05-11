import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import GlassCard from "../src/components/GlassCard";
import PrimaryButton from "../src/components/PrimaryButton";
import AmbientGlow from "../src/components/AmbientGlow";
import PulseRing from "../src/components/PulseRing";
import { mockMicroTasks } from "../src/data/mock";
import { api } from "../src/api/client";
import { colors, spacing, radius } from "../src/theme";

const intents = [
  { id: "habit", label: "Habit / Boredom" },
  { id: "work", label: "Work / Study" },
  { id: "social", label: "Stay Connected" },
  { id: "other", label: "Others" },
];

export default function ValueGate() {
  const router = useRouter();
  const [intent, setIntent] = useState("habit");
  const [answer, setAnswer] = useState("");
  const [task, setTask] = useState<any>(mockMicroTasks[0]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number>(78);
  const [taskLoading, setTaskLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async (intentId: string) => {
    setTaskLoading(true);
    setError(null);
    try {
      const res = await api.detectRisk({
        app_id: "instagram",
        intent: intentId,
        time_of_day: new Date().getHours(),
      });
      setSessionId(res.session_id);
      setRiskScore(res.risk_score);
      if (res.micro_task) setTask(res.micro_task);
    } catch (e: any) {
      setError(e?.message || "Could not contact AI. Showing fallback task.");
    } finally {
      setTaskLoading(false);
    }
  };

  useEffect(() => {
    fetchTask(intent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onIntentChange = (id: string) => {
    setIntent(id);
    fetchTask(id);
  };

  const onVerify = async () => {
    const userAnswer = answer.trim() || task.suggested_answer || task.suggestedAnswer;
    if (!sessionId) {
      router.replace({ pathname: "/micro-task", params: { answer: userAnswer } });
      return;
    }
    setVerifying(true);
    setError(null);
    try {
      const res = await api.verifyTask({ session_id: sessionId, answer: userAnswer });
      if (!res.success) {
        setError(res.feedback || "Please write a longer answer.");
        return;
      }
      router.replace({
        pathname: "/micro-task",
        params: { answer: userAnswer, session_id: sessionId },
      });
    } catch (e: any) {
      setError(e?.message || "Could not verify task");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="value-gate-screen">
      <AmbientGlow size={500} top={-200} left={-100} opacity={0.2} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Close button */}
          <View style={styles.topRow}>
            <TouchableOpacity
              testID="value-gate-close"
              style={styles.closeBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* App icon */}
          <View style={styles.appIconWrap}>
            <PulseRing size={84} color="rgba(225, 48, 108, 0.55)" rings={3} duration={2400} maxScale={2.2} />
            <View style={styles.appIcon}>
              <Ionicons name="logo-instagram" size={48} color="#fff" />
            </View>
          </View>

          <Text style={styles.title}>Pause. Take a breath.</Text>
          <Text style={styles.subtitle}>
            Why are you opening Instagram?
          </Text>
          <Text style={styles.riskText}>
            <Ionicons name="alert-circle" size={11} color={colors.accent.red} />{" "}
            AI Risk Score: <Text style={{ color: colors.accent.red, fontWeight: "700" }}>{riskScore}%</Text>
          </Text>

          <View style={styles.intentGrid}>
            {intents.map((i) => {
              const active = intent === i.id;
              return (
                <TouchableOpacity
                  key={i.id}
                  testID={`intent-${i.id}`}
                  onPress={() => onIntentChange(i.id)}
                  activeOpacity={0.8}
                  style={[styles.intentPill, active && styles.intentPillActive]}
                >
                  <Text
                    style={[styles.intentText, active && styles.intentTextActive]}
                  >
                    {i.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.taskHeader}>
            <Text style={styles.taskHeaderText}>Complete a 60-sec Micro-Task</Text>
            <View style={styles.timerPill}>
              <Ionicons name="time" size={12} color={colors.accent.primary} />
              <Text style={styles.timerText}>01:00</Text>
            </View>
          </View>

          <GlassCard padding={18}>
            {taskLoading ? (
              <View style={{ alignItems: "center", paddingVertical: 18 }}>
                <ActivityIndicator color={colors.accent.primary} />
                <Text style={{ color: colors.text.secondary, marginTop: 8, fontSize: 12 }}>
                  Generating your micro-task…
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.taskPrompt}>{task.prompt}</Text>
                <Text style={styles.taskContext}>{task.context}</Text>
                <View style={styles.divider} />
                <TextInput
                  testID="value-gate-answer"
                  style={styles.input}
                  value={answer}
                  onChangeText={setAnswer}
                  placeholder="Type your answer..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                />
              </>
            )}
          </GlassCard>

          {error ? (
            <Text testID="value-gate-error" style={styles.errorText}>{error}</Text>
          ) : null}

          <View style={{ height: spacing.lg }} />

          <PrimaryButton
            testID="value-gate-verify-btn"
            label={verifying ? "Verifying..." : "Verify & Unlock"}
            loading={verifying}
            onPress={onVerify}
          />

          <Text style={styles.tone}>
            <Ionicons name="shield-checkmark" size={11} color={colors.accent.primary} />{" "}
            On-device AI. Your answer never leaves your phone.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  topRow: { alignItems: "flex-end", marginTop: spacing.sm },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  appIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  appIcon: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: "#E1306C",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E1306C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
  },
  appHalo: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: "rgba(225, 48, 108, 0.25)",
  },
  title: {
    color: colors.text.primary,
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  intentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  intentPill: {
    width: "48.5%",
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.border.medium,
    borderWidth: 1,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 10,
  },
  intentPillActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  intentText: { color: colors.text.primary, fontSize: 13, fontWeight: "600" },
  intentTextActive: { color: "#0A0E17" },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  taskHeaderText: { color: colors.text.secondary, fontSize: 12 },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  timerText: { color: colors.accent.primary, fontSize: 11, fontWeight: "700", marginLeft: 4 },
  taskPrompt: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  taskContext: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 8,
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.soft,
    marginVertical: spacing.md,
  },
  input: {
    color: colors.text.primary,
    fontSize: 14,
    minHeight: 44,
    textAlignVertical: "top",
  },
  tone: {
    color: colors.text.tertiary,
    fontSize: 11,
    textAlign: "center",
    marginTop: spacing.md,
  },
  riskText: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.accent.red,
    fontSize: 12,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
