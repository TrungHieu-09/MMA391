import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getCurrentUser, updateProfile } from '@/services/userService';
import { User } from '@/types';

const C = {
  surface: '#faf8ff',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f3f3fe',
  surfaceContainer: '#ededf9',
  onSurface: '#191b23',
  onSurfaceVariant: '#434655',
  primary: '#004ac6',
  primaryContainer: '#dce6ff',
  onPrimary: '#ffffff',
  outline: '#737686',
  outlineVariant: '#c3c6d7',
  error: '#ba1a1a',
};
const S = { sm: 8, md: 16, lg: 24 };

interface ProfileForm {
  fullName: string;
  studentId: string;
  major: string;
  university: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ProfileForm>({
    fullName: '', studentId: '', major: '', university: '',
  });
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setForm({
        fullName: u.fullName,
        studentId: u.studentId ?? '',
        major: u.major ?? '',
        university: u.university ?? '',
      });
      setLoading(false);
    });
  }, []);

  const setF = (key: keyof ProfileForm) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<ProfileForm> = {};
    if (!form.fullName.trim()) e.fullName = 'Vui lòng nhập họ tên';
    if (form.studentId && !/^[A-Z]{2}\d{6}$/.test(form.studentId))
      e.studentId = 'Mã SV không hợp lệ. VD: SE171234';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const updated = await updateProfile({
        fullName: form.fullName.trim(),
        studentId: form.studentId.trim() || undefined,
        major: form.major.trim() || undefined,
        university: form.university.trim() || undefined,
      });
      setUser(updated);
      setIsEditing(false);
      Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật.');
    } catch {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setForm({
        fullName: user.fullName,
        studentId: user.studentId ?? '',
        major: user.major ?? '',
        university: user.university ?? '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

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
          <SymbolView name="chevron.left" size={20} tintColor={C.onSurface} />
        </Pressable>
        <Text style={styles.topBarTitle}>
          {isEditing ? 'Chỉnh sửa hồ sơ' : 'Hồ sơ của tôi'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + (isEditing ? 100 : 40) }]}
      >
        {/* AVATAR */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: user?.avatarUrl ?? 'https://i.pravatar.cc/150?img=11' }}
              style={styles.avatar}
              contentFit="cover"
            />
            {isEditing && (
              <Pressable
                style={styles.avatarEditBtn}
                onPress={() => Alert.alert('Đổi ảnh', 'Tích hợp expo-image-picker khi có backend.')}
              >
                <SymbolView name="camera.fill" size={14} tintColor={C.onPrimary} />
              </Pressable>
            )}
          </View>
          <Text style={styles.avatarName}>{user?.fullName}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>

        {/* THÔNG TIN CÁ NHÂN */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
            {!isEditing && (
              <Pressable style={styles.editIconBtn} onPress={() => setIsEditing(true)}>
                <SymbolView name="pencil" size={16} tintColor={C.primary} />
              </Pressable>
            )}
          </View>

          <InfoRow icon="envelope.fill" label="Email" isEditing={false}>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </InfoRow>

          <InfoRow icon="person.fill" label="Họ và tên" isEditing={isEditing}>
            {isEditing ? (
              <>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  value={form.fullName}
                  onChangeText={setF('fullName')}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor={C.outline}
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
              </>
            ) : (
              <Text style={styles.infoValue}>{user?.fullName || '—'}</Text>
            )}
          </InfoRow>

          <InfoRow icon="graduationcap.fill" label="Mã sinh viên" isEditing={isEditing}>
            {isEditing ? (
              <>
                <TextInput
                  style={[styles.input, errors.studentId && styles.inputError]}
                  value={form.studentId}
                  onChangeText={setF('studentId')}
                  placeholder="SE171234"
                  placeholderTextColor={C.outline}
                  autoCapitalize="characters"
                  maxLength={8}
                />
                {errors.studentId && <Text style={styles.errorText}>{errors.studentId}</Text>}
              </>
            ) : (
              <Text style={styles.infoValue}>{user?.studentId || '—'}</Text>
            )}
          </InfoRow>

          <InfoRow icon="book.fill" label="Ngành học" isEditing={isEditing}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={form.major}
                onChangeText={setF('major')}
                placeholder="Kỹ thuật phần mềm"
                placeholderTextColor={C.outline}
              />
            ) : (
              <Text style={styles.infoValue}>{user?.major || '—'}</Text>
            )}
          </InfoRow>

          <InfoRow icon="building.columns.fill" label="Trường" isEditing={isEditing} last>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={form.university}
                onChangeText={setF('university')}
                placeholder="FPT University HCMC"
                placeholderTextColor={C.outline}
              />
            ) : (
              <Text style={styles.infoValue}>{user?.university || '—'}</Text>
            )}
          </InfoRow>
        </View>

        {/* ĐĂNG XUẤT */}
        {!isEditing && (
          <Pressable
            style={styles.logoutBtn}
            onPress={() =>
              Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', style: 'destructive', onPress: () => router.replace('/') },
              ])
            }
          >
            <SymbolView name="rectangle.portrait.and.arrow.right" size={18} tintColor={C.error} />
            <Text style={styles.logoutBtnText}>Đăng xuất</Text>
          </Pressable>
        )}
      </ScrollView>

      {/* BOTTOM BAR — chỉ khi edit */}
      {isEditing && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom || S.md }]}>
          <Pressable style={styles.cancelBtn} onPress={handleCancelEdit}>
            <Text style={styles.cancelBtnText}>Hủy</Text>
          </Pressable>
          <Pressable
            style={[styles.saveBtn, saving && { opacity: 0.7 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={C.onPrimary} />
            ) : (
              <>
                <SymbolView name="checkmark.circle.fill" size={18} tintColor={C.onPrimary} />
                <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
              </>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

function InfoRow({
  icon, label, isEditing, last = false, children,
}: {
  icon: string; label: string; isEditing: boolean; last?: boolean; children: React.ReactNode;
}) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <View style={styles.infoIcon}>
        <SymbolView name={icon as any} size={14} tintColor="#004ac6" />
      </View>
      <View style={[styles.infoContent, isEditing && { paddingVertical: 4 }]}>
        <Text style={styles.infoLabel}>{label}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf8ff' },
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 52,
    backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#c3c6d7',
  },
  topBarBtn: { padding: 8 },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: '#191b23' },
  body: { padding: 16, gap: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#004ac6' },
  avatarEditBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#004ac6', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#ffffff',
  },
  avatarName: { fontSize: 18, fontWeight: '700', color: '#191b23', marginTop: 4 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#dce6ff', borderRadius: 9999 },
  roleBadgeText: { fontSize: 11, fontWeight: '700', color: '#004ac6', letterSpacing: 0.5 },
  card: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#c3c6d7', overflow: 'hidden' },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#c3c6d7', backgroundColor: '#f3f3fe',
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#434655', textTransform: 'uppercase', letterSpacing: 0.5 },
  editIconBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#dce6ff', justifyContent: 'center', alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#c3c6d7', gap: 16,
  },
  infoIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#dce6ff', justifyContent: 'center', alignItems: 'center', marginTop: 2,
  },
  infoContent: { flex: 1, gap: 4 },
  infoLabel: { fontSize: 11, fontWeight: '600', color: '#434655', textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 15, color: '#191b23', fontWeight: '500' },
  input: {
    backgroundColor: '#f3f3fe', borderWidth: 1, borderColor: '#c3c6d7',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9,
    fontSize: 14, color: '#191b23',
  },
  inputError: { borderColor: '#ba1a1a' },
  errorText: { fontSize: 12, color: '#ba1a1a' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#ba1a1a', backgroundColor: '#ffffff',
  },
  logoutBtnText: { fontSize: 15, fontWeight: '600', color: '#ba1a1a' },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 16,
    backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#c3c6d7',
    paddingHorizontal: 16, paddingTop: 16,
  },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#c3c6d7', alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#434655' },
  saveBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 10, backgroundColor: '#004ac6',
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});