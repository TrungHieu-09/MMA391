import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MOCK_COMMENTS, MOCK_CURRENT_USER } from "@/mock/data";
import { deleteDocument, getDocumentById } from "@/services/documentService";
import { Comment, Document } from "@/types";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  surface: "#faf8ff",
  surfaceLowest: "#ffffff",
  surfaceLow: "#f3f3fe",
  surfaceContainer: "#ededf9",
  onSurface: "#191b23",
  onSurfaceVariant: "#434655",
  primary: "#004ac6",
  primaryContainer: "#dce6ff",
  onPrimary: "#ffffff",
  secondary: "#2b6193",
  outline: "#737686",
  outlineVariant: "#c3c6d7",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  success: "#1a6b3c",
  successContainer: "#b7f0d2",
};
const S = { sm: 8, md: 16, lg: 24 };

// ── HELPERS ───────────────────────────────────────────────────────────────────
function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function fileTypeColor(type: string): string {
  switch (type) {
    case "pdf":
      return "#e53935";
    case "docx":
      return "#1565c0";
    default:
      return C.primary;
  }
}

function statusLabel(status: string): {
  label: string;
  color: string;
  bg: string;
} {
  switch (status) {
    case "approved":
      return { label: "Đã duyệt", color: C.success, bg: C.successContainer };
    case "pending":
      return { label: "Chờ duyệt", color: "#7c4f00", bg: "#ffefc2" };
    case "rejected":
      return { label: "Bị từ chối", color: C.error, bg: C.errorContainer };
    case "deleted":
      return { label: "Đã xóa", color: C.outline, bg: C.surfaceContainer };
    default:
      return { label: status, color: C.outline, bg: C.surfaceContainer };
  }
}

