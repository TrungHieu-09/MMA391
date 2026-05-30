import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
  surfaceContainerLow: "#f3f3fe",
  onSurface: "#191b23",
  onSurfaceVariant: "#434655",
  primary: "#004ac6",
  onPrimary: "#ffffff",
  outline: "#737686",
  outlineVariant: "#c3c6d7",
  surfaceContainerHighest: "#e1e2ed",
};

export default function DocumentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Action Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <SymbolView
            name={{ ios: "arrow.left", android: "arrow.back", web: "arrow.left" } as any}
            size={24}
            tintColor={COLORS.onSurface}
          />
        </Pressable>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <SymbolView name="bookmark" size={24} tintColor={COLORS.onSurface} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <SymbolView name={{ ios: "ellipsis", android: "ellipsis.vertical", web: "ellipsis" } as any} size={24} tintColor={COLORS.onSurface} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Document Preview */}
        <View style={styles.previewContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=600&auto=format&fit=crop",
            }}
            style={styles.previewImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.contentSection}>
          {/* Document Meta Header */}
          <View style={styles.titleRow}>
            <ThemedText style={styles.documentTitle} numberOfLines={3}>
              Cấu trúc Dữ liệu và Giải thuật: Hướng dẫn Toàn diện
            </ThemedText>
          </View>

          <View style={styles.metaInfoRow}>
            <View style={styles.metaInfoItem}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: "https://i.pravatar.cc/100?img=11" }}
                  style={styles.authorAvatar}
                />
              </View>
              <ThemedText style={styles.authorName}>Nguyễn Văn A</ThemedText>
            </View>
            <View style={styles.metaInfoItem}>
              <SymbolView name="calendar" size={20} tintColor={COLORS.onSurfaceVariant} />
              <ThemedText style={styles.metaText}>12 Thg 10, 2023</ThemedText>
            </View>
          </View>
          
          <View style={[styles.metaInfoRow, { marginTop: 12 }]}>
            <View style={styles.metaInfoItem}>
              <SymbolView name="eye" size={20} tintColor={COLORS.onSurfaceVariant} />
              <ThemedText style={styles.metaText}>4.2k lượt xem</ThemedText>
            </View>
            <View style={styles.metaInfoItem}>
              <SymbolView name="arrow.down.to.line" size={20} tintColor={COLORS.onSurfaceVariant} />
              <ThemedText style={styles.metaText}>850 lượt tải</ThemedText>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <ThemedText style={styles.sectionTitle}>Mô tả tài liệu</ThemedText>
          <ThemedText style={styles.descriptionText}>
            Tài liệu này cung cấp một cái nhìn sâu sắc về các cấu trúc dữ liệu cơ bản và nâng cao, cùng với các thuật toán cốt lõi trong khoa học máy tính. Bao gồm các ví dụ thực tế và mã nguồn minh họa bằng ngôn ngữ C++ và Python.
          </ThemedText>
          <ThemedText style={styles.descriptionText}>
            Đặc biệt hữu ích cho sinh viên năm 2 và năm 3 đang ôn tập cho kỳ thi cuối kỳ môn Cấu trúc Dữ liệu hoặc chuẩn bị cho các buổi phỏng vấn kỹ thuật.
          </ThemedText>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <ThemedText style={styles.tagText}>Khoa học Máy tính</ThemedText>
            </View>
            <View style={styles.tag}>
              <ThemedText style={styles.tagText}>Lập trình</ThemedText>
            </View>
            <View style={styles.tag}>
              <ThemedText style={styles.tagText}>Thuật toán</ThemedText>
            </View>
          </View>
          
          {/* Related Documents */}
          <ThemedText style={[styles.sectionTitle, { marginTop: 32 }]}>Tài liệu liên quan</ThemedText>
          
          <Pressable style={styles.relatedCard}>
             <Image
                source={{ uri: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=200&auto=format&fit=crop" }}
                style={styles.relatedImage}
              />
              <View style={styles.relatedInfo}>
                 <ThemedText style={styles.relatedTitle}>Lập trình Hướng đối tượng với Java</ThemedText>
                 <View style={styles.relatedMetaRow}>
                    <ThemedText style={styles.relatedAuthor}>Trần Thị B</ThemedText>
                    <View style={styles.relatedMetaItem}>
                      <SymbolView name="arrow.down.to.line" size={14} tintColor={COLORS.onSurfaceVariant} />
                      <ThemedText style={styles.relatedMetaText}>520</ThemedText>
                    </View>
                 </View>
              </View>
          </Pressable>

          <Pressable style={styles.relatedCard}>
             <Image
                source={{ uri: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=200&auto=format&fit=crop" }}
                style={styles.relatedImage}
              />
              <View style={styles.relatedInfo}>
                 <ThemedText style={styles.relatedTitle}>Nhập môn Cơ sở dữ liệu Quan hệ</ThemedText>
                 <View style={styles.relatedMetaRow}>
                    <ThemedText style={styles.relatedAuthor}>Lê Văn C</ThemedText>
                    <View style={styles.relatedMetaItem}>
                      <SymbolView name="arrow.down.to.line" size={14} tintColor={COLORS.onSurfaceVariant} />
                      <ThemedText style={styles.relatedMetaText}>1.2k</ThemedText>
                    </View>
                 </View>
              </View>
          </Pressable>

        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.actionFooter}>
        <Pressable style={({ pressed }) => [styles.shareBtn, pressed && styles.btnPressed]}>
          <SymbolView
            name={{ ios: "square.and.arrow.up", android: "share", web: "square.and.arrow.up" } as any}
            size={24}
            tintColor={COLORS.onSurface}
          />
        </Pressable>
        <Pressable style={({ pressed }) => [styles.downloadBtn, pressed && styles.btnPressed]}>
          <SymbolView name="arrow.down.to.line" size={20} tintColor={COLORS.onPrimary} />
          <ThemedText style={styles.downloadBtnText}>Tải về (2.4 MB)</ThemedText>
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
    paddingHorizontal: SPACING.sm,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outlineVariant,
    backgroundColor: COLORS.surface,
    zIndex: 10,
  },
  headerRight: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.sm,
    borderRadius: 9999,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  previewContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.surfaceContainerHighest,
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
  },
  contentSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  titleRow: {
    marginBottom: SPACING.md,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.onSurface,
    lineHeight: 30,
  },
  metaInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
  },
  metaInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    overflow: 'hidden',
  },
  authorAvatar: {
    width: '100%',
    height: '100%',
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
  },
  metaText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.outlineVariant,
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.onSurface,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    lineHeight: 25.6,
    marginBottom: SPACING.md,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 9999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.onSurfaceVariant,
  },
  relatedCard: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    borderRadius: 4,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  relatedImage: {
    width: 64,
    height: 64,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceContainerHighest,
  },
  relatedInfo: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  relatedTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.onSurface,
    lineHeight: 20,
  },
  relatedMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginTop: 8,
  },
  relatedAuthor: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  relatedMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  relatedMetaText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
  },
  actionFooter: {
    flexDirection: "row",
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.outlineVariant,
  },
  shareBtn: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.outlineVariant,
    backgroundColor: "transparent",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  downloadBtnText: {
    color: COLORS.onPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  btnPressed: {
    opacity: 0.8,
  },
});