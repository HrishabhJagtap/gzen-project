import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import GzenLogo from "../src/components/GzenLogo";
import AmbientGlow from "../src/components/AmbientGlow";
import PulseRing from "../src/components/PulseRing";
import { colors } from "../src/theme";

export default function Index() {
  const router = useRouter();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    scale.value = withSequence(
      withTiming(1.06, { duration: 700, easing: Easing.out(Easing.cubic) }),
      withRepeat(
        withSequence(
          withTiming(0.98, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );
    const t = setTimeout(() => router.replace("/onboarding"), 1700);
    return () => clearTimeout(t);
  }, [router, opacity, scale]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container} testID="splash-screen">
      <AmbientGlow size={500} top={120} left={-150} opacity={0.28} />
      <AmbientGlow color={colors.accent.blue} size={400} top={500} left={200} opacity={0.14} />
      <PulseRing size={180} color={colors.accent.primary} rings={3} duration={2400} maxScale={1.9} />
      <Animated.View style={logoStyle}>
        <GzenLogo size={84} wordmarkSize={48} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});
