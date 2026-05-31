import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const COLORS = {
  surface: "#faf8ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f3fe",
  surfaceContainerHighest: "#e1e2ed",
  onSurface: "#191b23",
  onSurfaceVariant: "#434655",
  primary: "#004ac6",
  onPrimary: "#ffffff",
  primaryContainer: "#2563eb",
  onPrimaryContainer: "#eeefff",
  secondaryContainer: "#93c5fd",
  onSecondaryContainer: "#145283",
  outline: "#737686",
  outlineVariant: "#c3c6d7",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
};

export default function DocumentReviewDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Top Action Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <SymbolView
              name={
                {
                  ios: "arrow.left",
                  android: "arrow.back",
                  web: "arrow.left",
                } as any
              }
              size={24}
              tintColor={COLORS.onSurface}
            />
          </Pressable>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            Kiểm duyệt tài liệu
          </ThemedText>
        </View>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <SymbolView name="flag" size={24} tintColor={COLORS.onSurface} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Preview Area */}
        <View style={styles.previewContainer}>
          <View style={styles.previewContent}>
            <SymbolView
              name="doc.text"
              size={48}
              tintColor={COLORS.primary}
              style={styles.docIcon}
            />
            <ThemedText style={styles.previewSizeText}>
              Tài liệu PDF - 12.4 MB
            </ThemedText>
            <Pressable
              style={({ pressed }) => [
                styles.fullViewBtn,
                pressed && styles.btnPressed,
              ]}
            >
              <SymbolView
                name="magnifyingglass"
                size={20}
                tintColor={COLORS.onPrimary}
              />
              <ThemedText style={styles.fullViewBtnText}>
                Xem toàn bộ trang
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.contentSection}>
          {/* Tags */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                { backgroundColor: COLORS.secondaryContainer },
              ]}
            >
              <ThemedText
                style={[
                  styles.badgeText,
                  { color: COLORS.onSecondaryContainer },
                ]}
              >
                TOÁN HỌC NÂNG CAO
              </ThemedText>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: COLORS.surfaceContainerHighest },
              ]}
            >
              <ThemedText
                style={[styles.badgeText, { color: COLORS.onSurfaceVariant }]}
              >
                NĂM 3
              </ThemedText>
            </View>
          </View>

          {/* Document Title */}
          <ThemedText style={styles.documentTitle}>
            Giải thuật Tối ưu hóa trong Kỹ thuật Điều khiển Tự động
          </ThemedText>

          {/* Grid Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statLabel}>NGƯỜI TẢI LÊN</ThemedText>
              <View style={styles.statValueRow}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/100?img=11" }}
                  style={styles.avatar}
                />
                <ThemedText style={styles.statValueText} numberOfLines={1}>
                  Nguyễn Văn A
                </ThemedText>
              </View>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statLabel}>NGÀY GỬI</ThemedText>
              <ThemedText style={styles.statValueText}>14/10/2023</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statLabel}>SỐ TRANG</ThemedText>
              <ThemedText style={styles.statValueText}>45 trang</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statLabel}>ĐỘ TIN CẬY AI</ThemedText>
              <View style={styles.statValueRow}>
                <View style={styles.blueDot} />
                <ThemedText style={styles.statValueText}>Cao (98%)</ThemedText>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <ThemedText style={styles.sectionTitle}>MÔ TẢ CHI TIẾT</ThemedText>
            <ThemedText style={styles.descriptionText}>
              Tài liệu tổng hợp các thuật toán tối ưu hóa phổ biến như Gradient
              Descent, Genetic Algorithm và Particle Swarm Optimization áp dụng
              trong lĩnh vực Kỹ thuật Điều khiển. Nội dung bao gồm cả lý thuyết
              và ví dụ thực hành trên MATLAB.
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.actionFooter}>
        <Pressable
          style={({ pressed }) => [
            styles.rejectBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <SymbolView name="nosign" size={20} tintColor={COLORS.error} />
          <ThemedText style={styles.rejectBtnText}>Từ chối</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.approveBtn,
            pressed && styles.btnPressed,
          ]}
        >
          <SymbolView
            name="checkmark.circle.fill"
            size={20}
            tintColor={COLORS.onPrimary}
          />
          <ThemedText style={styles.approveBtnText}>Phê duyệt</ThemedText>
        </Pressable>
      </View>
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
    paddingHorizontal: SPACING.md,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surface,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.onSurface,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginLeft: -8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  previewContainer: {
    padding: SPACING.md,
  },
  previewContent: {
    width: "100%",
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.surfaceContainerHighest,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  docIcon: {
    marginBottom: 16,
  },
  previewSizeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
    marginBottom: 16,
  },
  fullViewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  fullViewBtnText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  contentSection: {
    paddingHorizontal: SPACING.md,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.onSurface,
    lineHeight: 30,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 8,
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  statValueText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.onSurface,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    lineHeight: 25.6,
  },
  actionFooter: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 16,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  rejectBtn: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.error,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  rejectBtnText: {
    color: COLORS.error,
    fontWeight: "600",
    fontSize: 16,
  },
  approveBtn: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  approveBtnText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
