// Supabase 설정
export const config = {
  database: {
    // Supabase 연결 (비밀번호 재설정 후 사용)
    url: process.env.DATABASE_URL || 'postgresql://postgres:tructor#4431@db.fqeexfxrwgqplyhsfrcc.supabase.co:5432/postgres',
    // 로컬 PostgreSQL 연결 (임시)
    //url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/tructor',
  },
  supabase: {
    url: process.env.SUPABASE_URL || 'https://fqeexfxrwgqplyhsfrcc.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxZWV4Znhyd2dxcGx5aHNmcmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNDk3MTgsImV4cCI6MjA2NjkyNTcxOH0.FvjzJnafTXIYjsyZrSSdUL2O78pnHFkjUxAOYGYglHs',
  },
  app: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
} as const;

// 설정 유효성 검사
export function validateConfig() {
  const requiredFields = [
    { field: 'DATABASE_URL', value: config.database.url },
    { field: 'SUPABASE_URL', value: config.supabase.url },
    { field: 'SUPABASE_ANON_KEY', value: config.supabase.anonKey },
  ];

  const missingFields = requiredFields.filter(
    ({ value }) => value.includes('[YOUR-') || value.includes('[PROJECT-REF]')
  );

  if (missingFields.length > 0) {
    console.warn('⚠️  다음 설정이 필요합니다:');
    missingFields.forEach(({ field }) => {
      console.warn(`   - ${field}`);
    });
    console.warn('\n📝 Supabase 프로젝트에서 다음 정보를 확인하세요:');
    console.warn('   1. Settings → Database → Connection string → URI');
    console.warn('   2. Settings → API → Project API keys → anon public');
    return false;
  }

  return true;
} 