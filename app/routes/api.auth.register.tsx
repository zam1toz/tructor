import { registerUser } from '../lib/auth';
import { EmailService } from '../lib/emailService';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const formData = await request.formData();
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const nickname = formData.get('nickname') as string;
    const region = formData.get('region') as string;
    const email = formData.get('email') as string; // 이메일 필드 추가

    // 입력 검증
    if (!phone || !password || !nickname || !region) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '모든 필드를 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 전화번호 형식 검증 (한국 전화번호)
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '올바른 전화번호 형식을 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 이메일 형식 검증 (이메일이 제공된 경우)
    if (email) {
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

    // 닉네임 길이 검증
    if (nickname.length < 2 || nickname.length > 20) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '닉네임은 2자 이상 20자 이하여야 합니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 회원가입 처리
    const result = await registerUser({ phone, password, nickname, region, email });

    if (!result.success) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: result.error 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 환영 이메일 전송 (이메일이 제공된 경우)
    if (email) {
      try {
        await EmailService.sendWelcomeEmail(email, nickname, region);
      } catch (emailError) {
        console.error('환영 이메일 전송 실패:', emailError);
        // 이메일 전송 실패는 회원가입을 막지 않음
      }
    }

    // 성공 응답
    return new Response(JSON.stringify({ 
      success: true, 
      user: result.user 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('회원가입 API 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '회원가입 처리 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 