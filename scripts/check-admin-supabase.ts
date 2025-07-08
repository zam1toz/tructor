import { createClient } from '@supabase/supabase-js';
import { config } from '../app/lib/config';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

async function checkAdminUsers() {
  console.log('🔍 Supabase에서 관리자 계정 확인 중...\n');

  try {
    // 모든 사용자 조회
    const { data: allUsers, error } = await supabase
      .from('users')
      .select('id, nickname, phone, region, is_admin, status, created_at');

    if (error) {
      console.error('❌ Supabase 조회 오류:', error);
      return;
    }

    if (!allUsers || allUsers.length === 0) {
      console.log('❌ 사용자가 없습니다.');
      return;
    }

    console.log('📋 전체 사용자 목록:');
    console.log('─'.repeat(80));
    
    allUsers.forEach((user, index) => {
      const adminBadge = user.is_admin ? '👑 관리자' : '👤 일반';
      const statusBadge = user.status === 'active' ? '✅ 활성' : '❌ 정지';
      
      console.log(`${index + 1}. ${user.nickname} (${user.phone})`);
      console.log(`   지역: ${user.region} | 권한: ${adminBadge} | 상태: ${statusBadge}`);
      console.log(`   가입일: ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}`);
      console.log('');
    });

    // 관리자 계정만 필터링
    const adminUsers = allUsers.filter(user => user.is_admin);
    
    console.log('👑 관리자 계정 목록:');
    console.log('─'.repeat(80));
    
    if (adminUsers.length === 0) {
      console.log('❌ 관리자 계정이 없습니다.');
      console.log('\n💡 관리자 계정을 만들려면:');
      console.log('1. Supabase 대시보드 → SQL Editor');
      console.log('2. 다음 쿼리 실행:');
      console.log('   UPDATE users SET is_admin = true WHERE nickname = \'원하는닉네임\';');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.nickname} (${user.phone})`);
        console.log(`   지역: ${user.region} | 가입일: ${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}`);
      });
    }

    console.log('\n✅ 확인 완료!');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

checkAdminUsers(); 