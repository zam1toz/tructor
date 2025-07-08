import { db } from '../app/lib/db';
import { users } from '../app/lib/db/schema';
import { eq } from 'drizzle-orm';

async function checkAdminUsers() {
  console.log('🔍 관리자 계정 확인 중...\n');

  try {
    // 모든 사용자 조회
    const allUsers = await db.select({
      id: users.id,
      nickname: users.nickname,
      phone: users.phone,
      region: users.region,
      is_admin: users.is_admin,
      status: users.status,
      createdAt: users.createdAt
    }).from(users);

    console.log('📋 전체 사용자 목록:');
    console.log('─'.repeat(80));
    
    allUsers.forEach((user, index) => {
      const adminBadge = user.is_admin ? '👑 관리자' : '👤 일반';
      const statusBadge = user.status === 'active' ? '✅ 활성' : '❌ 정지';
      
      console.log(`${index + 1}. ${user.nickname} (${user.phone})`);
      console.log(`   지역: ${user.region} | 권한: ${adminBadge} | 상태: ${statusBadge}`);
      console.log(`   가입일: ${user.createdAt?.toLocaleDateString()}`);
      console.log('');
    });

    // 관리자 계정만 필터링
    const adminUsers = allUsers.filter(user => user.is_admin);
    
    console.log('👑 관리자 계정 목록:');
    console.log('─'.repeat(80));
    
    if (adminUsers.length === 0) {
      console.log('❌ 관리자 계정이 없습니다.');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.nickname} (${user.phone})`);
        console.log(`   지역: ${user.region} | 가입일: ${user.createdAt?.toLocaleDateString()}`);
      });
    }

    console.log('\n✅ 확인 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

checkAdminUsers(); 