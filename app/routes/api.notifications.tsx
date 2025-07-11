import { db } from '../lib/db';
import { notifications } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
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

    // TODO: 실제 알림 시스템 구현 시 notifications 테이블에서 조회
    // 현재는 임시 데이터 반환
    const mockNotifications = [
      {
        id: '1',
        type: 'comment' as const,
        content: '작성하신 게시글에 새로운 댓글이 달렸습니다.',
        relatedPostId: '1',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString() // 1시간 전
      },
      {
        id: '2',
        type: 'mention' as const,
        content: '다른 사용자가 댓글에서 회원님을 언급했습니다.',
        relatedPostId: '2',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString() // 2시간 전
      },
      {
        id: '3',
        type: 'announcement' as const,
        content: '새로운 기능이 추가되었습니다. 지도에서 쉼터 체크인 기능을 사용해보세요!',
        relatedPostId: undefined,
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1일 전
      },
      {
        id: '4',
        type: 'comment' as const,
        content: '작성하신 게시글에 좋아요가 추가되었습니다.',
        relatedPostId: '3',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2일 전
      }
    ];

    return new Response(JSON.stringify({ 
      success: true, 
      notifications: mockNotifications
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('알림 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 