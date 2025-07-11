import { db } from '../lib/db';
import { posts, users } from '../lib/db/schema';
import { eq, or, ilike } from 'drizzle-orm';

export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    const type = url.searchParams.get('type') || 'all'; // all, posts, users
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '검색어를 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const offset = (page - 1) * limit;

    // TODO: 실제 검색 구현
    // 현재는 임시 데이터 반환
    const mockPosts = [
      {
        id: '1',
        title: '경부선 고속도로 단속 정보',
        content: '오늘 오후 2시부터 경부선 고속도로에서 단속이 있을 예정입니다.',
        category: '단속 정보',
        authorId: '1',
        authorNickname: '달리는기사',
        likeCount: 24,
        commentCount: 8,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        title: '서울외곽순환도로 쉼터 추천',
        content: '서울외곽순환도로에서 가장 깨끗하고 편리한 쉼터를 소개합니다.',
        category: '쉼터 정보',
        authorId: '2',
        authorNickname: '고속도로킹',
        likeCount: 18,
        commentCount: 5,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    const mockUsers = [
      {
        id: '1',
        nickname: '달리는기사',
        region: '서울',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        nickname: '고속도로킹',
        region: '경기',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];

    let searchResults = {
      posts: [] as typeof mockPosts,
      users: [] as typeof mockUsers,
      totalPosts: 0,
      totalUsers: 0
    };

    // 검색어로 필터링
    const searchTerm = query.toLowerCase();

    if (type === 'all' || type === 'posts') {
      searchResults.posts = mockPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm) ||
        post.authorNickname.toLowerCase().includes(searchTerm)
      );
      searchResults.totalPosts = searchResults.posts.length;
    }

    if (type === 'all' || type === 'users') {
      searchResults.users = mockUsers.filter(user => 
        user.nickname.toLowerCase().includes(searchTerm) ||
        user.region.toLowerCase().includes(searchTerm)
      );
      searchResults.totalUsers = searchResults.users.length;
    }

    // 페이지네이션
    if (type === 'posts') {
      searchResults.posts = searchResults.posts.slice(offset, offset + limit);
    } else if (type === 'users') {
      searchResults.users = searchResults.users.slice(offset, offset + limit);
    } else {
      // all인 경우 각각 5개씩만 반환
      searchResults.posts = searchResults.posts.slice(0, 5);
      searchResults.users = searchResults.users.slice(0, 5);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      query,
      type,
      results: searchResults,
      pagination: {
        page,
        limit,
        totalResults: searchResults.totalPosts + searchResults.totalUsers,
        hasNext: (type === 'posts' && page * limit < searchResults.totalPosts) ||
                 (type === 'users' && page * limit < searchResults.totalUsers) ||
                 (type === 'all' && (searchResults.totalPosts > 5 || searchResults.totalUsers > 5))
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('검색 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 