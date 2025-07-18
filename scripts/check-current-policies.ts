import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../app/lib/config';

async function checkCurrentPolicies() {
  console.log('🔍 현재 RLS 정책 상태를 확인합니다...\n');
  
  // 데이터베이스 연결
  const client = postgres(config.database.url);
  
  try {
    // 1. RLS 활성화 상태 확인
    console.log('1️⃣ RLS 활성화 상태:');
    const rlsStatus = await client`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'posts', 'comments')
      ORDER BY tablename;
    `;
    
    rlsStatus.forEach((row: any) => {
      console.log(`   ${row.tablename}: ${row.rowsecurity ? '✅ 활성화' : '❌ 비활성화'}`);
    });
    
    // 2. users 테이블의 정책 확인
    console.log('\n2️⃣ users 테이블 정책:');
    const userPolicies = await client`
      SELECT policyname, cmd, permissive, roles, qual, with_check
      FROM pg_policies 
      WHERE schemaname = 'public' AND tablename = 'users'
      ORDER BY policyname;
    `;
    
    if (userPolicies.length === 0) {
      console.log('   ❌ 정책이 없습니다!');
    } else {
      userPolicies.forEach((policy: any) => {
        console.log(`   📋 ${policy.policyname}`);
        console.log(`      명령: ${policy.cmd}`);
        console.log(`      허용: ${policy.permissive ? 'YES' : 'NO'}`);
        console.log(`      조건: ${policy.qual || '없음'}`);
        console.log(`      체크: ${policy.with_check || '없음'}`);
        console.log('');
      });
    }
    
    // 3. is_admin 함수 존재 확인
    console.log('3️⃣ is_admin 함수 확인:');
    const functions = await client`
      SELECT proname, prosrc
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND proname = 'is_admin';
    `;
    
    if (functions.length === 0) {
      console.log('   ❌ is_admin 함수가 없습니다!');
    } else {
      console.log('   ✅ is_admin 함수가 존재합니다');
      console.log(`   📝 함수 내용: ${functions[0].prosrc}`);
    }
    
    // 4. 테스트 사용자 생성 시도
    console.log('\n4️⃣ 사용자 생성 테스트:');
    try {
      const testUserId = `test-user-${Date.now()}`;
      await client`
        INSERT INTO users (id, phone, password, nickname, region, is_admin, status)
        VALUES (${testUserId}, '010-1234-5678', 'hashed_password', '테스트사용자', '서울', false, 'active')
      `;
      console.log('   ✅ 사용자 생성 성공');
      
      // 생성된 사용자 삭제
      await client`DELETE FROM users WHERE id = ${testUserId}`;
      console.log('   🧹 테스트 사용자 삭제 완료');
    } catch (error) {
      console.log('   ❌ 사용자 생성 실패:', error);
    }
    
    // 5. 사용자 조회 테스트
    console.log('\n5️⃣ 사용자 조회 테스트:');
    try {
      const userCount = await client`SELECT COUNT(*) as count FROM users`;
      console.log(`   📊 전체 사용자 수: ${userCount[0].count}`);
    } catch (error) {
      console.log('   ❌ 사용자 조회 실패:', error);
    }
    
    console.log('\n✅ 정책 상태 확인 완료!');
    
  } catch (error) {
    console.error('❌ 정책 확인 중 오류:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// 스크립트 실행
checkCurrentPolicies()
  .then(() => {
    console.log('\n🎉 정책 상태 확인이 완료되었습니다!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 정책 상태 확인 실패:', error);
    process.exit(1);
  }); 