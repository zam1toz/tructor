import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Supabase 클라이언트 생성
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// 인증 관련 타입
export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  nickname: string;
  region: string;
  is_admin: boolean;
  status: 'active' | 'banned';
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterCredentials {
  phone: string;
  password: string;
  nickname: string;
  region: string;
}

// 인증 상태 타입
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
} 