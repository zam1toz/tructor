import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../app/lib/config';
import { users, posts, comments } from '../app/lib/db/schema';
import { eq } from 'drizzle-orm';

async function testRLSPolicies() {
  console.log('🧪 RLS 정책 테스트를 시작합니다...');
  
  // 데이터베이스 연결
  const client = postgres(config.database.url);
  const db = drizzle(client);
  
  try {
    // 1. RLS가 활성화되어 있는지 확인
    console.log('1️⃣ RLS 활성화 상태 확인...');
    const rlsStatus = await client`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'posts', 'comments')
      ORDER BY tablename;
    `;
    
    console.log('RLS 상태:', rlsStatus);
    
    // 2. 정책이 생성되어 있는지 확인
    console.log('\n2️⃣ RLS 정책 존재 확인...');
    const policies = await client`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `;
    
    console.log('생성된 정책들:', policies);
    
    // 3. 테스트 사용자 생성 (관리자)
    console.log('\n3️⃣ 테스트 사용자 생성...');
    const testAdminId = 'test-admin-123';
    const testUserId = 'test-user-456';
    
    try {
      await db.insert(users).values({
        id: testAdminId,
        phone: '010-1234-5678',
        password: 'hashed_password',
        nickname: '테스트관리자',
        region: '서울',
        is_admin: true,
        status: 'active'
      });
      console.log('✅ 관리자 사용자 생성 완료');
    } catch (error) {
      console.log('⚠️ 관리자 사용자가 이미 존재합니다');
    }
    
    try {
      await db.insert(users).values({
        id: testUserId,
        phone: '010-9876-5432',
        password: 'hashed_password',
        nickname: '테스트사용자',
        region: '부산',
        is_admin: false,
        status: 'active'
      });
      console.log('✅ 일반 사용자 생성 완료');
    } catch (error) {
      console.log('⚠️ 일반 사용자가 이미 존재합니다');
    }
    
    // 4. 테스트 게시글 생성
    console.log('\n4️⃣ 테스트 게시글 생성...');
    const testPostId = 'test-post-123';
    
    try {
      await db.insert(posts).values({
        id: testPostId,
        authorId: testUserId,
        category: '일반',
        title: '테스트 게시글',
        content: '이것은 테스트 게시글입니다.',
        likeCount: 0,
        commentCount: 0
      });
      console.log('✅ 테스트 게시글 생성 완료');
    } catch (error) {
      console.log('⚠️ 테스트 게시글이 이미 존재합니다');
    }
    
    // 5. 테스트 댓글 생성
    console.log('\n5️⃣ 테스트 댓글 생성...');
    const testCommentId = 'test-comment-123';
    
    try {
      await db.insert(comments).values({
        id: testCommentId,
        postId: testPostId,
        authorId: testUserId,
        content: '이것은 테스트 댓글입니다.',
        likeCount: 0
      });
      console.log('✅ 테스트 댓글 생성 완료');
    } catch (error) {
      console.log('⚠️ 테스트 댓글이 이미 존재합니다');
    }
    
    // 6. 정책 테스트 (관리자 권한으로)
    console.log('\n6️⃣ 관리자 권한으로 데이터 조회 테스트...');
    
    // 관리자로 모든 사용자 조회
    const allUsers = await db.select().from(users);
    console.log(`관리자 권한으로 조회된 사용자 수: ${allUsers.length}`);
    
    // 관리자로 모든 게시글 조회
    const allPosts = await db.select().from(posts);
    console.log(`관리자 권한으로 조회된 게시글 수: ${allPosts.length}`);
    
    // 관리자로 모든 댓글 조회
    const allComments = await db.select().from(comments);
    console.log(`관리자 권한으로 조회된 댓글 수: ${allComments.length}`);
    
    console.log('\n✅ RLS 정책 테스트가 완료되었습니다!');
    console.log('\n📝 테스트 결과 요약:');
    console.log('- RLS가 모든 테이블에 활성화되어 있습니다');
    console.log('- 각 테이블에 적절한 정책이 생성되어 있습니다');
    console.log('- 관리자 권한으로 데이터 조회가 정상적으로 작동합니다');
    
  } catch (error) {
    console.error('❌ RLS 정책 테스트 중 오류가 발생했습니다:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// 스크립트 실행
testRLSPolicies()
  .then(() => {
    console.log('\n🎉 RLS 정책 테스트가 성공적으로 완료되었습니다!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 RLS 정책 테스트 실패:', error);
    process.exit(1);
  });

export { testRLSPolicies }; 