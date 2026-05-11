import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import { colors } from "../theme";

interface Props {
  size?: number;
  showWordmark?: boolean;
  wordmarkSize?: number;
}

export default function GzenLogo({ size = 40, showWordmark = true, wordmarkSize = 28 }: Props) {
  return (
    <View style={styles.row}>
      <View
        style={{
          width: size,
          height: size,
          shadowColor: colors.accent.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 14,
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 64 64">
          <Defs>
            <LinearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#22C55E" />
              <Stop offset="1" stopColor="#16A34A" />
            </LinearGradient>
          </Defs>
          <Circle cx="32" cy="32" r="30" fill="url(#g)" />
          <Path
            d="M44 24 a14 14 0 1 0 0 16 H32 v-6 h12 v-4"
            stroke="#0A0E17"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </View>
      {showWordmark && (
        <Text style={[styles.wordmark, { fontSize: wordmarkSize, marginLeft: size * 0.25 }]}>
          Gzen
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  wordmark: {
    color: colors.text.primary,
    fontWeight: "700",
    letterSpacing: -1.2,
  },
});
