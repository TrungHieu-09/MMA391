/**
 * documentService.ts
 * Abstract service layer cho Document.
 * Hiện tại dùng mock data.
 * Khi có backend: thay phần bên trong mỗi function bằng axios/supabase call.
 */

import {
    Document,
    PaginatedResponse,
    UploadDocumentPayload,
  } from '@/types';
  import {
    MOCK_CURRENT_USER,
    MOCK_DOCUMENTS,
  } from '@/mock/data';
  
  // Simulate network delay
  const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));
  
  // ── GET ALL PUBLIC DOCUMENTS ──────────────────────────────────────────────────
  export async function getPublicDocuments(params?: {
    page?: number;
    pageSize?: number;
    subjectId?: string;
    search?: string;
  }): Promise<PaginatedResponse<Document>> {
    await delay();
  
    let results = MOCK_DOCUMENTS.filter(
      (d) => d.visibility === 'public' && d.status === 'approved'
    );
  
    if (params?.subjectId) {
      results = results.filter((d) => d.subject?.id === params.subjectId);
    }
  
    if (params?.search) {
      const q = params.search.toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
  
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const paged = results.slice(start, start + pageSize);
  
    return {
      data: paged,
      total: results.length,
      page,
      pageSize,
      hasMore: start + pageSize < results.length,
    };
  }
  
  // ── GET TRENDING DOCUMENTS ────────────────────────────────────────────────────
  export async function getTrendingDocuments(limit = 5): Promise<Document[]> {
    await delay(300);
    return [...MOCK_DOCUMENTS]
      .filter((d) => d.visibility === 'public' && d.status === 'approved')
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, limit);
  }
  
  // ── GET DOCUMENT BY ID ────────────────────────────────────────────────────────
  export async function getDocumentById(id: string): Promise<Document | null> {
    await delay(300);
    return MOCK_DOCUMENTS.find((d) => d.id === id) ?? null;
  }
  
  // ── GET MY DOCUMENTS ──────────────────────────────────────────────────────────
  export async function getMyDocuments(): Promise<Document[]> {
    await delay(400);
    return MOCK_DOCUMENTS.filter(
      (d) => d.uploadedBy.id === MOCK_CURRENT_USER.id
    );
  }
  
  // ── UPLOAD DOCUMENT ───────────────────────────────────────────────────────────
  export async function uploadDocument(
    payload: UploadDocumentPayload
  ): Promise<Document> {
    await delay(1200);
    // TODO: replace with real multipart/form-data upload to backend
    const newDoc: Document = {
      id: `d_${Date.now()}`,
      title: payload.title,
      description: payload.description,
      fileUrl: payload.file.uri,
      fileType: 'pdf',
      fileSizeMb: 0,
      tags: payload.tags,
      visibility: payload.visibility,
      status: 'pending', // goes to moderator queue
      uploadedBy: MOCK_CURRENT_USER,
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_DOCUMENTS.push(newDoc);
    return newDoc;
  }
  
  // ── UPDATE DOCUMENT ───────────────────────────────────────────────────────────
  export async function updateDocument(
    id: string,
    payload: Partial<UploadDocumentPayload>
  ): Promise<Document> {
    await delay(600);
    const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Document not found');
  
    MOCK_DOCUMENTS[idx] = {
      ...MOCK_DOCUMENTS[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return MOCK_DOCUMENTS[idx];
  }
  
  // ── SOFT DELETE DOCUMENT ──────────────────────────────────────────────────────
  export async function deleteDocument(id: string): Promise<void> {
    await delay(400);
    const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Document not found');
    MOCK_DOCUMENTS[idx].status = 'deleted'; // soft delete
  }
  
  // ── RESTORE DOCUMENT ──────────────────────────────────────────────────────────
  export async function restoreDocument(id: string): Promise<void> {
    await delay(400);
    const idx = MOCK_DOCUMENTS.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error('Document not found');
    MOCK_DOCUMENTS[idx].status = 'pending';
  }