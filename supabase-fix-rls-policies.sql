-- =====================================================
-- RLS 정책 수정 스크립트 (Supabase SQL 에디터용)
-- =====================================================

-- 1. is_admin 함수 재생성
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id::text = auth.uid()::text 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 현재 정책 상태 확인
SELECT 
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- 3. 테스트용 관리자 사용자 생성 (필요시)
-- INSERT INTO users (id, phone, password, nickname, region, is_admin, status)
-- VALUES (
--   gen_random_uuid(), 
--   '010-1234-5678', 
--   'hashed_password', 
--   '테스트관리자', 
--   '서울', 
--   true, 
--   'active'
-- );

-- 4. 사용자 통계 확인
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_admin = true) as admin_users,
  COUNT(*) FILTER (WHERE is_admin = false) as regular_users
FROM users;

-- 5. RLS 활성화 상태 확인
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'posts', 'comments')
ORDER BY tablename;

-- 6. 정책 테스트 (관리자 권한으로)
-- 이 쿼리는 관리자로 로그인한 상태에서 실행해야 합니다
SELECT 
  '현재 사용자 ID' as info,
  auth.uid()::text as user_id
UNION ALL
SELECT 
  '관리자 여부' as info,
  CASE WHEN is_admin() THEN 'YES' ELSE 'NO' END as is_admin_status;

-- 7. 모든 사용자 조회 (관리자 권한 필요)
-- SELECT id, nickname, region, is_admin, status, created_at 
-- FROM users 
-- ORDER BY created_at DESC; 