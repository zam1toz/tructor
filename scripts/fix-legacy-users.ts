import postgres from 'postgres';
import { config } from '../app/lib/config';

async function fixLegacyUsers() {
  const sql = postgres(config.database.url, { max: 1 });
  try {
    const result = await sql`
      UPDATE users
      SET phone = CONCAT('legacy_user_', id),
          password = '*'
      WHERE phone IS NULL OR password IS NULL
      RETURNING id, nickname, phone, password;
    `;
    console.log('수정된 레거시 유저:', result);
  } catch (error) {
    console.error('레거시 유저 수정 오류:', error);
  } finally {
    await sql.end();
  }
}

fixLegacyUsers(); 