import { db } from '../lib/db';
import { posts } from '../lib/db/schema';
import { verifyToken } from '../lib/auth';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // 쿠키에서 토큰 추출
    let token: string | undefined = undefined;
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
      token = cookies['auth_token'];
    }
    if (!token) {
      token = request.headers.get('Authorization')?.replace('Bearer ', '');
    }
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

    const body = await request.json();
    const { title, content, category } = body;

    // 입력 검증
    if (!title || !content || !category) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '제목, 내용, 카테고리를 모두 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (title.length > 100) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '제목은 100자 이하여야 합니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (content.length > 2000) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '내용은 2000자 이하여야 합니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 게시글 저장
    const newPosts = await db.insert(posts).values({
      title,
      content,
      category,
      authorId: decoded.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    const newPost = newPosts[0];
    return new Response(
      JSON.stringify({ success: true, post: { id: newPost.id } }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 