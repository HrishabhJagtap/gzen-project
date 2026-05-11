import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../theme";

// Decorative radial-glow blobs to give the dark UI depth.
export default function AmbientGlow({
  color = colors.accent.primary,
  size = 320,
  top = -120,
  left = -80,
  opacity = 0.18,
}: {
  color?: string;
  size?: number;
  top?: number;
  left?: number;
  opacity?: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.blob,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
          opacity,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  blob: {
    position: "absolute",
  },
});
