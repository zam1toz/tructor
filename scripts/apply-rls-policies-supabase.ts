import { createClient } from '@supabase/supabase-js';
import { config } from '../app/lib/config';
import { applyAllRLSPolicies } from '../app/lib/db/rls-policies';

async function applyRLSPoliciesToSupabase() {
  console.log('🚀 Supabase에 RLS 정책 적용을 시작합니다...');
  
  // Supabase 클라이언트 생성 (service_role 키 사용)
  const supabase = createClient(
    config.supabase.url,
    config.supabase.serviceRoleKey // service_role 키 필요
  );
  
  try {
    // RLS 정책 SQL 실행
    const { error } = await supabase.rpc('exec_sql', {
      sql: applyAllRLSPolicies.toString()
    });
    
    if (error) {
      console.error('❌ RLS 정책 적용 중 오류가 발생했습니다:', error);
      throw error;
    }
    
    console.log('✅ 모든 RLS 정책이 성공적으로 적용되었습니다!');
    console.log('');
    console.log('📋 적용된 정책들:');
    console.log('- Users: 사용자 프로필 관리');
    console.log('- Posts: 게시글 CRUD');
    console.log('- Comments: 댓글 CRUD');
    console.log('- Likes: 좋아요 관리');
    console.log('- Reports: 신고 관리');
    console.log('- RestAreas: 휴게소 관리');
    console.log('- Notifications: 알림 관리');
    console.log('- AdminActionLogs: 관리자 로그');
    console.log('- Media: 미디어 파일 관리');
    console.log('- BanHistory: 차단 기록');
    console.log('- Bookmarks: 북마크 관리');
    console.log('- Points: 포인트 관리');
    console.log('- Missions: 미션 관리');
    console.log('- UserMissions: 사용자 미션 진행');
    
  } catch (error) {
    console.error('❌ RLS 정책 적용 중 오류가 발생했습니다:', error);
    throw error;
  }
}

// 스크립트 실행
applyRLSPoliciesToSupabase()
  .then(() => {
    console.log('🎉 RLS 정책 적용이 완료되었습니다!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 RLS 정책 적용 실패:', error);
    process.exit(1);
  });

export { applyRLSPoliciesToSupabase }; 