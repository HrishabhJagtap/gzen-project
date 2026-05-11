import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { colors } from "../theme";

interface Slice {
  label: string;
  percent: number; // 0-100
  color: string;
  minutes?: number;
}

interface Props {
  data: Slice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}

export default function DonutChart({
  data,
  size = 140,
  thickness = 18,
  centerLabel,
  centerSub,
}: Props) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" originX={size / 2} originY={size / 2}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={thickness}
            fill="none"
          />
          {data.map((slice, i) => {
            const dash = (slice.percent / 100) * circumference;
            const offset = -((cumulative / 100) * circumference);
            cumulative += slice.percent;
            return (
              <Circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={slice.color}
                strokeWidth={thickness}
                fill="none"
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {centerLabel && <Text style={styles.label}>{centerLabel}</Text>}
        {centerSub && <Text style={styles.sub}>{centerSub}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  center: { position: "absolute", alignItems: "center", justifyContent: "center" },
  label: { color: colors.text.primary, fontSize: 18, fontWeight: "700" },
  sub: { color: colors.text.tertiary, fontSize: 11, marginTop: 2 },
});
