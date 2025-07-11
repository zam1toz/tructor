import { db } from '../lib/db';
import { posts, users, comments } from '../lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function loader({ request, params }: { request: Request; params: { postId: string } }) {
  try {
    const { postId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const offset = (page - 1) * limit;

    // TODO: 실제 게시글 상세 조회 구현
    // 현재는 임시 데이터 반환
    const mockPost = {
      id: postId,
      title: '경부선 고속도로 단속 정보',
      content: '오늘 오후 2시부터 경부선 고속도로에서 단속이 있을 예정입니다. 특히 과속 단속이 강화될 예정이니 주의하세요.\n\n구체적인 단속 구간:\n- 서울 ~ 수원 구간\n- 수원 ~ 천안 구간\n- 천안 ~ 대전 구간\n\n단속 시간: 오후 2시 ~ 오후 6시\n단속 종류: 과속, 차선 변경 위반, 안전거리 미준수\n\n모든 기사님들께서 안전 운전하시기 바랍니다.',
      category: '단속 정보',
      authorId: '1',
      authorNickname: '달리는기사',
      authorRegion: '서울',
      likeCount: 24,
      commentCount: 8,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1일 전
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      isLiked: false, // TODO: 실제 사용자 좋아요 상태 확인
      isBookmarked: false // TODO: 실제 사용자 북마크 상태 확인
    };

    const mockComments = [
      {
        id: '1',
        postId: postId,
        content: '정말 유용한 정보네요! 감사합니다.',
        authorId: '2',
        authorNickname: '고속도로킹',
        likeCount: 5,
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2시간 전
        isLiked: false
      },
      {
        id: '2',
        postId: postId,
        content: '천안 구간은 항상 단속이 심하니까 특히 주의해야겠네요.',
        authorId: '3',
        authorNickname: '트럭마스터',
        likeCount: 3,
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1시간 전
        isLiked: false
      },
      {
        id: '3',
        postId: postId,
        content: '오늘 운행 예정인데 정말 도움이 됩니다. 감사합니다!',
        authorId: '4',
        authorNickname: '운전왕',
        likeCount: 2,
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30분 전
        isLiked: false
      }
    ];

    // 페이지네이션
    const totalComments = mockComments.length;
    const totalPages = Math.ceil(totalComments / limit);
    const paginatedComments = mockComments.slice(offset, offset + limit);

    return new Response(JSON.stringify({ 
      success: true, 
      post: mockPost,
      comments: paginatedComments,
      pagination: {
        page,
        limit,
        totalComments,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 