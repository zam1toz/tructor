import { db } from '../lib/db';
import { comments, posts } from '../lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '../lib/auth';

export async function action({ request, params }: { request: Request; params: { postId: string } }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

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

    const { postId } = params;
    const body = await request.json();
    const { content } = body;

    // 입력 검증
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '댓글 내용을 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (content.length > 500) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '댓글은 500자 이하여야 합니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 게시글 존재 확인
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId)
    });

    if (!post) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '존재하지 않는 게시글입니다.' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 댓글 생성
    const [newComment] = await db.insert(comments).values({
      postId,
      authorId: decoded.id,
      content: content.trim(),
      likeCount: 0
    }).returning();

    // 게시글 댓글 수 증가
    await db.update(posts)
      .set({ 
        commentCount: post.commentCount + 1,
        updatedAt: new Date()
      })
      .where(eq(posts.id, postId));

    // TODO: 포인트 시스템 구현 시 포인트 지급
    // await addPoints(decoded.id, 2, '댓글 작성');

    return new Response(JSON.stringify({ 
      success: true, 
      comment: newComment
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '댓글 작성 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 