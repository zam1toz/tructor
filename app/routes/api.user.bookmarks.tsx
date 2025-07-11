import { db } from '../lib/db';
import { posts, users } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';
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

    // TODO: 실제 북마크 데이터베이스 연동
    // 현재는 임시 데이터 반환
    const mockBookmarks = [
      {
        id: '1',
        postId: '1',
        title: '경부선 고속도로 단속 정보',
        category: '단속 정보',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        postId: '2',
        title: '서울외곽순환도로 쉼터 추천',
        category: '쉼터 정보',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    return new Response(JSON.stringify({ success: true, bookmarks: mockBookmarks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('북마크 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 