import { db } from '../lib/db';
import { posts, users } from '../lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    const offset = (page - 1) * limit;

    // TODO: 실제 게시글 목록 조회 구현
    // 현재는 임시 데이터 반환
    const mockPosts = [
      {
        id: '1',
        title: '경부선 고속도로 단속 정보',
        content: '오늘 오후 2시부터 경부선 고속도로에서 단속이 있을 예정입니다. 특히 과속 단속이 강화될 예정이니 주의하세요.',
        category: '단속 정보',
        authorId: '1',
        authorNickname: '달리는기사',
        likeCount: 24,
        commentCount: 8,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        title: '서울외곽순환도로 쉼터 추천',
        content: '서울외곽순환도로에서 가장 깨끗하고 편리한 쉼터를 소개합니다. 화장실이 깨끗하고 주차 공간도 넉넉합니다.',
        category: '쉼터 정보',
        authorId: '2',
        authorNickname: '고속도로킹',
        likeCount: 18,
        commentCount: 5,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2일 전
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '3',
        title: '연비 개선 팁 공유',
        content: '장거리 운행 시 연비를 개선할 수 있는 실용적인 팁들을 모았습니다. 정속 주행과 적절한 타이어 압력 관리가 중요합니다.',
        category: '노하우',
        authorId: '3',
        authorNickname: '트럭마스터',
        likeCount: 32,
        commentCount: 12,
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3일 전
        updatedAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: '4',
        title: '운전 중 피로도 관리 방법',
        content: '장거리 운전 시 피로도를 효과적으로 관리하는 방법들을 공유합니다. 정기적인 휴식과 적절한 수분 섭취가 중요합니다.',
        category: '노하우',
        authorId: '4',
        authorNickname: '운전왕',
        likeCount: 15,
        commentCount: 6,
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4일 전
        updatedAt: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: '5',
        title: '겨울철 운전 주의사항',
        content: '겨울철 운전 시 주의해야 할 사항들을 정리했습니다. 타이어 체크와 제동거리 확보가 특히 중요합니다.',
        category: '일반',
        authorId: '5',
        authorNickname: '로드워리어',
        likeCount: 28,
        commentCount: 9,
        createdAt: new Date(Date.now() - 432000000).toISOString(), // 5일 전
        updatedAt: new Date(Date.now() - 432000000).toISOString()
      }
    ];

    let filteredPosts = mockPosts;

    // 카테고리 필터링
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // 검색 필터링
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 페이지네이션
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return new Response(JSON.stringify({ 
      success: true, 
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 