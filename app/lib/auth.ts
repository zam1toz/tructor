import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from './supabase';
import type { AuthUser, LoginCredentials, RegisterCredentials } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT 토큰 생성
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      phone: user.phone,
      nickname: user.nickname,
      is_admin: user.is_admin 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// JWT 토큰 검증
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// 회원가입
export async function registerUser(credentials: RegisterCredentials): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    // legacy user 체크 (legacy_user_로 시작하는 phone은 제외)
    if (credentials.phone.startsWith('legacy_user_')) {
      return { success: false, error: '사용할 수 없는 전화번호입니다.' };
    }

    // 전화번호 중복 확인 (legacy user 제외)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone', credentials.phone)
      .not('phone', 'like', 'legacy_user_%')
      .single();

    if (existingUser) {
      return { success: false, error: '이미 등록된 전화번호입니다.' };
    }

    // 닉네임 중복 확인 (legacy user 제외)
    const { data: existingNickname } = await supabase
      .from('users')
      .select('id')
      .eq('nickname', credentials.nickname)
      .not('phone', 'like', 'legacy_user_%')
      .single();

    if (existingNickname) {
      return { success: false, error: '이미 사용 중인 닉네임입니다.' };
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(credentials.password);

    // 사용자 생성
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        phone: credentials.phone,
        password: hashedPassword,
        nickname: credentials.nickname,
        region: credentials.region,
        is_admin: false,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('회원가입 오류:', error);
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
    }

    // 비밀번호 제외한 사용자 정보 반환
    const { password, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword as AuthUser };

  } catch (error) {
    console.error('회원가입 예외:', error);
    return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
  }
}

// 로그인
export async function loginUser(credentials: LoginCredentials): Promise<{ success: boolean; user?: AuthUser; token?: string; error?: string }> {
  try {
    // legacy user 체크 (legacy_user_로 시작하는 phone은 로그인 불가)
    if (credentials.phone.startsWith('legacy_user_')) {
      return { success: false, error: '전화번호 또는 비밀번호가 올바르지 않습니다.' };
    }

    // 사용자 조회 (legacy user 제외)
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', credentials.phone)
      .not('phone', 'like', 'legacy_user_%')
      .single();

    if (error || !user) {
      return { success: false, error: '전화번호 또는 비밀번호가 올바르지 않습니다.' };
    }

    // 계정 상태 확인
    if (user.status === 'banned') {
      return { success: false, error: '정지된 계정입니다. 관리자에게 문의하세요.' };
    }

    // legacy user 비밀번호 체크 (password가 '*'인 경우 로그인 불가)
    if (user.password === '*') {
      return { success: false, error: '전화번호 또는 비밀번호가 올바르지 않습니다.' };
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(credentials.password, user.password);
    if (!isValidPassword) {
      return { success: false, error: '전화번호 또는 비밀번호가 올바르지 않습니다.' };
    }

    // 마지막 로그인 시간 업데이트
    await supabase
      .from('users')
      .update({ lastLogin: new Date().toISOString() })
      .eq('id', user.id);

    // 비밀번호 제외한 사용자 정보
    const { password, ...userWithoutPassword } = user;
    const authUser = userWithoutPassword as AuthUser;

    // JWT 토큰 생성
    const token = generateToken(authUser);

    return { success: true, user: authUser, token };

  } catch (error) {
    console.error('로그인 예외:', error);
    return { success: false, error: '로그인 중 오류가 발생했습니다.' };
  }
}

// 토큰으로 사용자 정보 조회
export async function getUserFromToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (!user || user.status === 'banned') return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as AuthUser;

  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return null;
  }
} 