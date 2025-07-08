import { loginUser } from '../lib/auth';

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

    // 입력 검증
    if (!phone || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '전화번호와 비밀번호를 모두 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 로그인 처리
    const result = await loginUser({ phone, password });

    if (!result.success) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: result.error 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 성공 응답 (토큰은 쿠키에 저장)
    const response = new Response(JSON.stringify({ 
      success: true, 
      user: result.user 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${result.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
      }
    });

    return response;

  } catch (error) {
    console.error('로그인 API 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '로그인 처리 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 