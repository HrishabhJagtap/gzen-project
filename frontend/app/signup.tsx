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
import ScreenHeader from "../src/components/ScreenHeader";
import AmbientGlow from "../src/components/AmbientGlow";
import { useAuth } from "../src/context/AuthContext";
import { colors, spacing, radius } from "../src/theme";

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState("Ansh Kumar");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setError(null);
    if (!email.trim() || pw.length < 4) {
      setError("Please enter a valid email and a password (4+ chars).");
      return;
    }
    if (pw !== pw2) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await signUp(name.trim() || "Gzen User", email.trim(), pw);
      router.replace("/goal-setup");
    } catch (e: any) {
      setError(e?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="signup-screen">
      <AmbientGlow size={420} top={-150} left={150} opacity={0.18} />
      <ScreenHeader title="" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <GzenLogo size={48} wordmarkSize={32} />
            <View style={styles.heroIcon}>
              <Ionicons name="rocket-outline" size={36} color={colors.accent.primary} />
            </View>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start your journey to a{"\n"}better digital life.
          </Text>

          <View style={{ marginTop: spacing.xl }}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.accent.primary} style={styles.icon} />
              <TextInput
                testID="signup-name-input"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.text.tertiary}
              />
            </View>

            <Text style={[styles.label, styles.spacer]}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={colors.accent.primary} style={styles.icon} />
              <TextInput
                testID="signup-email-input"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={[styles.label, styles.spacer]}>Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.accent.primary} style={styles.icon} />
              <TextInput
                testID="signup-password-input"
                style={styles.input}
                value={pw}
                onChangeText={setPw}
                placeholder="Create a password"
                placeholderTextColor={colors.text.tertiary}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Ionicons name={showPw ? "eye-outline" : "eye-off-outline"} size={18} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, styles.spacer]}>Confirm Password</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.accent.primary} style={styles.icon} />
              <TextInput
                testID="signup-confirm-input"
                style={styles.input}
                value={pw2}
                onChangeText={setPw2}
                placeholder="Confirm your password"
                placeholderTextColor={colors.text.tertiary}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
              {agreed && <Ionicons name="checkmark" size={14} color="#0A0E17" />}
            </View>
            <Text style={styles.tcText}>
              I agree to the{" "}
              <Text style={styles.link}>Terms of Service</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {error ? (
            <Text testID="signup-error" style={styles.errorText}>{error}</Text>
          ) : null}
          <PrimaryButton
            testID="signup-submit-btn"
            label={loading ? "Creating..." : "Sign Up"}
            loading={loading}
            onPress={handleSignup}
            style={{ marginTop: spacing.lg }}
          />

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socials}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-google" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="call-outline" size={22} color={colors.accent.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.bottomLink}>Login</Text>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -1,
    marginTop: spacing.lg,
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
  spacer: { marginTop: spacing.md },
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
  icon: { marginRight: 10 },
  input: { flex: 1, color: colors.text.primary, fontSize: 15 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border.strong,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxOn: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  tcText: { color: colors.text.secondary, fontSize: 13, flex: 1 },
  link: { color: colors.accent.primary, fontWeight: "600" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: spacing.lg },
  divider: { flex: 1, height: 1, backgroundColor: colors.border.medium },
  dividerText: { color: colors.text.tertiary, paddingHorizontal: 12, fontSize: 12 },
  socials: { flexDirection: "row", justifyContent: "center" },
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
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.xl },
  bottomText: { color: colors.text.secondary, fontSize: 14 },
  bottomLink: { color: colors.accent.primary, fontSize: 14, fontWeight: "700" },
  errorText: {
    color: colors.accent.red,
    fontSize: 13,
    marginTop: spacing.md,
    textAlign: "center",
  },
});
