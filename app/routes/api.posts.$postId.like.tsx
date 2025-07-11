import { db } from '../lib/db';
import { posts, likes } from '../lib/db/schema';
import { eq, and } from 'drizzle-orm';
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

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await db.query.likes.findFirst({
      where: and(
        eq(likes.targetId, postId),
        eq(likes.userId, decoded.id),
        eq(likes.targetType, 'post')
      )
    });

    if (existingLike) {
      // 좋아요 취소
      await db.delete(likes)
        .where(and(
          eq(likes.targetId, postId),
          eq(likes.userId, decoded.id),
          eq(likes.targetType, 'post')
        ));

      // 게시글 좋아요 수 감소
      await db.update(posts)
        .set({ 
          likeCount: Math.max(0, post.likeCount - 1),
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId));

      return new Response(JSON.stringify({ 
        success: true, 
        liked: false,
        likeCount: Math.max(0, post.likeCount - 1)
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 좋아요 추가
      await db.insert(likes).values({
        targetId: postId,
        userId: decoded.id,
        targetType: 'post'
      });

      // 게시글 좋아요 수 증가
      await db.update(posts)
        .set({ 
          likeCount: post.likeCount + 1,
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId));

      // TODO: 포인트 시스템 구현 시 포인트 지급
      // await addPoints(decoded.id, 1, '게시글 좋아요');

      return new Response(JSON.stringify({ 
        success: true, 
        liked: true,
        likeCount: post.likeCount + 1
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '좋아요 처리 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 