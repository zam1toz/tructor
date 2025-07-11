import { db } from '../lib/db';
import { users, posts, comments } from '../lib/db/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import { verifyToken } from '../lib/auth';

export async function loader({ request, params }: { request: Request; params: { category: string } }) {
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

    const { category } = params;

    // TODO: 실제 랭킹 시스템 구현 시 데이터베이스에서 조회
    // 현재는 임시 데이터 반환
    const mockRankings = [
      {
        id: '1',
        nickname: '트럭마스터',
        region: '서울',
        points: 2500,
        level: 8,
        totalPosts: 45,
        totalComments: 120,
        rank: 1
      },
      {
        id: '2',
        nickname: '고속도로킹',
        region: '경기',
        points: 2100,
        level: 7,
        totalPosts: 38,
        totalComments: 95,
        rank: 2
      },
      {
        id: '3',
        nickname: '달리는기사',
        region: '부산',
        points: 1800,
        level: 6,
        totalPosts: 32,
        totalComments: 78,
        rank: 3
      },
      {
        id: '4',
        nickname: '운전왕',
        region: '대구',
        points: 1500,
        level: 5,
        totalPosts: 28,
        totalComments: 65,
        rank: 4
      },
      {
        id: '5',
        nickname: '로드워리어',
        region: '인천',
        points: 1200,
        level: 4,
        totalPosts: 25,
        totalComments: 52,
        rank: 5
      }
    ];

    // 현재 사용자의 순위 찾기
    const myRank = mockRankings.find(user => user.id === decoded.id) || {
      id: decoded.id,
      nickname: decoded.nickname,
      region: '서울', // TODO: 실제 사용자 지역 정보 사용
      points: 850,
      level: 3,
      totalPosts: 15,
      totalComments: 30,
      rank: 8
    };

    let rankings = mockRankings;
    let myRankData = myRank;

    // 카테고리별 정렬
    switch (category) {
      case 'points':
        rankings = mockRankings.sort((a, b) => b.points - a.points);
        break;
      case 'posts':
        rankings = mockRankings.sort((a, b) => b.totalPosts - a.totalPosts);
        break;
      case 'comments':
        rankings = mockRankings.sort((a, b) => b.totalComments - a.totalComments);
        break;
      default:
        return new Response(JSON.stringify({ success: false, error: '유효하지 않은 카테고리입니다.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    // 순위 재계산
    rankings = rankings.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      rankings,
      myRank: myRankData
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('랭킹 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 