import { db } from '../lib/db';
import { posts, bookmarks } from '../lib/db/schema';
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

    // 이미 북마크했는지 확인
    const existingBookmark = await db.query.bookmarks.findFirst({
      where: and(
        eq(bookmarks.postId, postId),
        eq(bookmarks.userId, decoded.id)
      )
    });

    if (existingBookmark) {
      // 북마크 취소
      await db.delete(bookmarks)
        .where(and(
          eq(bookmarks.postId, postId),
          eq(bookmarks.userId, decoded.id)
        ));

      return new Response(JSON.stringify({ 
        success: true, 
        bookmarked: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 북마크 추가
      await db.insert(bookmarks).values({
        postId,
        userId: decoded.id
      });

      return new Response(JSON.stringify({ 
        success: true, 
        bookmarked: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('북마크 처리 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '북마크 처리 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 