import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
};

const COLORS = {
  surface: "#faf8ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f3f3fe",
  surfaceContainer: "#ededf9",
  onSurface: "#191b23",
  onSurfaceVariant: "#434655",
  primary: "#004ac6",
  onPrimary: "#ffffff",
  secondary: "#2b6193",
  outline: "#737686",
  outlineVariant: "#c3c6d7",
};

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Header & Search Area */}
      <View style={styles.header}>
        {/* Branding Row */}
        <View style={styles.brandingRow}>
          <ThemedText style={styles.brandTitle}>AcademiShare</ThemedText>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQgyP51IX2z_34BVAwJF797GatcA3vKSHtYeBPvLhV-5v5vMOKAm4XYjOSjgjxzSPcIUXOlWEMg625Tqxubh4vxwB512SZ2NIr5xRgWOH4wEX06lX7p9e4Wv4fK7R4Pel36hJGKfkOsLyrFKVxj439Dgv15Wl-EEL3BdThqS8dm2JY2RQ_wDYnpIApeXvYRqjE6qtZWSsmsORQfvbYMIXGDwHCmBfYvE3Fq7JvV_rcLVzpo_b2kWMihUhWM8zlnGDaFrEEc4Isc9k",
              }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* AI Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <SymbolView name="magnifyingglass" size={20} tintColor={COLORS.outline} />
            <TextInput
              style={styles.searchInput}
              placeholder="Hỏi AI hoặc tìm kiếm tài liệu..."
              placeholderTextColor={COLORS.outline}
            />
            <SymbolView name="sparkles" size={20} tintColor={COLORS.primary} type="hierarchical" />
          </View>
        </View>

        {/* Quick Prompts */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptsScroll}
        >
          <Pressable style={styles.promptChip}>
            <ThemedText style={styles.promptText}>Tóm tắt PDF</ThemedText>
          </Pressable>
          <Pressable style={styles.promptChip}>
            <ThemedText style={styles.promptText}>Tìm bài tập Giải tích</ThemedText>
          </Pressable>
          <Pressable style={styles.promptChip}>
            <ThemedText style={styles.promptText}>Đề thi ĐH</ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.mainContent} showsVerticalScrollIndicator={false}>
        {/* Trending Documents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Tài liệu thịnh hành</ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAllText}>Xem tất cả</ThemedText>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {/* Card 1 */}
            <Pressable 
               style={styles.docCard}
               onPress={() => router.push("/document-detail")}
            >
              <View style={styles.docCardIconBg}>
                 <SymbolView name="doc.text.fill" size={40} tintColor={COLORS.primary} style={{ opacity: 0.8 }} />
              </View>
              <View style={styles.docCardInfo}>
                <ThemedText style={styles.docCardTitle} numberOfLines={2}>
                  Đề cương chi tiết Giải tích 1 - HK2023
                </ThemedText>
                <View style={styles.docCardMeta}>
                  <SymbolView name="arrow.down.to.line" size={14} tintColor={COLORS.onSurfaceVariant} />
                  <ThemedText style={styles.docCardMetaText}>2.4k</ThemedText>
                </View>
              </View>
            </Pressable>

            {/* Card 2 */}
            <Pressable 
                style={styles.docCard}
                onPress={() => router.push("/document-detail")}
            >
              <View style={styles.docCardIconBg}>
                 <SymbolView name="doc.plaintext.fill" size={40} tintColor={COLORS.secondary} style={{ opacity: 0.8 }} />
              </View>
              <View style={styles.docCardInfo}>
                <ThemedText style={styles.docCardTitle} numberOfLines={2}>
                  Tiểu luận Triết học Mác - Lênin (Điểm A)
                </ThemedText>
                <View style={styles.docCardMeta}>
                  <SymbolView name="arrow.down.to.line" size={14} tintColor={COLORS.onSurfaceVariant} />
                  <ThemedText style={styles.docCardMetaText}>1.1k</ThemedText>
                </View>
              </View>
            </Pressable>

            {/* Card 3 */}
            <Pressable 
                style={styles.docCard}
                onPress={() => router.push("/document-detail")}
            >
              <View style={styles.docCardIconBg}>
                 <SymbolView name="folder.fill" size={40} tintColor={COLORS.primary} style={{ opacity: 0.8 }} />
              </View>
              <View style={styles.docCardInfo}>
                <ThemedText style={styles.docCardTitle} numberOfLines={2}>
                  Bộ source code Đồ án Web Căn bản
                </ThemedText>
                <View style={styles.docCardMeta}>
                  <SymbolView name="arrow.down.to.line" size={14} tintColor={COLORS.onSurfaceVariant} />
                  <ThemedText style={styles.docCardMetaText}>856</ThemedText>
                </View>
              </View>
            </Pressable>
          </ScrollView>
        </View>

        {/* Recommended Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Khóa học đề xuất</ThemedText>
            <Pressable>
              <ThemedText style={styles.seeAllText}>Xem tất cả</ThemedText>
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {/* Course Card 1 */}
            <Pressable style={styles.courseCard}>
              <View style={styles.courseImageWrapper}>
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop" }}
                  style={styles.courseImage}
                />
              </View>
              <View style={styles.courseInfo}>
                <View style={styles.courseBadge}>
                  <ThemedText style={styles.courseBadgeText}>CNTT</ThemedText>
                </View>
                <ThemedText style={styles.courseTitle} numberOfLines={2}>
                  Nhập môn Lập trình Python & Phân tích Dữ liệu
                </ThemedText>
                <ThemedText style={styles.courseAuthor}>ThS. Nguyễn Văn A</ThemedText>
              </View>
            </Pressable>

            {/* Course Card 2 */}
            <Pressable style={styles.courseCard}>
              <View style={styles.courseImageWrapper}>
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop" }}
                  style={styles.courseImage}
                />
              </View>
              <View style={styles.courseInfo}>
                <View style={[styles.courseBadge, { borderColor: COLORS.secondary }]}>
                  <ThemedText style={[styles.courseBadgeText, { color: COLORS.secondary }]}>KINH TẾ</ThemedText>
                </View>
                <ThemedText style={styles.courseTitle} numberOfLines={2}>
                  Kinh tế Vĩ mô - Nền tảng và Ứng dụng thực tiễn
                </ThemedText>
                <ThemedText style={styles.courseAuthor}>TS. Lê Thị B</ThemedText>
              </View>
            </Pressable>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Manual Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 16 }]}>
        <Pressable style={styles.navItem}>
          <SymbolView name="house.fill" size={24} tintColor={COLORS.primary} />
          <ThemedText style={[styles.navText, { color: COLORS.primary, fontWeight: "600" }]}>Trang chủ</ThemedText>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push("/moderator")}>
          <SymbolView name="books.vertical" size={24} tintColor={COLORS.onSurfaceVariant} />
          <ThemedText style={styles.navText}>Kiểm duyệt</ThemedText>
        </Pressable>
        <Pressable style={styles.navItem}>
          <SymbolView name="arrow.up.doc" size={24} tintColor={COLORS.onSurfaceVariant} />
          <ThemedText style={styles.navText}>Tải lên</ThemedText>
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
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    paddingBottom: 12,
  },
  brandingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    height: 56,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 4,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 9999,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.onSurface,
    marginHorizontal: 12,
  },
  promptsScroll: {
    paddingHorizontal: SPACING.md,
    marginTop: 12,
    gap: 8,
  },
  promptChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
  },
  promptText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    fontWeight: "500",
  },
  mainContent: {
    paddingTop: SPACING.lg,
    paddingBottom: 100, // Make room for bottom nav
    gap: SPACING.xl,
  },
  section: {
    // Basic section styling
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  seeAllText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
    marginBottom: 4, // Align visually with the larger heading
  },
  horizontalScroll: {
    paddingHorizontal: SPACING.md,
    gap: 16,
  },
  docCard: {
    width: 180,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 8,
    overflow: "hidden",
  },
  docCardIconBg: {
    height: 112,
    backgroundColor: COLORS.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    justifyContent: "center",
    alignItems: "center",
  },
  docCardInfo: {
    padding: 12,
  },
  docCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
    lineHeight: 19.6,
    marginBottom: 8,
    minHeight: 40,
  },
  docCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  docCardMetaText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    fontWeight: "500",
  },
  courseCard: {
    width: 240,
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 8,
    overflow: "hidden",
  },
  courseImageWrapper: {
    height: 128,
    backgroundColor: COLORS.surfaceContainerLow,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
  },
  courseImage: {
    width: "100%",
    height: "100%",
  },
  courseInfo: {
    padding: 16,
  },
  courseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginBottom: 8,
  },
  courseBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.primary,
    textTransform: "uppercase",
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
    minHeight: 40,
    marginBottom: 4,
  },
  courseAuthor: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: COLORS.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
    paddingTop: 12,
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navText: {
    fontSize: 10,
    color: COLORS.onSurfaceVariant,
  },
});