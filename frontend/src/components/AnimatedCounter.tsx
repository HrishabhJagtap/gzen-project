import React, { useEffect, useState } from "react";
import { Text, TextProps } from "react-native";

interface Props extends TextProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}

/** Tween a number from 0 to value over `duration` ms. */
export default function AnimatedCounter({
  value,
  duration = 900,
  format = (n) => Math.round(n).toString(),
  ...rest
}: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const startTs = Date.now();
    const startVal = display;
    const delta = value - startVal;
    let raf: any;
    const tick = () => {
      const t = Math.min(1, (Date.now() - startTs) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(startVal + delta * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <Text {...rest}>{format(display)}</Text>;
}
