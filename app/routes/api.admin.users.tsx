import { db } from '../lib/db';
import { users, posts, comments, reports } from '../lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
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

    // 관리자 권한 확인
    const adminUser = await db.query.users.findFirst({
      where: eq(users.id, decoded.id)
    });

    if (!adminUser || !adminUser.is_admin) {
      return new Response(JSON.stringify({ success: false, error: '관리자 권한이 필요합니다.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const status = url.searchParams.get('status'); // active, banned
    const search = url.searchParams.get('search');

    const offset = (page - 1) * limit;

    // TODO: 실제 사용자 목록 조회 구현
    // 현재는 임시 데이터 반환
    const mockUsers = [
      {
        id: '1',
        nickname: '달리는기사',
        phone: '010-1234-5678',
        region: '서울',
        is_admin: false,
        status: 'active',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        postCount: 15,
        commentCount: 42,
        reportCount: 0
      },
      {
        id: '2',
        nickname: '고속도로킹',
        phone: '010-2345-6789',
        region: '경기',
        is_admin: false,
        status: 'active',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        lastLogin: new Date(Date.now() - 7200000).toISOString(),
        postCount: 8,
        commentCount: 23,
        reportCount: 1
      },
      {
        id: '3',
        nickname: '트럭마스터',
        phone: '010-3456-7890',
        region: '인천',
        is_admin: false,
        status: 'banned',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        postCount: 3,
        commentCount: 12,
        reportCount: 5
      },
      {
        id: '4',
        nickname: '운전왕',
        phone: '010-4567-8901',
        region: '부산',
        is_admin: false,
        status: 'active',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        lastLogin: new Date(Date.now() - 1800000).toISOString(),
        postCount: 22,
        commentCount: 67,
        reportCount: 0
      },
      {
        id: '5',
        nickname: '로드워리어',
        phone: '010-5678-9012',
        region: '대구',
        is_admin: false,
        status: 'active',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        lastLogin: new Date(Date.now() - 3600000).toISOString(),
        postCount: 11,
        commentCount: 34,
        reportCount: 2
      }
    ];

    let filteredUsers = mockUsers;

    // 상태 필터링
    if (status && status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 검색 필터링
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.nickname.toLowerCase().includes(searchTerm) ||
        user.phone.includes(search) ||
        user.region.toLowerCase().includes(searchTerm)
      );
    }

    // 페이지네이션
    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / limit);
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return new Response(JSON.stringify({ 
      success: true, 
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        totalActive: mockUsers.filter(u => u.status === 'active').length,
        totalBanned: mockUsers.filter(u => u.status === 'banned').length,
        totalAdmins: mockUsers.filter(u => u.is_admin).length
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('관리자 사용자 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 