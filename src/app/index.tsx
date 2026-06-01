import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MOCK_CURRENT_USER, MOCK_SUBJECTS } from '@/mock/data';
import { getTrendingDocuments } from '@/services/documentService';
import { Document } from '@/types';

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
  secondary: '#2b6193',
  outline: '#737686',
  outlineVariant: '#c3c6d7',
};

const S = { sm: 8, md: 16, lg: 24 };

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function fileTypeColor(type: string): string {
  switch (type) {
    case 'pdf': return '#e53935';
    case 'docx': return '#1565c0';
    case 'txt': return '#546e7a';
    default: return C.primary;
  }
}

function fileTypeIcon(type: string): string {
  switch (type) {
    case 'pdf': return 'doc.text.fill';
    case 'docx': return 'doc.plaintext.fill';
    case 'txt': return 'doc.text';
    default: return 'folder.fill';
  }
}

const QUICK_PROMPTS = [
  'Tóm tắt PDF',
  'Tìm bài tập Giải tích',
  'Đề thi HK',
  'Tài liệu Lập trình',
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [trending, setTrending] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  useEffect(() => {
    getTrendingDocuments(6)
      .then(setTrending)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (search.trim()) {
      router.push({ pathname: '/explore', params: { q: search.trim() } });
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.brandTitle}>AcademiShare</Text>
          <Pressable onPress={() => router.push('/profile')} style={styles.avatarWrap}>
            <Image
              source={{ uri: MOCK_CURRENT_USER.avatarUrl }}
              style={styles.avatar}
              contentFit="cover"
            />
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <SymbolView name="magnifyingglass" size={18} tintColor={C.outline} />
            <TextInput
              style={styles.searchInput}
              placeholder="Hỏi AI hoặc tìm kiếm tài liệu..."
              placeholderTextColor={C.outline}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {search.length > 0 ? (
              <Pressable onPress={() => setSearch('')}>
                <SymbolView name="xmark.circle.fill" size={18} tintColor={C.outline} />
              </Pressable>
            ) : (
              <SymbolView name="sparkles" size={18} tintColor={C.primary} type="hierarchical" />
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.promptsRow}
        >
          {QUICK_PROMPTS.map((p) => (
            <Pressable key={p} style={styles.promptChip} onPress={() => setSearch(p)}>
              <Text style={styles.promptChipText}>{p}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 80 }]}
      >
        {/* Welcome banner */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              Xin chào, {MOCK_CURRENT_USER.fullName.split(' ').pop()} 👋
            </Text>
            <Text style={styles.bannerSub}>Học tập thông minh hơn với AI trợ giúp</Text>
          </View>
          <View style={styles.bannerIcon}>
            <SymbolView name="brain.head.profile" size={40} tintColor={C.primary} type="hierarchical" />
          </View>
        </View>

        {/* Subject filter */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Môn học</Text>
            <Pressable onPress={() => router.push('/explore')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectRow}
          >
            <Pressable
              style={[styles.subjectChip, activeSubject === null && styles.subjectChipActive]}
              onPress={() => setActiveSubject(null)}
            >
              <Text style={[styles.subjectChipText, activeSubject === null && styles.subjectChipTextActive]}>
                Tất cả
              </Text>
            </Pressable>
            {MOCK_SUBJECTS.map((s) => (
              <Pressable
                key={s.id}
                style={[styles.subjectChip, activeSubject === s.id && styles.subjectChipActive]}
                onPress={() => setActiveSubject(s.id)}
              >
                <Text style={[styles.subjectChipText, activeSubject === s.id && styles.subjectChipTextActive]}>
                  {s.code}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Trending documents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tài liệu thịnh hành</Text>
            <Pressable onPress={() => router.push('/explore')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator color={C.primary} style={{ marginTop: 24 }} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardRow}
            >
              {trending
                .filter((d) => activeSubject === null || d.subject?.id === activeSubject)
                .map((doc) => (
                  <Pressable
                    key={doc.id}
                    style={styles.docCard}
                    onPress={() =>
                      router.push({ pathname: '/document-detail', params: { id: doc.id } })
                    }
                  >
                    {doc.thumbnailUrl ? (
                      <Image
                        source={{ uri: doc.thumbnailUrl }}
                        style={styles.docCardThumb}
                        contentFit="cover"
                      />
                    ) : (
                      <View style={styles.docCardIconBg}>
                        <SymbolView
                          name={fileTypeIcon(doc.fileType) as any}
                          size={40}
                          tintColor={fileTypeColor(doc.fileType)}
                        />
                      </View>
                    )}
                    <View style={[styles.fileTypeBadge, { backgroundColor: fileTypeColor(doc.fileType) }]}>
                      <Text style={styles.fileTypeBadgeText}>{doc.fileType.toUpperCase()}</Text>
                    </View>
                    <View style={styles.docCardInfo}>
                      {doc.subject && (
                        <Text style={styles.docCardSubject}>{doc.subject.code}</Text>
                      )}
                      <Text style={styles.docCardTitle} numberOfLines={2}>{doc.title}</Text>
                      <View style={styles.docCardMeta}>
                        <SymbolView name="arrow.down.to.line" size={12} tintColor={C.onSurfaceVariant} />
                        <Text style={styles.docCardMetaText}>{formatCount(doc.downloadCount)}</Text>
                        <Text style={styles.docCardMetaDot}>·</Text>
                        <Text style={styles.docCardMetaText}>{doc.fileSizeMb} MB</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>
          )}
        </View>

        {/* Upload CTA */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tài liệu của tôi</Text>
            <Pressable onPress={() => router.push('/my-documents')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </Pressable>
          </View>
          <Pressable style={styles.uploadCta} onPress={() => router.push('/upload')}>
            <SymbolView name="arrow.up.doc.fill" size={28} tintColor={C.primary} />
            <View style={{ flex: 1, marginLeft: S.md }}>
              <Text style={styles.uploadCtaTitle}>Tải lên tài liệu mới</Text>
              <Text style={styles.uploadCtaSub}>Chia sẻ tài liệu với cộng đồng FPT</Text>
            </View>
            <SymbolView name="chevron.right" size={16} tintColor={C.outline} />
          </Pressable>
        </View>
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || S.md }]}>
        <NavItem icon="house.fill" label="Trang chủ" active onPress={() => {}} />
        <NavItem icon="doc.text.magnifyingglass" label="Khám phá" onPress={() => router.push('/explore')} />
        <Pressable style={styles.uploadFab} onPress={() => router.push('/upload')}>
          <SymbolView name="plus" size={24} tintColor={C.onPrimary} />
        </Pressable>
        <NavItem icon="tray.full" label="Của tôi" onPress={() => router.push('/my-documents')} />
        <NavItem icon="person.circle" label="Hồ sơ" onPress={() => router.push('/profile')} />
      </View>
    </View>
  );
}

function NavItem({
  icon, label, active = false, onPress,
}: {
  icon: string; label: string; active?: boolean; onPress: () => void;
}) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <SymbolView name={icon as any} size={24} tintColor={active ? C.primary : C.onSurfaceVariant} />
      <Text style={[styles.navLabel, active && { color: C.primary, fontWeight: '600' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.surface },
  header: {
    backgroundColor: C.surfaceLowest,
    borderBottomWidth: 1,
    borderBottomColor: C.outlineVariant,
    paddingBottom: S.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  brandRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: S.md, height: 56,
  },
  brandTitle: { fontSize: 22, fontWeight: '700', color: C.primary, letterSpacing: -0.3 },
  avatarWrap: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, borderColor: C.primary, overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%' },
  searchWrap: { paddingHorizontal: S.md, marginTop: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surfaceLow, borderWidth: 1,
    borderColor: C.outlineVariant, borderRadius: 9999,
    paddingHorizontal: S.md, height: 46, gap: S.sm,
  },
  searchInput: { flex: 1, fontSize: 15, color: C.onSurface },
  promptsRow: { paddingHorizontal: S.md, paddingTop: 10, gap: S.sm },
  promptChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999,
    borderWidth: 1, borderColor: C.outlineVariant, backgroundColor: C.surfaceContainer,
  },
  promptChipText: { fontSize: 12, color: C.onSurfaceVariant, fontWeight: '500' },
  body: { paddingTop: S.md, gap: S.lg },
  banner: {
    marginHorizontal: S.md, backgroundColor: '#dce6ff',
    borderRadius: 16, padding: S.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: C.primary, marginBottom: 4 },
  bannerSub: { fontSize: 13, color: C.onSurfaceVariant },
  bannerIcon: { marginLeft: S.md, opacity: 0.85 },
  section: { gap: S.sm },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: S.md,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.onSurface },
  seeAll: { fontSize: 13, color: C.primary, fontWeight: '500' },
  subjectRow: { paddingHorizontal: S.md, gap: S.sm },
  subjectChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9999,
    borderWidth: 1, borderColor: C.outlineVariant, backgroundColor: C.surfaceLowest,
  },
  subjectChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  subjectChipText: { fontSize: 13, color: C.onSurfaceVariant, fontWeight: '500' },
  subjectChipTextActive: { color: C.onPrimary },
  cardRow: { paddingHorizontal: S.md, gap: S.md },
  docCard: {
    width: 172, backgroundColor: C.surfaceLowest,
    borderWidth: 1, borderColor: C.outlineVariant, borderRadius: 12, overflow: 'hidden',
  },
  docCardThumb: { width: '100%', height: 108, backgroundColor: C.surfaceLow },
  docCardIconBg: {
    width: '100%', height: 108, backgroundColor: C.surfaceLow,
    justifyContent: 'center', alignItems: 'center',
  },
  fileTypeBadge: {
    position: 'absolute', top: 8, left: 8,
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  fileTypeBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  docCardInfo: { padding: 10, gap: 4 },
  docCardSubject: { fontSize: 10, fontWeight: '600', color: C.primary, textTransform: 'uppercase' },
  docCardTitle: { fontSize: 13, fontWeight: '600', color: C.onSurface, lineHeight: 18, minHeight: 36 },
  docCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  docCardMetaText: { fontSize: 11, color: C.onSurfaceVariant },
  docCardMetaDot: { fontSize: 11, color: C.outlineVariant },
  uploadCta: {
    marginHorizontal: S.md, flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.surfaceLowest, borderWidth: 1.5, borderColor: C.primary,
    borderStyle: 'dashed', borderRadius: 12, padding: S.md,
  },
  uploadCtaTitle: { fontSize: 14, fontWeight: '600', color: C.onSurface, marginBottom: 2 },
  uploadCtaSub: { fontSize: 12, color: C.onSurfaceVariant },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    backgroundColor: C.surfaceLowest, borderTopWidth: 1,
    borderTopColor: C.outlineVariant, paddingTop: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  navItem: { flex: 1, alignItems: 'center', gap: 3 },
  navLabel: { fontSize: 10, color: C.onSurfaceVariant },
  uploadFab: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: C.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    shadowColor: C.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
});