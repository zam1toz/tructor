import { db } from '../lib/db';
import { reports, posts, comments } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '../lib/auth';

export async function loader({ request }: { request: Request }) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
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

    // TODO: 실제 신고 시스템 구현 시 reports 테이블에서 조회
    // 현재는 임시 데이터 반환
    const mockReports = [
      {
        id: '1',
        targetType: 'post' as const,
        targetId: '1',
        targetContent: '부적절한 광고가 포함된 게시글입니다. 상업적 목적으로 작성된 것으로 보입니다.',
        reason: '스팸/광고',
        status: 'pending' as const,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        handledAt: undefined,
        result: undefined
      },
      {
        id: '2',
        targetType: 'comment' as const,
        targetId: '1',
        targetContent: '타인을 비방하는 내용의 댓글입니다. 욕설과 비방이 포함되어 있습니다.',
        reason: '비방/욕설',
        status: 'reviewed' as const,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        handledAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        result: '신고가 승인되어 해당 댓글이 삭제되었습니다.'
      },
      {
        id: '3',
        targetType: 'post' as const,
        targetId: '2',
        targetContent: '허위 정보가 포함된 게시글입니다. 사실과 다른 내용이 다수 포함되어 있습니다.',
        reason: '허위 정보',
        status: 'dismissed' as const,
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3일 전
        handledAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        result: '신고 내용을 검토한 결과, 허위 정보로 판단되지 않아 기각되었습니다.'
      }
    ];

    return new Response(JSON.stringify({ 
      success: true, 
      reports: mockReports
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('신고 내역 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 