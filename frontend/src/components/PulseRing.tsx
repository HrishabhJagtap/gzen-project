import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface Props {
  size: number;
  color: string;
  rings?: number;
  duration?: number;
  maxScale?: number;
}

export default function PulseRing({
  size,
  color,
  rings = 3,
  duration = 2400,
  maxScale = 1.8,
}: Props) {
  return (
    <View style={[styles.wrap, { width: size * maxScale, height: size * maxScale }]} pointerEvents="none">
      {Array.from({ length: rings }).map((_, i) => (
        <Ring
          key={i}
          size={size}
          color={color}
          delay={(duration / rings) * i}
          duration={duration}
          maxScale={maxScale}
        />
      ))}
    </View>
  );
}

function Ring({
  size,
  color,
  delay,
  duration,
  maxScale,
}: {
  size: number;
  color: string;
  delay: number;
  duration: number;
  maxScale: number;
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
      -1,
      false
    );
  }, [duration, t]);

  const style = useAnimatedStyle(() => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1.5,
    borderColor: color,
    opacity: 1 - t.value,
    transform: [{ scale: 1 + t.value * (maxScale - 1) }],
  }));

  return (
    <Animated.View style={[styles.ring, style]} />
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
  },
});
