export const colors = {
  bg: {
    primary: "#050505",
    secondary: "#0A0E17",
    tertiary: "#111827",
    card: "rgba(255, 255, 255, 0.04)",
    cardSolid: "#0F1420",
    cardElevated: "#141A28",
  },
  accent: {
    primary: "#22C55E",
    primaryDim: "#16A34A",
    primaryGlow: "rgba(34, 197, 94, 0.45)",
    primarySoft: "rgba(34, 197, 94, 0.12)",
    blue: "#3B82F6",
    orange: "#F59E0B",
    red: "#EF4444",
    purple: "#A855F7",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#9CA3AF",
    tertiary: "#6B7280",
    muted: "#4B5563",
    inverse: "#0A0E17",
  },
  border: {
    soft: "rgba(255, 255, 255, 0.06)",
    medium: "rgba(255, 255, 255, 0.10)",
    strong: "rgba(255, 255, 255, 0.18)",
    accent: "rgba(34, 197, 94, 0.45)",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -1, lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.5, lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: "600" as const, letterSpacing: -0.3, lineHeight: 26 },
  h4: { fontSize: 17, fontWeight: "600" as const, letterSpacing: -0.2, lineHeight: 22 },
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: "400" as const, lineHeight: 18, color: colors.text.secondary },
  micro: { fontSize: 11, fontWeight: "600" as const, letterSpacing: 1, textTransform: "uppercase" as const },
};

export const shadows = {
  glow: {
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};
