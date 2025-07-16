import { supabase } from '../lib/supabase';
import { EmailService } from '../lib/emailService';
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
    const formData = await request.formData();
    const email = formData.get('email') as string;

    // 입력 검증
    if (!email) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '이메일을 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '올바른 이메일 형식을 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 사용자 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, nickname, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // 보안을 위해 사용자가 존재하지 않아도 성공 응답
      return new Response(JSON.stringify({ 
        success: true, 
        message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 비밀번호 재설정 토큰 생성 (1시간 유효)
    const resetToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: 'password_reset'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 재설정 URL 생성
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // 비밀번호 재설정 이메일 전송
    try {
      await EmailService.sendPasswordResetEmail(
        user.email!,
        user.nickname,
        resetUrl,
        '1시간'
      );
    } catch (emailError) {
      console.error('비밀번호 재설정 이메일 전송 실패:', emailError);
      return new Response(JSON.stringify({ 
        success: false, 
        error: '이메일 전송 중 오류가 발생했습니다.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 성공 응답
    return new Response(JSON.stringify({ 
      success: true, 
      message: '비밀번호 재설정 링크가 이메일로 전송되었습니다.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('비밀번호 재설정 요청 API 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '비밀번호 재설정 요청 처리 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 