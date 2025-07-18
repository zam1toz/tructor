import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// 일반 사용자용 Supabase 클라이언트 (RLS 적용)
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

// 관리자용 Supabase 클라이언트 (RLS 우회, 서비스 역할 키 사용)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey || config.supabase.anonKey, // 서비스 역할 키가 없으면 anon 키 사용
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
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
  email?: string; // 이메일 필드 추가 (선택사항)
}

// 인증 상태 타입
export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
} 