import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, spacing } from "../theme";

interface Props {
  title?: string;
  onBack?: () => void;
  rightIcon?: React.ComponentProps<typeof Ionicons>["name"];
  onRightPress?: () => void;
  showBack?: boolean;
}

export default function ScreenHeader({
  title,
  onBack,
  rightIcon,
  onRightPress,
  showBack = true,
}: Props) {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          testID="header-back-btn"
          onPress={onBack ?? (() => router.back())}
          style={styles.iconBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {rightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name={rightIcon} size={20} color={colors.text.primary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
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
  title: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
});
