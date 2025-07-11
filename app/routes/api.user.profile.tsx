import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../lib/auth';

export async function loader({ request }: { request: Request }) {
  try {
    // 쿠키에서 토큰 추출
    let token: string | undefined = undefined;
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
      token = cookies['auth_token'];
    }
    if (!token) {
      token = request.headers.get('Authorization')?.replace('Bearer ', '');
    }
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: '인증 토큰이 필요합니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({ success: false, error: '유효하지 않은 토큰입니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
      columns: {
        id: true,
        nickname: true,
        phone: true,
        region: true,
        is_admin: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      }
    });

    if (!user) {
      return new Response(JSON.stringify({ success: false, error: '사용자를 찾을 수 없습니다.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 