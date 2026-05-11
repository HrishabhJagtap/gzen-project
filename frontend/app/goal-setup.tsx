import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ScreenHeader from "../src/components/ScreenHeader";
import PrimaryButton from "../src/components/PrimaryButton";
import AmbientGlow from "../src/components/AmbientGlow";
import { mockGoals } from "../src/data/mock";
import { colors, spacing, radius } from "../src/theme";

export default function GoalSetup() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>("focus");

  return (
    <SafeAreaView style={styles.container} testID="goal-setup-screen">
      <AmbientGlow size={350} top={-120} left={120} opacity={0.16} />
      <ScreenHeader title="" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{"What's your main goal?"}</Text>
        <Text style={styles.subtitle}>Choose what matters most to you.</Text>

        <View style={{ marginTop: spacing.xl }}>
          {mockGoals.map((g) => {
            const active = selected === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                testID={`goal-${g.id}`}
                onPress={() => setSelected(g.id)}
                activeOpacity={0.85}
                style={[styles.card, active && styles.cardActive]}
              >
                <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                  <Ionicons
                    name={g.icon as any}
                    size={22}
                    color={active ? colors.accent.primary : colors.text.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{g.title}</Text>
                  <Text style={styles.cardDesc}>{g.desc}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={active ? colors.accent.primary : colors.text.tertiary}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          testID="goal-continue-btn"
          label="Continue"
          onPress={() => router.replace("/(tabs)/home")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginTop: spacing.sm,
  },
  subtitle: { color: colors.text.secondary, fontSize: 14, marginTop: 6 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.cardSolid,
    borderColor: colors.border.medium,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 12,
  },
  cardActive: {
    borderColor: colors.accent.primary,
    backgroundColor: "rgba(34, 197, 94, 0.06)",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  iconBoxActive: {
    backgroundColor: "rgba(34, 197, 94, 0.18)",
  },
  cardTitle: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  cardDesc: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
