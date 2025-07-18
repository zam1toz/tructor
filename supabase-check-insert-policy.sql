-- =====================================================
-- INSERT 정책 문제 진단 및 수정 (Supabase SQL 에디터용)
-- =====================================================

-- 1. 현재 users 테이블의 INSERT 정책 확인
SELECT 
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users' 
AND cmd = 'INSERT';

-- 2. RLS 활성화 상태 확인
SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ 활성화'
    ELSE '❌ 비활성화'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';

-- 3. 현재 정책 모두 확인
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users'
ORDER BY cmd, policyname;

-- 4. INSERT 정책 수정 (필요시)
-- 기존 INSERT 정책 삭제
DROP POLICY IF EXISTS "Enable insert for all users" ON users;

-- 새로운 INSERT 정책 생성 (회원가입 허용)
CREATE POLICY "Enable insert for registration" ON users
  FOR INSERT 
  WITH CHECK (true);  -- 모든 INSERT 허용 (회원가입용)

-- 5. 정책 테스트용 사용자 생성 시도
-- INSERT INTO users (id, phone, password, nickname, region, is_admin, status)
-- VALUES (
--   gen_random_uuid(), 
--   '010-9999-8888', 
--   'hashed_password', 
--   '테스트사용자', 
--   '서울', 
--   false, 
--   'active'
-- );

-- 6. 최종 정책 상태 확인
SELECT 
  '최종 정책 상태' as info,
  COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users'
UNION ALL
SELECT 
  'INSERT 정책' as info,
  COUNT(*) as count
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users' 
AND cmd = 'INSERT'; 