import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ViewProps } from "react-native";

interface Props extends ViewProps {
  index?: number;
  delay?: number;
  step?: number;
  yOffset?: number;
  duration?: number;
  children: React.ReactNode;
}

export default function StaggerFade({
  index = 0,
  delay = 0,
  step = 80,
  yOffset = 16,
  duration = 520,
  children,
  ...rest
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(duration)
        .delay(delay + index * step)
        .springify()
        .damping(18)}
      {...(rest as any)}
    >
      {children}
    </Animated.View>
  );
}
