import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../src/components/ScreenHeader";
import AmbientGlow from "../src/components/AmbientGlow";
import { mockSettings } from "../src/data/mock";
import { colors, spacing, radius } from "../src/theme";

export default function Settings() {
  return (
    <SafeAreaView style={styles.container} testID="settings-screen">
      <AmbientGlow size={350} top={-150} left={120} opacity={0.14} />
      <ScreenHeader title="Settings" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {mockSettings.map((s) => (
          <TouchableOpacity
            key={s.id}
            testID={`setting-${s.id}`}
            activeOpacity={0.8}
            style={styles.row}
          >
            <View style={styles.iconBox}>
              <Ionicons name={s.icon as any} size={18} color={colors.accent.primary} />
            </View>
            <Text style={styles.label}>{s.label}</Text>
            {s.value ? <Text style={styles.value}>{s.value}</Text> : null}
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.text.tertiary}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.cardSolid,
    borderColor: colors.border.soft,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  label: { flex: 1, color: colors.text.primary, fontSize: 14, fontWeight: "500" },
  value: { color: colors.text.secondary, fontSize: 13 },
});
