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

    // TODO: 실제 포인트 시스템 구현 시 point_history 테이블에서 조회
    // 현재는 임시 데이터 반환
    const mockPointHistory = [
      {
        id: '1',
        userId: decoded.id,
        amount: 10,
        type: 'earn',
        description: '게시글 작성',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1일 전
      },
      {
        id: '2',
        userId: decoded.id,
        amount: 2,
        type: 'earn',
        description: '댓글 작성',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2일 전
      },
      {
        id: '3',
        userId: decoded.id,
        amount: 5,
        type: 'earn',
        description: '쉼터 방문 체크인',
        createdAt: new Date(Date.now() - 259200000).toISOString() // 3일 전
      }
    ];

    const totalPoints = mockPointHistory.reduce((sum, item) => {
      return item.type === 'earn' ? sum + item.amount : sum - item.amount;
    }, 0);

    return new Response(JSON.stringify({ success: true, history: mockPointHistory, totalPoints }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('포인트 내역 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 