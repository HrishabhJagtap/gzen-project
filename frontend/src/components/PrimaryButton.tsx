import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { colors, radius } from "../theme";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  loading,
  style,
  testID,
  disabled,
  icon,
}: Props) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  return (
    <TouchableOpacity
      testID={testID}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btn,
        isPrimary && styles.primary,
        variant === "secondary" && styles.secondary,
        isOutline && styles.outline,
        disabled && { opacity: 0.5 },
        style as any,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#0A0E17" : colors.accent.primary} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              isPrimary && { color: "#0A0E17" },
              !isPrimary && { color: colors.text.primary },
              icon ? { marginLeft: 8 } : null,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 56,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.accent.primary,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  secondary: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.border.strong,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
