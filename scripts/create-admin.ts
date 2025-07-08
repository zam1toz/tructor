import { createClient } from '@supabase/supabase-js';
import { config } from '../app/lib/config';
import bcrypt from 'bcryptjs';

const supabase = createClient(config.supabase.url, config.supabase.anonKey);

async function createAdminUser() {
  console.log('👑 새로운 관리자 계정 생성 중...\n');

  const adminData = {
    phone: '010-0000-0000',
    password: 'admin123!',
    nickname: '새관리자',
    region: '서울',
    is_admin: true,
    status: 'active'
  };

  try {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    console.log('📝 생성할 관리자 정보:');
    console.log(`   전화번호: ${adminData.phone}`);
    console.log(`   비밀번호: ${adminData.password}`);
    console.log(`   닉네임: ${adminData.nickname}`);
    console.log(`   지역: ${adminData.region}`);
    console.log('');

    // 사용자 생성
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        phone: adminData.phone,
        password: hashedPassword,
        nickname: adminData.nickname,
        region: adminData.region,
        is_admin: adminData.is_admin,
        status: adminData.status
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 관리자 계정 생성 오류:', error);
      return;
    }

    console.log('✅ 관리자 계정 생성 완료!');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   닉네임: ${newUser.nickname}`);
    console.log(`   권한: ${newUser.is_admin ? '관리자' : '일반'}`);
    console.log('');
    console.log('🔑 로그인 정보:');
    console.log(`   전화번호: ${adminData.phone}`);
    console.log(`   비밀번호: ${adminData.password}`);
    console.log('');
    console.log('💡 이제 이 계정으로 로그인하여 관리자 기능을 테스트할 수 있습니다.');

  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

createAdminUser(); 