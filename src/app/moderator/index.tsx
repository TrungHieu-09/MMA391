import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

const SPACING = {
  base: 8,
  marginMobile: 16,
  gutter: 24,
};

const COLORS = {
  surface: "#faf8ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f3fe",
  surfaceContainerHigh: "#e7e7f3",
  onSurface: "#191b23",
  onSurfaceVariant: "#434655",
  primary: "#004ac6",
  onPrimary: "#ffffff",
  primaryContainer: "#2563eb",
  onPrimaryContainer: "#eeefff",
  primaryFixedDim: "#b4c5ff",
  outline: "#737686",
  outlineVariant: "#c3c6d7",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
};

export default function ModeratorReviewQueue() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Top Navigation */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>AcademiShare</ThemedText>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <SymbolView
              name="line.3.horizontal.decrease"
              size={24}
              tintColor={COLORS.onSurfaceVariant}
            />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <SymbolView
              name="bell"
              size={24}
              tintColor={COLORS.onSurfaceVariant}
            />
          </Pressable>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOdq3b_ELYMC3GxquZ7RauzvzJ1pHpMfQQrorUfffyd_17r085qf5-VDo_tbKXmF7wHmykjJTozbpZ1TVNWoFmCwhZDY1dnPGSwk2XO-8bo-kYFGg-_BZqDhSl37KgNuJRR8jaqk4y-7pWYY09g8q--SUumhwSPTxLbMb5m84GyF68wDcKUE1AsUixdGwr9QeL4zaC2sAvFTWbPk0oMt2v9Rd-qCdCDR0sJUgAjYmwtjT5NJnGazypV9ma9i_j8OnIIMkdTuQ34E0",
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <Pressable style={[styles.filterTab, styles.filterTabActive]}>
            <ThemedText style={styles.filterTabTextActive}>
              Pending Review
            </ThemedText>
          </Pressable>
          <Pressable style={styles.filterTab}>
            <ThemedText style={styles.filterTabText}>High Urgency</ThemedText>
          </Pressable>
          <Pressable style={styles.filterTab}>
            <ThemedText style={styles.filterTabText}>
              Computer Science
            </ThemedText>
          </Pressable>
          <Pressable style={styles.filterTab}>
            <ThemedText style={styles.filterTabText}>Mathematics</ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      {/* Document List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Card 1 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <ThemedText style={styles.cardTitle} numberOfLines={2}>
                Advanced Algorithms for Quantum Computing Applications in
                Cryptography
              </ThemedText>
              <ThemedText style={styles.cardMeta}>
                by Dr. Elena Rostova • Uploaded 2h ago
              </ThemedText>
            </View>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>PDF • 2.4MB</ThemedText>
            </View>
          </View>

          <View style={styles.excerptBox}>
            <ThemedText style={styles.excerptText} numberOfLines={2}>
              This paper explores the theoretical limits of current post-quantum
              cryptographic methods against Shor's algorithm variants...
            </ThemedText>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [
                styles.rejectBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <SymbolView
                name="xmark.circle"
                size={16}
                tintColor={COLORS.error}
              />
              <ThemedText style={styles.rejectBtnText}>Reject</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.detailBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={() => router.push("/moderator/document-review")}
            >
              <SymbolView name="eye" size={16} tintColor={COLORS.onPrimary} />
              <ThemedText style={styles.detailBtnText}>See Detail</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Document Card 2 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <ThemedText style={styles.cardTitle} numberOfLines={2}>
                Introduction to Machine Learning: Neural Networks and Deep
                Learning Fundamentals
              </ThemedText>
              <ThemedText style={styles.cardMeta}>
                by Prof. Alan Turing • Uploaded 4h ago
              </ThemedText>
            </View>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>DOCX • 1.1MB</ThemedText>
            </View>
          </View>

          <View style={styles.excerptBox}>
            <ThemedText style={styles.excerptText} numberOfLines={2}>
              A comprehensive guide for beginners outlining the basic
              architecture of perceptrons and backpropagation algorithms...
            </ThemedText>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [
                styles.rejectBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <SymbolView
                name="xmark.circle"
                size={16}
                tintColor={COLORS.error}
              />
              <ThemedText style={styles.rejectBtnText}>Reject</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.detailBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={() => router.push("/moderator/document-review")}
            >
              <SymbolView name="eye" size={16} tintColor={COLORS.onPrimary} />
              <ThemedText style={styles.detailBtnText}>See Detail</ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Document Card 3 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.urgentIconWrapper}>
              <SymbolView
                name="exclamationmark"
                size={24}
                tintColor={COLORS.error}
                weight="bold"
              />
            </View>
            <View style={[styles.cardHeaderLeft, { flex: 1 }]}>
              <ThemedText style={styles.cardTitle} numberOfLines={2}>
                Report on Academic Integrity Policy Violations Q3
              </ThemedText>
              <ThemedText style={styles.cardMeta}>
                by Admin • Uploaded 5h ago
              </ThemedText>
            </View>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>PDF • 500KB</ThemedText>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              style={({ pressed }) => [
                styles.rejectBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <SymbolView
                name="xmark.circle"
                size={16}
                tintColor={COLORS.error}
              />
              <ThemedText style={styles.rejectBtnText}>Reject</ThemedText>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.detailBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={() => router.push("/moderator/document-review")}
            >
              <SymbolView name="eye" size={16} tintColor={COLORS.onPrimary} />
              <ThemedText style={styles.detailBtnText}>See Detail</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.marginMobile,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.marginMobile,
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  filterContainer: {
    height: 52,
    justifyContent: "center",
  },
  filterScroll: {
    paddingHorizontal: SPACING.marginMobile,
    alignItems: "center",
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryContainer,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
  },
  filterTabTextActive: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onPrimaryContainer,
  },
  listContainer: {
    padding: SPACING.marginMobile,
    paddingTop: SPACING.base,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  urgentIconWrapper: {
    marginRight: 4,
    marginTop: 2,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
    lineHeight: 19.6,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.onSurfaceVariant,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.surfaceContainerHigh,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.onSurfaceVariant,
  },
  excerptBox: {
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
  },
  excerptText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    lineHeight: 25.6,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 4,
  },
  rejectBtnText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "600",
  },
  detailBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  detailBtnText: {
    color: COLORS.onPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  btnPressed: {
    opacity: 0.8,
  },
});
