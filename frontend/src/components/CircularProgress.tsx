import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { colors } from "../theme";

interface Props {
  size?: number;
  stroke?: number;
  progress: number; // 0-100
  trackColor?: string;
  progressColor?: string;
  centerLabel?: React.ReactNode;
  showPercent?: boolean;
  label?: string;
  duration?: number; // ms — animation speed
  glow?: boolean;
}

export default function CircularProgress({
  size = 140,
  stroke = 10,
  progress,
  trackColor = "rgba(255,255,255,0.08)",
  progressColor = colors.accent.primary,
  centerLabel,
  showPercent = false,
  label,
  duration = 900,
  glow = true,
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const target = Math.max(0, Math.min(100, progress));
  const [display, setDisplay] = useState(target);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const startTs = Date.now();
    const startVal = display;
    const delta = target - startVal;
    const tick = () => {
      const t = Math.min(1, (Date.now() - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(startVal + delta * eased);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  const offset = circumference - (display / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={progressColor} stopOpacity="1" />
            <Stop offset="1" stopColor="#16A34A" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        {glow && (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeOpacity={0.18}
            strokeWidth={stroke + 6}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        )}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {centerLabel ? (
          centerLabel
        ) : (
          <>
            {showPercent && (
              <Text style={styles.percent}>{Math.round(display)}%</Text>
            )}
            {label && <Text style={styles.label}>{label}</Text>}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  center: { position: "absolute", alignItems: "center", justifyContent: "center" },
  percent: { color: colors.accent.primary, fontSize: 22, fontWeight: "700" },
  label: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
});
