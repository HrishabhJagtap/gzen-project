import React from "react";
import { View, StyleSheet, ViewProps, ViewStyle } from "react-native";
import { colors, radius } from "../theme";

interface Props extends ViewProps {
  glow?: boolean;
  borderColor?: string;
  bg?: string;
  padding?: number;
  rounded?: number;
  style?: ViewStyle | ViewStyle[];
}

export default function GlassCard({
  children,
  glow = false,
  borderColor,
  bg,
  padding = 20,
  rounded = radius.xl,
  style,
  ...rest
}: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          padding,
          borderRadius: rounded,
          borderColor: borderColor ?? colors.border.medium,
          backgroundColor: bg ?? colors.bg.cardSolid,
        },
        glow && styles.glow,
        style as any,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  glow: {
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
});
