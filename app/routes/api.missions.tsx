import { db } from '../lib/db';
import { missions, userMissions } from '../lib/db/schema';
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

    // TODO: 실제 미션 조회 구현
    // 현재는 임시 데이터 반환
    const mockMissions = [
      {
        id: '1',
        title: '첫 게시글 작성',
        description: '첫 번째 게시글을 작성해보세요.',
        category: '게시글',
        points: 50,
        isActive: true,
        isCompleted: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: '2',
        title: '댓글 작성하기',
        description: '다른 사용자의 게시글에 댓글을 작성해보세요.',
        category: '댓글',
        points: 20,
        isActive: true,
        isCompleted: false,
        progress: 0,
        maxProgress: 5
      },
      {
        id: '3',
        title: '좋아요 누르기',
        description: '마음에 드는 게시글에 좋아요를 눌러보세요.',
        category: '상호작용',
        points: 10,
        isActive: true,
        isCompleted: false,
        progress: 0,
        maxProgress: 10
      },
      {
        id: '4',
        title: '북마크하기',
        description: '유용한 게시글을 북마크해보세요.',
        category: '북마크',
        points: 15,
        isActive: true,
        isCompleted: false,
        progress: 0,
        maxProgress: 3
      },
      {
        id: '5',
        title: '신고하기',
        description: '부적절한 게시글을 신고해보세요.',
        category: '신고',
        points: 30,
        isActive: true,
        isCompleted: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: '6',
        title: '연속 로그인',
        description: '3일 연속으로 로그인해보세요.',
        category: '출석',
        points: 100,
        isActive: true,
        isCompleted: false,
        progress: 1,
        maxProgress: 3
      },
      {
        id: '7',
        title: '지도 신고',
        description: '지도에서 쉼터나 정비소를 신고해보세요.',
        category: '지도',
        points: 40,
        isActive: true,
        isCompleted: false,
        progress: 0,
        maxProgress: 1
      },
      {
        id: '8',
        title: '랭킹 진입',
        description: '포인트 랭킹에 진입해보세요.',
        category: '랭킹',
        points: 200,
        isActive: true,
        isCompleted: false,
        progress: 0,
        maxProgress: 1
      }
    ];

    // 카테고리별로 그룹화
    const missionsByCategory = mockMissions.reduce((acc, mission) => {
      if (!acc[mission.category]) {
        acc[mission.category] = [];
      }
      acc[mission.category].push(mission);
      return acc;
    }, {} as Record<string, typeof mockMissions>);

    return new Response(JSON.stringify({ 
      success: true, 
      missions: missionsByCategory,
      totalMissions: mockMissions.length,
      completedMissions: mockMissions.filter(m => m.isCompleted).length,
      totalPoints: mockMissions.filter(m => m.isCompleted).reduce((sum, m) => sum + m.points, 0)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('미션 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 