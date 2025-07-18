-- =====================================================
-- RLS 정책 테스트 스크립트 (Supabase SQL 에디터용)
-- =====================================================

-- 테스트 1: is_admin 함수 존재 확인
SELECT 
  proname,
  prosrc
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND proname = 'is_admin';

-- 테스트 2: 현재 정책 상태 상세 확인
SELECT 
  tablename,
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 테스트 3: RLS 활성화 상태
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
AND tablename IN ('users', 'posts', 'comments')
ORDER BY tablename;

-- 테스트 4: 사용자 데이터 확인
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_admin = true) as admin_users,
  COUNT(*) FILTER (WHERE is_admin = false) as regular_users,
  COUNT(*) FILTER (WHERE status = 'active') as active_users,
  COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users
FROM users;

-- 테스트 5: 최근 사용자 목록 (관리자 권한 필요)
-- SELECT 
--   id,
--   nickname,
--   region,
--   is_admin,
--   status,
--   created_at
-- FROM users 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- 테스트 6: 정책 동작 테스트 (관리자 권한으로)
-- 현재 사용자 정보 확인
SELECT 
  '현재 사용자 ID' as info,
  auth.uid()::text as value
UNION ALL
SELECT 
  '관리자 여부' as info,
  CASE WHEN is_admin() THEN 'YES' ELSE 'NO' END as value
UNION ALL
SELECT 
  '현재 시간' as info,
  NOW()::text as value;

-- 테스트 7: 정책 조건 분석
-- users 테이블의 DELETE 정책 조건 확인
SELECT 
  policyname,
  qual as condition,
  'DELETE 정책 조건' as description
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'users' 
AND cmd = 'DELETE'; 