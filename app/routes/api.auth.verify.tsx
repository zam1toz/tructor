import { getUserFromToken } from '../lib/auth';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '인증 토큰이 필요합니다.' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    // 토큰 검증 및 사용자 정보 조회
    const user = await getUserFromToken(token);

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '유효하지 않은 토큰입니다.' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('토큰 검증 API 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '토큰 검증 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 