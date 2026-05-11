import React, { useState } from "react";
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
import AmbientGlow from "../../src/components/AmbientGlow";
import { mockArticles } from "../../src/data/mock";
import { colors, spacing, radius } from "../../src/theme";

const tabs = [
  { id: "for-you", label: "For You" },
  { id: "read", label: "Read" },
  { id: "listen", label: "Listen" },
  { id: "watch", label: "Watch" },
];

export default function Learn() {
  const [tab, setTab] = useState("for-you");

  const filtered =
    tab === "for-you"
      ? mockArticles
      : mockArticles.filter((a) => a.type === tab);

  return (
    <SafeAreaView style={styles.container} testID="learn-screen">
      <AmbientGlow size={300} top={-100} left={120} opacity={0.13} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Learn</Text>
        <Text style={styles.subtitle}>Curated knowledge for you.</Text>

        <View style={styles.tabs}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.id}
              testID={`learn-tab-${t.id}`}
              style={[styles.tab, tab === t.id && styles.tabActive]}
              onPress={() => setTab(t.id)}
            >
              <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.map((article) => (
          <TouchableOpacity
            key={article.id}
            testID={`article-${article.id}`}
            activeOpacity={0.85}
            style={styles.articleCard}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <View style={styles.articleMeta}>
                <Ionicons
                  name={
                    article.type === "watch"
                      ? "play-circle-outline"
                      : article.type === "listen"
                      ? "headset-outline"
                      : "book-outline"
                  }
                  size={13}
                  color={colors.accent.primary}
                />
                <Text style={styles.articleDuration}>{article.duration}</Text>
              </View>
            </View>
            <View style={styles.imageWrap}>
              <Image source={{ uri: article.image }} style={styles.articleImage} />
              {article.type === "watch" && (
                <View style={styles.playOverlay}>
                  <Ionicons name="play" size={18} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
    marginTop: spacing.sm,
  },
  subtitle: { color: colors.text.secondary, fontSize: 14, marginTop: 6 },
  tabs: {
    flexDirection: "row",
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  tabActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  tabText: { color: colors.text.secondary, fontSize: 12, fontWeight: "600" },
  tabTextActive: { color: "#0A0E17" },
  articleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg.cardSolid,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: radius.xl,
    padding: 14,
    marginBottom: 12,
  },
  articleTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  articleMeta: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  articleDuration: {
    color: colors.text.secondary,
    fontSize: 11,
    marginLeft: 6,
  },
  imageWrap: {
    width: 88,
    height: 88,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.bg.tertiary,
  },
  articleImage: { width: "100%", height: "100%" },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
});
