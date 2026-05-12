import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import GzenLogo from "../src/components/GzenLogo";
import PrimaryButton from "../src/components/PrimaryButton";
import AmbientGlow from "../src/components/AmbientGlow";
import { useAuth } from "../src/context/AuthContext";
import { colors, spacing, radius } from "../src/theme";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("demo@gzen.com");
  const [password, setPassword] = useState("123456");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
  setError(null);
  setLoading(true);

  try {
    // Demo login
    if (
      email.trim().toLowerCase() === "demo@gzen.com" &&
      password === "123456"
    ) {
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 800);

      return;
    }

    // Optional real backend login
    await signIn(email.trim(), password);

    router.replace("/(tabs)/home");
  } catch (e: any) {
    setError(
      "Demo Login:\nEmail: demo@gzen.com\nPassword: 123456"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container} testID="login-screen">
      <AmbientGlow size={420} top={-150} left={-80} opacity={0.18} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <GzenLogo size={48} wordmarkSize={32} />
            <View style={styles.heroIcon}>
              <Ionicons name="leaf-outline" size={36} color={colors.accent.primary} />
            </View>
          </View>

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Reclaim your time.{"\n"}Rewire your habits.
          </Text>

          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={colors.accent.primary}
                style={styles.inputIcon}
              />
              <TextInput
                testID="login-email-input"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, { marginTop: spacing.md }]}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={colors.accent.primary}
                style={styles.inputIcon}
              />
              <TextInput
                testID="login-password-input"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.text.tertiary}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons
                  name={showPw ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotWrap}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <Text testID="login-error" style={styles.errorText}>{error}</Text>
          ) : null}
          <PrimaryButton
            testID="login-submit-btn"
            label={loading ? "Signing in..." : "Login"}
            loading={loading}
            onPress={handleLogin}
            style={{ marginTop: spacing.lg }}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socials}>
            <TouchableOpacity style={styles.socialBtn} testID="social-google">
              <Ionicons name="logo-google" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} testID="social-apple">
              <Ionicons name="logo-apple" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} testID="social-phone">
              <Ionicons name="call-outline" size={22} color={colors.accent.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>{"Don't have an account? "}</Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.bottomLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -1,
    marginTop: spacing.xl,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 15,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: colors.border.medium,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    height: 56,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 15,
  },
  forgotWrap: { alignSelf: "flex-end", marginTop: spacing.md },
  forgot: { color: colors.accent.primary, fontSize: 13, fontWeight: "600" },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.border.medium },
  dividerText: {
    color: colors.text.tertiary,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  socials: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14 as any,
  },
  socialBtn: {
    width: 64,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  bottomText: { color: colors.text.secondary, fontSize: 14 },
  bottomLink: { color: colors.accent.primary, fontSize: 14, fontWeight: "700" },
  errorText: {
    color: colors.accent.red,
    fontSize: 13,
    marginTop: spacing.md,
    textAlign: "center",
  },
});
