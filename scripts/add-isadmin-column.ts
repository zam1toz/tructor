import postgres from 'postgres';
import { config } from '../app/lib/config';

async function addIsAdminColumn() {
  const sql = postgres(config.database.url, { max: 1 });
  try {
    // is_admin 컬럼 추가 (기본값 false)
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;
    `;
    console.log('✅ is_admin 컬럼 추가 완료');
    
    // 기존 row들의 is_admin 값을 false로 설정
    await sql`
      UPDATE users SET is_admin = false WHERE is_admin IS NULL;
    `;
    console.log('✅ 기존 row들의 is_admin 값 설정 완료');
    
  } catch (error) {
    console.error('is_admin 컬럼 추가 오류:', error);
  } finally {
    await sql.end();
  }
}

addIsAdminColumn(); 