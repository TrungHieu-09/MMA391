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

import { MOCK_SUBJECTS } from "@/mock/data";
import {
    getDocumentById,
    updateDocument,
    uploadDocument,
} from "@/services/documentService";
import { DocumentVisibility, Subject } from "@/types";

// ── TOKENS ────────────────────────────────────────────────────────────────────
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
  outline: "#737686",
  outlineVariant: "#c3c6d7",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
};
const S = { sm: 8, md: 16, lg: 24 };

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface FormState {
  title: string;
  description: string;
  subjectId: string;
  tags: string;
  visibility: DocumentVisibility;
  fileName: string;
}

const INITIAL_FORM: FormState = {
  title: "",
  description: "",
  subjectId: "",
  tags: "",
  visibility: "public",
  fileName: "",
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function UploadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, mode } = useLocalSearchParams<{ id?: string; mode?: string }>();

  const isEdit = mode === "edit" && !!id;

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);

  // Load existing doc if edit mode
  useEffect(() => {
    if (!isEdit) return;
    getDocumentById(id!).then((doc) => {
      if (!doc) return;
      setForm({
        title: doc.title,
        description: doc.description ?? "",
        subjectId: doc.subject?.id ?? "",
        tags: doc.tags.join(", "),
        visibility: doc.visibility,
        fileName: doc.fileUrl.split("/").pop() ?? "",
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  // ── HELPERS ──────────────────────────────────────────────────────────────
  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const selectedSubject: Subject | undefined = MOCK_SUBJECTS.find(
    (s) => s.id === form.subjectId,
  );

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tiêu đề";
    if (!isEdit && !form.fileName) e.fileName = "Vui lòng chọn file";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePickFile = () => {
    // TODO: integrate expo-document-picker
    // const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', ...] });
    Alert.alert(
      "Chọn file",
      "Tích hợp expo-document-picker khi có backend.\n\nHiện tại dùng file mẫu để test.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Dùng file mẫu",
          onPress: () => set("fileName")("giai-tich-1-de-cuong.pdf"),
        },
      ],
    );
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateDocument(id!, {
          title: form.title,
          description: form.description,
          subjectId: form.subjectId || undefined,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          visibility: form.visibility,
          file: { uri: "", name: form.fileName, type: "application/pdf" },
        });
        Alert.alert("Đã cập nhật", "Tài liệu đã được cập nhật thành công.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        await uploadDocument({
          title: form.title,
          description: form.description,
          subjectId: form.subjectId || undefined,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          visibility: form.visibility,
          file: {
            uri: form.fileName,
            name: form.fileName,
            type: "application/pdf",
          },
        });
        Alert.alert(
          "Tải lên thành công! 🎉",
          form.visibility === "public"
            ? "Tài liệu đang chờ kiểm duyệt trước khi hiển thị công khai."
            : "Tài liệu đã được lưu vào kho cá nhân.",
          [{ text: "OK", onPress: () => router.back() }],
        );
      }
    } catch {
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Pressable style={styles.topBarBtn} onPress={() => router.back()}>
          <SymbolView name="xmark" size={20} tintColor={C.onSurface} />
        </Pressable>
        <Text style={styles.topBarTitle}>
          {isEdit ? "Chỉnh sửa tài liệu" : "Tải lên tài liệu mới"}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* FILE PICKER — chỉ hiện khi upload mới */}
        {!isEdit && (
          <Pressable style={styles.filePicker} onPress={handlePickFile}>
            {form.fileName ? (
              <View style={styles.filePickedRow}>
                <SymbolView name="doc.fill" size={28} tintColor={C.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.filePickedName} numberOfLines={1}>
                    {form.fileName}
                  </Text>
                  <Text style={styles.filePickedSub}>Nhấn để đổi file</Text>
                </View>
                <SymbolView
                  name="checkmark.circle.fill"
                  size={24}
                  tintColor="#1a6b3c"
                />
              </View>
            ) : (
              <View style={styles.filePickerEmpty}>
                <SymbolView
                  name="arrow.up.doc.fill"
                  size={40}
                  tintColor={C.primary}
                />
                <Text style={styles.filePickerTitle}>
                  Kéo thả hoặc nhấn để chọn file
                </Text>
                <Text style={styles.filePickerSub}>
                  PDF, DOCX, TXT, PNG, JPG
                </Text>
              </View>
            )}
          </Pressable>
        )}
        {errors.fileName && (
          <Text style={styles.errorText}>{errors.fileName}</Text>
        )}

        {/* TITLE */}
        <Field label="Tiêu đề *" error={errors.title}>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="VD: Đề cương Giải tích 1 - HK2024"
            placeholderTextColor={C.outline}
            value={form.title}
            onChangeText={set("title")}
            maxLength={200}
          />
          <Text style={styles.charCount}>{form.title.length}/200</Text>
        </Field>

        {/* DESCRIPTION */}
        <Field label="Mô tả">
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Mô tả nội dung tài liệu..."
            placeholderTextColor={C.outline}
            value={form.description}
            onChangeText={set("description")}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
          <Text style={styles.charCount}>{form.description.length}/1000</Text>
        </Field>

        {/* SUBJECT */}
        <Field label="Môn học">
          <Pressable
            style={styles.selector}
            onPress={() => setSubjectOpen((o) => !o)}
          >
            <Text
              style={[
                styles.selectorText,
                !selectedSubject && { color: C.outline },
              ]}
            >
              {selectedSubject
                ? `${selectedSubject.code} · ${selectedSubject.name}`
                : "Chọn môn học"}
            </Text>
            <SymbolView
              name={subjectOpen ? "chevron.up" : "chevron.down"}
              size={16}
              tintColor={C.outline}
            />
          </Pressable>
          {subjectOpen && (
            <View style={styles.dropdown}>
              <Pressable
                style={styles.dropdownItem}
                onPress={() => {
                  set("subjectId")("");
                  setSubjectOpen(false);
                }}
              >
                <Text style={styles.dropdownItemText}>— Không chọn —</Text>
              </Pressable>
              {MOCK_SUBJECTS.map((s) => (
                <Pressable
                  key={s.id}
                  style={[
                    styles.dropdownItem,
                    form.subjectId === s.id && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    set("subjectId")(s.id);
                    setSubjectOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      form.subjectId === s.id && {
                        color: C.primary,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {s.code} · {s.name}
                  </Text>
                  {form.subjectId === s.id && (
                    <SymbolView
                      name="checkmark"
                      size={14}
                      tintColor={C.primary}
                    />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </Field>

        {/* TAGS */}
        <Field
          label="Tags"
          hint="Phân cách bằng dấu phẩy. VD: giải tích, toán, đề cương"
        >
          <TextInput
            style={styles.input}
            placeholder="giải tích, toán, đề cương..."
            placeholderTextColor={C.outline}
            value={form.tags}
            onChangeText={set("tags")}
          />
          {form.tags.trim() && (
            <View style={styles.tagPreviewRow}>
              {form.tags
                .split(",")
                .filter((t) => t.trim())
                .map((t, i) => (
                  <View key={i} style={styles.tagPreview}>
                    <Text style={styles.tagPreviewText}>#{t.trim()}</Text>
                  </View>
                ))}
            </View>
          )}
        </Field>

        {/* VISIBILITY */}
        <Field label="Quyền truy cập">
          <View style={styles.visibilityRow}>
            <Pressable
              style={[
                styles.visibilityOption,
                form.visibility === "public" && styles.visibilityOptionActive,
              ]}
              onPress={() => set("visibility")("public")}
            >
              <SymbolView
                name="globe"
                size={20}
                tintColor={form.visibility === "public" ? C.primary : C.outline}
              />
              <View>
                <Text
                  style={[
                    styles.visibilityLabel,
                    form.visibility === "public" && { color: C.primary },
                  ]}
                >
                  Công khai
                </Text>
                <Text style={styles.visibilityHint}>Chờ kiểm duyệt</Text>
              </View>
            </Pressable>
            <Pressable
              style={[
                styles.visibilityOption,
                form.visibility === "private" && styles.visibilityOptionActive,
              ]}
              onPress={() => set("visibility")("private")}
            >
              <SymbolView
                name="lock.fill"
                size={20}
                tintColor={
                  form.visibility === "private" ? C.primary : C.outline
                }
              />
              <View>
                <Text
                  style={[
                    styles.visibilityLabel,
                    form.visibility === "private" && { color: C.primary },
                  ]}
                >
                  Cá nhân
                </Text>
                <Text style={styles.visibilityHint}>Chỉ mình bạn</Text>
              </View>
            </Pressable>
          </View>
        </Field>

        {/* INFO BOX */}
        {form.visibility === "public" && (
          <View style={styles.infoBox}>
            <SymbolView
              name="info.circle.fill"
              size={16}
              tintColor={C.primary}
            />
            <Text style={styles.infoText}>
              Tài liệu công khai sẽ được kiểm duyệt trước khi hiển thị. Thường
              mất 1-2 ngày làm việc.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM SUBMIT */}
      <View
        style={[styles.bottomBar, { paddingBottom: insets.bottom || S.md }]}
      >
        <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelBtnText}>Hủy</Text>
        </Pressable>
        <Pressable
          style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={C.onPrimary} size="small" />
          ) : (
            <>
              <SymbolView
                name={isEdit ? "checkmark.circle.fill" : "arrow.up.doc.fill"}
                size={18}
                tintColor={C.onPrimary}
              />
              <Text style={styles.submitBtnText}>
                {isEdit ? "Lưu thay đổi" : "Tải lên"}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

// ── FIELD WRAPPER ─────────────────────────────────────────────────────────────
function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {hint && <Text style={styles.fieldHint}>{hint}</Text>}
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: S.md,
    height: 52,
    backgroundColor: C.surfaceLowest,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
  },
  topBarBtn: { padding: 8 },
  topBarTitle: { fontSize: 16, fontWeight: "700", color: C.onSurface },

  body: { padding: S.md, gap: S.md },

  // File picker
  filePicker: {
    borderWidth: 2,
    borderColor: C.primary,
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: C.primaryContainer,
    overflow: "hidden",
  },
  filePickerEmpty: { alignItems: "center", padding: S.lg, gap: S.sm },
  filePickerTitle: { fontSize: 15, fontWeight: "600", color: C.primary },
  filePickerSub: { fontSize: 12, color: C.onSurfaceVariant },
  filePickedRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: S.md,
    gap: S.md,
  },
  filePickedName: { fontSize: 14, fontWeight: "600", color: C.onSurface },
  filePickedSub: { fontSize: 11, color: C.onSurfaceVariant, marginTop: 2 },

  // Field
  field: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: C.onSurface },
  fieldHint: { fontSize: 12, color: C.onSurfaceVariant, marginTop: -2 },
  errorText: { fontSize: 12, color: C.error },
  charCount: { fontSize: 11, color: C.outline, textAlign: "right" },

  // Input
  input: {
    backgroundColor: C.surfaceLowest,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    borderRadius: 10,
    paddingHorizontal: S.md,
    paddingVertical: 12,
    fontSize: 14,
    color: C.onSurface,
  },
  inputError: { borderColor: C.error },
  inputMultiline: { minHeight: 96, textAlignVertical: "top", paddingTop: 12 },

  // Selector / Dropdown
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.surfaceLowest,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    borderRadius: 10,
    paddingHorizontal: S.md,
    paddingVertical: 13,
  },
  selectorText: { fontSize: 14, color: C.onSurface, flex: 1 },
  dropdown: {
    backgroundColor: C.surfaceLowest,
    borderWidth: 1,
    borderColor: C.outlineVariant,
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: S.md,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
  },
  dropdownItemActive: { backgroundColor: C.primaryContainer },
  dropdownItemText: { fontSize: 14, color: C.onSurface },

  // Tag preview
  tagPreviewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: S.sm,
    marginTop: 4,
  },
  tagPreview: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: C.primaryContainer,
    borderRadius: 9999,
  },
  tagPreviewText: { fontSize: 12, color: C.primary, fontWeight: "500" },

  // Visibility
  visibilityRow: { flexDirection: "row", gap: S.md },
  visibilityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: S.sm,
    padding: S.md,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    backgroundColor: C.surfaceLowest,
  },
  visibilityOptionActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryContainer,
  },
  visibilityLabel: { fontSize: 13, fontWeight: "600", color: C.onSurface },
  visibilityHint: { fontSize: 11, color: C.onSurfaceVariant, marginTop: 2 },

  // Info box
  infoBox: {
    flexDirection: "row",
    gap: S.sm,
    alignItems: "flex-start",
    backgroundColor: C.primaryContainer,
    borderRadius: 10,
    padding: S.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: C.onSurfaceVariant,
    lineHeight: 20,
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
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: C.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: { fontSize: 15, fontWeight: "600", color: C.onSurfaceVariant },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: S.sm,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: C.primary,
  },
  submitBtnText: { fontSize: 15, fontWeight: "700", color: C.onPrimary },
});
