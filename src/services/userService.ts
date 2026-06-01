/**
 * userService.ts
 * Abstract service layer cho User/Profile.
 * Hiện tại dùng mock data.
 * Khi có backend: thay bằng supabase/firebase auth + profile API.
 */

import { User } from '@/types';
import { MOCK_CURRENT_USER } from '@/mock/data';

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

// ── GET CURRENT USER PROFILE ──────────────────────────────────────────────────
export async function getCurrentUser(): Promise<User> {
  await delay(300);
  // TODO: replace with supabase.auth.getUser() or firebase.auth().currentUser
  return MOCK_CURRENT_USER;
}

// ── UPDATE PROFILE ────────────────────────────────────────────────────────────
export async function updateProfile(
  payload: Partial<Pick<User, 'fullName' | 'avatarUrl' | 'studentId' | 'major' | 'university'>>
): Promise<User> {
  await delay(700);
  // TODO: replace with API PATCH /users/me
  Object.assign(MOCK_CURRENT_USER, payload);
  return MOCK_CURRENT_USER;
}

// ── UPDATE AVATAR ─────────────────────────────────────────────────────────────
export async function updateAvatar(imageUri: string): Promise<string> {
  await delay(1000);
  // TODO: upload to cloud storage, return public URL
  MOCK_CURRENT_USER.avatarUrl = imageUri;
  return imageUri;
}

// ── CHANGE PASSWORD ───────────────────────────────────────────────────────────
export async function changePassword(
  _currentPassword: string,
  _newPassword: string
): Promise<void> {
  await delay(600);
  // TODO: replace with auth provider password change
}