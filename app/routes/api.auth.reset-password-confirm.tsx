import { supabase } from '../lib/supabase';
import { hashPassword } from '../lib/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { token, password } = body;

    // 입력 검증
    if (!token || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '토큰과 새 비밀번호를 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '비밀번호는 6자 이상이어야 합니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 토큰 검증
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (jwtError) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '유효하지 않거나 만료된 토큰입니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 토큰 타입 확인
    if (decoded.type !== 'password_reset') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '유효하지 않은 토큰입니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', decoded.userId)
      .eq('email', decoded.email)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '사용자를 찾을 수 없습니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 새 비밀번호 해싱
    const hashedPassword = await hashPassword(password);

    // 비밀번호 업데이트
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', user.id);

    if (updateError) {
      console.error('비밀번호 업데이트 오류:', updateError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: '비밀번호 업데이트 중 오류가 발생했습니다.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 성공 응답
    return new Response(JSON.stringify({ 
      success: true, 
      message: '비밀번호가 성공적으로 변경되었습니다.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('비밀번호 재설정 확인 API 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '비밀번호 재설정 처리 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 