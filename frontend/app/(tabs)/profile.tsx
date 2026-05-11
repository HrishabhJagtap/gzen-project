import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AmbientGlow from "../../src/components/AmbientGlow";
import { useAuth } from "../../src/context/AuthContext";
import { mockUser } from "../../src/data/mock";
import { colors, spacing, radius } from "../../src/theme";

const items = [
  { id: "goals", label: "My Goals", icon: "flag-outline", route: "/goal-setup" },
  { id: "progress", label: "My Progress", icon: "trending-up-outline", route: "/rewards" },
  { id: "achievements", label: "Achievements", icon: "trophy-outline", route: "/rewards" },
  { id: "history", label: "App Usage History", icon: "time-outline", route: "/(tabs)/insights" },
  { id: "settings", label: "Settings", icon: "settings-outline", route: "/settings" },
] as const;

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const displayName = user?.name || mockUser.fullName;
  const level = user?.level ?? mockUser.level;
  const xp = user?.xp ?? mockUser.xp;
  return (
    <SafeAreaView style={styles.container} testID="profile-screen">
      <AmbientGlow size={350} top={-180} left={-50} opacity={0.16} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{displayName}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.level}>Level {level}</Text>
            <View style={styles.dot} />
            <Text style={styles.xp}>{xp} XP</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} testID="edit-profile-btn">
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menu}>
          {items.map((it) => (
            <TouchableOpacity
              key={it.id}
              testID={`menu-${it.id}`}
              activeOpacity={0.8}
              style={styles.row}
              onPress={() => router.push(it.route as any)}
            >
              <View style={styles.rowIcon}>
                <Ionicons name={it.icon as any} size={18} color={colors.accent.primary} />
              </View>
              <Text style={styles.rowLabel}>{it.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          testID="logout-btn"
          style={styles.logout}
          onPress={async () => {
            await signOut();
            router.replace("/login");
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.accent.red} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: "700",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  profileCard: {
    backgroundColor: colors.bg.cardSolid,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: "center",
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: colors.accent.primary,
  },
  name: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  level: { color: colors.accent.primary, fontSize: 13, fontWeight: "700" },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: 8,
  },
  xp: { color: colors.text.secondary, fontSize: 13 },
  editBtn: {
    marginTop: spacing.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "rgba(34,197,94,0.14)",
    borderColor: "rgba(34,197,94,0.4)",
    borderWidth: 1,
    borderRadius: 999,
  },
  editText: { color: colors.accent.primary, fontSize: 13, fontWeight: "700" },
  menu: { marginTop: spacing.lg },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.cardSolid,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(34,197,94,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  rowLabel: { flex: 1, color: colors.text.primary, fontSize: 14, fontWeight: "500" },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: radius.lg,
    paddingVertical: 14,
    marginTop: spacing.md,
  },
  logoutText: {
    color: colors.accent.red,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
  },
});
