import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import ScreenHeader from "../src/components/ScreenHeader";
import PrimaryButton from "../src/components/PrimaryButton";
import AmbientGlow from "../src/components/AmbientGlow";
import { mockModes } from "../src/data/mock";
import { colors, spacing, radius } from "../src/theme";

export default function IntentMode() {
  const router = useRouter();
  const [selected, setSelected] = useState("focus");
  return (
    <SafeAreaView style={styles.container} testID="intent-mode-screen">
      <AmbientGlow size={400} top={-150} left={120} opacity={0.18} />
      <ScreenHeader title="Choose your mode" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Choose your mode.</Text>
        <Text style={styles.subtitle}>Gzen adapts your experience.</Text>

        <View style={{ marginTop: spacing.lg }}>
          {mockModes.map((m) => {
            const active = selected === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                testID={`intent-mode-${m.id}`}
                onPress={() => setSelected(m.id)}
                activeOpacity={0.85}
                style={[
                  styles.card,
                  { backgroundColor: m.bg, borderColor: m.border },
                  active && { borderWidth: 2, borderColor: m.iconColor },
                ]}
              >
                <View style={[styles.iconBox, { backgroundColor: "rgba(0,0,0,0.25)" }]}>
                  <Ionicons name={m.icon as any} size={32} color={m.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{m.name}</Text>
                  <Text style={styles.cardDesc}>{m.desc}</Text>
                </View>
                {active && (
                  <View style={[styles.checkBadge, { backgroundColor: m.iconColor }]}>
                    <Ionicons name="checkmark" size={14} color="#0A0E17" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          testID="intent-mode-start-btn"
          label="Start Session"
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
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.6,
    marginTop: spacing.sm,
  },
  subtitle: { color: colors.text.secondary, fontSize: 14, marginTop: 6 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 18,
    marginBottom: 12,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardTitle: { color: colors.text.primary, fontSize: 18, fontWeight: "700" },
  cardDesc: { color: colors.text.secondary, fontSize: 13, marginTop: 4, lineHeight: 18 },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
