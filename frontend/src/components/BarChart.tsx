import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors } from "../theme";

interface DataPoint {
  hour: string;
  value: number;
  peak?: boolean;
}

interface Props {
  data: DataPoint[];
  height?: number;
  width?: number;
}

export default function BarChart({ data, height = 90, width = 300 }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barCount = data.length;
  const gap = 8;
  const barWidth = (width - gap * (barCount - 1)) / barCount;

  return (
    <View>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.accent.primary} stopOpacity="1" />
            <Stop offset="1" stopColor={colors.accent.primary} stopOpacity="0.4" />
          </LinearGradient>
          <LinearGradient id="barDim" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="rgba(255,255,255,0.18)" />
            <Stop offset="1" stopColor="rgba(255,255,255,0.05)" />
          </LinearGradient>
        </Defs>
        {data.map((d, i) => {
          const h = (d.value / max) * (height - 10);
          const x = i * (barWidth + gap);
          const y = height - h;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={6}
              fill={d.peak ? "url(#barGrad)" : "url(#barDim)"}
            />
          );
        })}
      </Svg>
      <View style={[styles.labels, { width }]}>
        {data
          .filter((_, i) => i % 2 === 0)
          .map((d) => (
            <Text key={d.hour} style={styles.label}>
              {d.hour}
            </Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  label: {
    color: colors.text.tertiary,
    fontSize: 10,
  },
});