// ── MAIN SCREEN ───────────────────────────────────────────────────────────────
export default function DocumentDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = doc?.uploadedBy.id === MOCK_CURRENT_USER.id;

  useEffect(() => {
    const docId = id ?? "d1";
    getDocumentById(docId)
      .then((data) => {
        setDoc(data);
        setComments(MOCK_COMMENTS.filter((c) => c.documentId === docId));
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ── HANDLERS ──────────────────────────────────────────────────────────────
  const handleDownload = () => {
    Alert.alert("Tải xuống", `Đang tải "${doc?.title}"...`);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    const comment: Comment = {
      id: `c_${Date.now()}`,
      documentId: doc?.id ?? "",
      user: MOCK_CURRENT_USER,
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
    setSubmitting(false);
  };

  const handleEdit = () => {
    router.push({ pathname: "/upload", params: { id: doc?.id, mode: "edit" } });
  };

  const handleDelete = () => {
    Alert.alert(
      "Xóa tài liệu",
      `Tài liệu "${doc?.title}" sẽ được chuyển vào thùng rác. Bạn có thể khôi phục trong 30 ngày.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            if (!doc) return;
            setDeleting(true);
            await deleteDocument(doc.id);
            setDeleting(false);
            Alert.alert("Đã xóa", "Tài liệu đã được chuyển vào thùng rác.", [
              { text: "OK", onPress: () => router.back() },
            ]);
          },
        },
      ],
    );
  };

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Đang tải tài liệu...</Text>
      </View>
    );
  }

  if (!doc) {
    return (
      <View style={styles.loadingWrap}>
        <SymbolView name="doc.questionmark" size={48} tintColor={C.outline} />
        <Text style={styles.emptyText}>Không tìm thấy tài liệu</Text>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </Pressable>
      </View>
    );
  }

  const status = statusLabel(doc.status);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <Pressable style={styles.backIcon} onPress={() => router.back()}>
          <SymbolView name="chevron.left" size={20} tintColor={C.onSurface} />
        </Pressable>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          Chi tiết tài liệu
        </Text>
        <View style={styles.topBarActions}>
          {isOwner && (
            <>
              <Pressable style={styles.topBarBtn} onPress={handleEdit}>
                <Text style={{ fontSize: 18 }}>✏️</Text>
              </Pressable>
              <Pressable
                style={styles.topBarBtn}
                onPress={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color={C.error} />
                ) : (
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* ── THUMBNAIL / PREVIEW ── */}
        <View style={styles.previewWrap}>
          {doc.thumbnailUrl ? (
            <Image
              source={{ uri: doc.thumbnailUrl }}
              style={styles.previewImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.previewPlaceholder}>
              <SymbolView
                name="doc.text.fill"
                size={64}
                tintColor={fileTypeColor(doc.fileType)}
                type="hierarchical"
              />
              <Text style={styles.previewFileType}>
                {doc.fileType.toUpperCase()}
              </Text>
            </View>
          )}

          {/* File type badge */}
          <View
            style={[
              styles.fileTypeBadge,
              { backgroundColor: fileTypeColor(doc.fileType) },
            ]}
          >
            <Text style={styles.fileTypeBadgeText}>
              {doc.fileType.toUpperCase()}
            </Text>
          </View>

          {/* Visibility badge */}
          <View
            style={[
              styles.visibilityBadge,
              {
                backgroundColor:
                  doc.visibility === "public"
                    ? C.primaryContainer
                    : C.surfaceContainer,
              },
            ]}
          >
            <SymbolView
              name={doc.visibility === "public" ? "globe" : "lock.fill"}
              size={12}
              tintColor={doc.visibility === "public" ? C.primary : C.outline}
            />
            <Text
              style={[
                styles.visibilityBadgeText,
                { color: doc.visibility === "public" ? C.primary : C.outline },
              ]}
            >
              {doc.visibility === "public" ? "Công khai" : "Cá nhân"}
            </Text>
          </View>
        </View>

        {/* ── TITLE & META ── */}
        <View style={styles.section}>
          {doc.subject && (
            <Text style={styles.subjectCode}>
              {doc.subject.code} · {doc.subject.name}
            </Text>
          )}
          <Text style={styles.title}>{doc.title}</Text>

          {/* Status */}
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <StatItem
              icon="arrow.down.to.line"
              value={formatCount(doc.downloadCount)}
              label="Lượt tải"
            />
            <View style={styles.statDivider} />
            <StatItem
              icon="eye"
              value={formatCount(doc.viewCount)}
              label="Lượt xem"
            />
            <View style={styles.statDivider} />
            <StatItem
              icon="doc.fill"
              value={`${doc.fileSizeMb} MB`}
              label="Dung lượng"
            />
          </View>
        </View>

        {/* ── UPLOADER ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người đăng</Text>
          <View style={styles.uploaderRow}>
            <Image
              source={{
                uri:
                  doc.uploadedBy.avatarUrl ?? "https://i.pravatar.cc/150?img=1",
              }}
              style={styles.uploaderAvatar}
              contentFit="cover"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.uploaderName}>{doc.uploadedBy.fullName}</Text>
              <Text style={styles.uploaderMeta}>
                {doc.uploadedBy.studentId} · {formatDate(doc.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── DESCRIPTION ── */}
        {doc.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả tài liệu</Text>
            <Text style={styles.description}>{doc.description}</Text>
          </View>
        )}

        {/* ── TAGS ── */}
        {doc.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsRow}>
              {doc.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── COMMENTS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bình luận ({comments.length})</Text>

          {comments.length === 0 ? (
            <Text style={styles.emptyComments}>
              Chưa có bình luận nào. Hãy là người đầu tiên!
            </Text>
          ) : (
            comments.map((c) => (
              <View key={c.id} style={styles.commentItem}>
                <Image
                  source={{
                    uri: c.user.avatarUrl ?? "https://i.pravatar.cc/150?img=1",
                  }}
                  style={styles.commentAvatar}
                  contentFit="cover"
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{c.user.fullName}</Text>
                    <Text style={styles.commentDate}>
                      {formatDate(c.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{c.content}</Text>
                </View>
              </View>
            ))
          )}

          {/* Add comment */}
          <View style={styles.commentInputRow}>
            <Image
              source={{ uri: MOCK_CURRENT_USER.avatarUrl }}
              style={styles.commentAvatar}
              contentFit="cover"
            />
            <View style={styles.commentInputWrap}>
              <TextInput
                style={styles.commentInput}
                placeholder="Thêm bình luận..."
                placeholderTextColor={C.outline}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <Pressable
                style={[
                  styles.commentSendBtn,
                  !newComment.trim() && { opacity: 0.4 },
                ]}
                onPress={handleAddComment}
                disabled={!newComment.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={C.onPrimary} />
                ) : (
                  <SymbolView
                    name="paperplane.fill"
                    size={16}
                    tintColor={C.onPrimary}
                  />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ── */}
      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom || S.md }]}
      >
        <Pressable
          style={styles.previewBtn}
          onPress={() =>
            Alert.alert("Preview", "Tính năng xem trước PDF sẽ dùng PDF.js")
          }
        >
          <SymbolView name="eye.fill" size={18} tintColor={C.primary} />
          <Text style={styles.previewBtnText}>Xem trước</Text>
        </Pressable>
        <Pressable style={styles.downloadBtn} onPress={handleDownload}>
          <SymbolView
            name="arrow.down.to.line"
            size={18}
            tintColor={C.onPrimary}
          />
          <Text style={styles.downloadBtnText}>Tải xuống</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ── STAT ITEM ─────────────────────────────────────────────────────────────────
function StatItem({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statItem}>
      <SymbolView name={icon as any} size={18} tintColor={C.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },

  loadingWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: S.md,
  },
  loadingText: { fontSize: 14, color: C.onSurfaceVariant },
  emptyText: { fontSize: 16, color: C.onSurfaceVariant, marginTop: S.sm },
  backBtn: {
    marginTop: S.md,
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    backgroundColor: C.primary,
    borderRadius: 8,
  },
  backBtnText: { color: C.onPrimary, fontWeight: "600" },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: S.md,
    height: 52,
    backgroundColor: C.surfaceLowest,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
  },
  backIcon: { padding: 4, marginRight: S.sm },
  topBarTitle: { flex: 1, fontSize: 16, fontWeight: "600", color: C.onSurface },
  topBarActions: {
    flexDirection: "row",
    gap: 4,
    minWidth: 80,
    justifyContent: "flex-end",
  },
  topBarBtn: { padding: 8 },

  // Body
  body: { gap: S.lg },

  // Preview
  previewWrap: { position: "relative" },
  previewImage: { width: "100%", height: 220, backgroundColor: C.surfaceLow },
  previewPlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: C.surfaceLow,
    justifyContent: "center",
    alignItems: "center",
    gap: S.sm,
  },
  previewFileType: {
    fontSize: 13,
    fontWeight: "700",
    color: C.onSurfaceVariant,
  },
  fileTypeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  fileTypeBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  visibilityBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  visibilityBadgeText: { fontSize: 11, fontWeight: "600" },

  // Section
  section: {
    marginHorizontal: S.md,
    backgroundColor: C.surfaceLowest,
    borderRadius: 12,
    padding: S.md,
    gap: S.sm,
    borderWidth: 1,
    borderColor: C.outlineVariant,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Title
  subjectCode: {
    fontSize: 12,
    fontWeight: "600",
    color: C.primary,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: C.onSurface,
    lineHeight: 28,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusText: { fontSize: 12, fontWeight: "600" },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surfaceLow,
    borderRadius: 8,
    padding: S.md,
    marginTop: 4,
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 15, fontWeight: "700", color: C.onSurface },
  statLabel: { fontSize: 11, color: C.onSurfaceVariant },
  statDivider: { width: 1, height: 32, backgroundColor: C.outlineVariant },

  // Uploader
  uploaderRow: { flexDirection: "row", alignItems: "center", gap: S.md },
  uploaderAvatar: { width: 40, height: 40, borderRadius: 20 },
  uploaderName: { fontSize: 14, fontWeight: "600", color: C.onSurface },
  uploaderMeta: { fontSize: 12, color: C.onSurfaceVariant, marginTop: 2 },

  // Description
  description: { fontSize: 14, color: C.onSurface, lineHeight: 22 },

  // Tags
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: S.sm },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: C.primaryContainer,
    borderRadius: 9999,
  },
  tagText: { fontSize: 12, color: C.primary, fontWeight: "500" },

  // Comments
  emptyComments: {
    fontSize: 13,
    color: C.onSurfaceVariant,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: S.md,
  },
  commentItem: {
    flexDirection: "row",
    gap: S.sm,
    paddingVertical: S.sm,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant,
  },
  commentAvatar: { width: 36, height: 36, borderRadius: 18 },
  commentContent: { flex: 1 },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentAuthor: { fontSize: 13, fontWeight: "600", color: C.onSurface },
  commentDate: { fontSize: 11, color: C.outline },
  commentText: { fontSize: 13, color: C.onSurface, lineHeight: 20 },
  commentInputRow: {
    flexDirection: "row",
    gap: S.sm,
    alignItems: "flex-end",
    marginTop: S.sm,
  },
  commentInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: C.surfaceLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    gap: S.sm,
  },
  commentInput: { flex: 1, fontSize: 14, color: C.onSurface, maxHeight: 80 },
  commentSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: S.md,
    backgroundColor: C.surfaceLowest,
    borderTopWidth: 1,
    borderTopColor: C.outlineVariant,
    paddingHorizontal: S.md,
    paddingTop: S.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  previewBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: S.sm,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.primary,
  },
  previewBtnText: { fontSize: 15, fontWeight: "600", color: C.primary },
  downloadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: S.sm,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: C.primary,
  },
  downloadBtnText: { fontSize: 15, fontWeight: "600", color: C.onPrimary },
});
