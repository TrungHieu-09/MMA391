// ========== USER ==========
export type UserRole = 'guest' | 'user' | 'moderator' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  studentId?: string;
  major?: string;
  university?: string;
  role: UserRole;
  createdAt: string;
}

// ========== DOCUMENT ==========
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'deleted';
export type DocumentVisibility = 'private' | 'public';
export type FileType = 'pdf' | 'docx' | 'txt' | 'png' | 'jpg';

export interface Subject {
  id: string;
  name: string;
  code: string; // e.g. "MAT101"
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileType: FileType;
  fileSizeMb: number;
  subject?: Subject;
  tags: string[];
  visibility: DocumentVisibility;
  status: DocumentStatus;
  uploadedBy: User;
  downloadCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ========== UPLOAD ==========
export interface UploadDocumentPayload {
  title: string;
  description?: string;
  subjectId?: string;
  tags: string[];
  visibility: DocumentVisibility;
  file: {
    uri: string;
    name: string;
    type: string;
  };
}

// ========== COMMENT ==========
export interface Comment {
  id: string;
  documentId: string;
  user: User;
  content: string;
  createdAt: string;
}

// ========== API RESPONSE ==========
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}