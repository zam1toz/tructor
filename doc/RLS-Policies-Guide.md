# RLS (Row Level Security) 정책 가이드

## 개요

이 문서는 Tructor 프로젝트에서 DrizzleORM을 사용하여 구현한 RLS(Row Level Security) 정책에 대한 상세한 가이드를 제공합니다.

## RLS란?

Row Level Security는 PostgreSQL에서 제공하는 보안 기능으로, 데이터베이스 레벨에서 행 단위로 접근을 제어할 수 있게 해줍니다. 이를 통해 애플리케이션 레벨에서 추가적인 보안 로직을 구현하지 않아도 됩니다.

## 구현된 정책들

### 1. Users 테이블

**정책 목적**: 사용자 프로필 관리 및 보안

**정책들**:
- `Users can view own profile`: 사용자는 자신의 정보만 조회 가능
- `Users can update own profile`: 사용자는 자신의 정보만 수정 가능
- `Admins can manage all users`: 관리자는 모든 사용자 정보 조회/수정 가능
- `Users can insert own profile`: 회원가입 시 INSERT 허용
- `Only admins can delete users`: 삭제는 관리자만 가능

### 2. Posts 테이블

**정책 목적**: 게시글 CRUD 작업 제어

**정책들**:
- `Anyone can view posts`: 모든 사용자가 게시글 조회 가능
- `Authenticated users can create posts`: 인증된 사용자만 게시글 작성 가능
- `Authors can update own posts`: 작성자만 게시글 수정 가능
- `Authors and admins can delete posts`: 작성자와 관리자만 게시글 삭제 가능

### 3. Comments 테이블

**정책 목적**: 댓글 CRUD 작업 제어

**정책들**:
- `Anyone can view comments`: 모든 사용자가 댓글 조회 가능
- `Authenticated users can create comments`: 인증된 사용자만 댓글 작성 가능
- `Authors can update own comments`: 작성자만 댓글 수정 가능
- `Authors and admins can delete comments`: 작성자와 관리자만 댓글 삭제 가능

### 4. Likes 테이블

**정책 목적**: 좋아요 기능 제어

**정책들**:
- `Users can view own likes`: 사용자는 자신의 좋아요만 조회 가능
- `Authenticated users can create likes`: 인증된 사용자만 좋아요 생성 가능
- `Users can delete own likes`: 사용자만 자신의 좋아요 삭제 가능
- `Admins can view all likes`: 관리자는 모든 좋아요 조회 가능

### 5. Reports 테이블

**정책 목적**: 신고 시스템 제어

**정책들**:
- `Reporters can view own reports`: 신고자는 자신의 신고만 조회 가능
- `Authenticated users can create reports`: 인증된 사용자만 신고 생성 가능
- `Admins can manage all reports`: 관리자는 모든 신고 조회/수정 가능
- `Only admins can update reports`: 신고 상태 변경은 관리자만 가능

### 6. RestAreas 테이블

**정책 목적**: 휴게소 정보 관리

**정책들**:
- `Anyone can view rest areas`: 모든 사용자가 휴게소 조회 가능
- `Only admins can manage rest areas`: 관리자만 휴게소 생성/수정/삭제 가능

### 7. Notifications 테이블

**정책 목적**: 알림 시스템 제어

**정책들**:
- `Users can view own notifications`: 사용자는 자신의 알림만 조회 가능
- `System can create notifications`: 시스템이 알림 생성 가능 (관리자 권한으로)
- `Users can update own notification status`: 사용자는 자신의 알림 상태만 수정 가능
- `Users can delete own notifications`: 사용자는 자신의 알림만 삭제 가능

### 8. AdminActionLogs 테이블

**정책 목적**: 관리자 활동 로그 보안

**정책들**:
- `Only admins can view action logs`: 관리자만 로그 조회 가능
- `Only admins can create action logs`: 관리자만 로그 생성 가능
- `Only admins can update action logs`: 관리자만 로그 수정 가능
- `Only admins can delete action logs`: 관리자만 로그 삭제 가능

### 9. Media 테이블

**정책 목적**: 미디어 파일 관리

**정책들**:
- `Anyone can view media`: 모든 사용자가 미디어 조회 가능
- `Authenticated users can upload media`: 인증된 사용자만 미디어 업로드 가능
- `Owners can update own media`: 소유자만 미디어 수정 가능
- `Owners and admins can delete media`: 소유자와 관리자만 미디어 삭제 가능

### 10. BanHistory 테이블

**정책 목적**: 차단 기록 관리

**정책들**:
- `Users can view own ban history`: 사용자는 자신의 차단 기록만 조회 가능
- `Only admins can create ban history`: 관리자만 차단 기록 생성 가능
- `Only admins can update ban history`: 관리자만 차단 기록 수정 가능
- `Only admins can delete ban history`: 관리자만 차단 기록 삭제 가능

### 11. Bookmarks 테이블

**정책 목적**: 북마크 기능 제어

**정책들**:
- `Users can view own bookmarks`: 사용자는 자신의 북마크만 조회 가능
- `Authenticated users can create bookmarks`: 인증된 사용자만 북마크 생성 가능
- `Users can delete own bookmarks`: 사용자만 자신의 북마크 삭제 가능

### 12. Points 테이블

**정책 목적**: 포인트 시스템 제어

**정책들**:
- `Users can view own points`: 사용자는 자신의 포인트 기록만 조회 가능
- `System can create points`: 시스템이 포인트 생성 가능 (관리자 권한으로)
- `Only admins can update points`: 관리자만 포인트 수정 가능
- `Only admins can delete points`: 관리자만 포인트 삭제 가능

### 13. Missions 테이블

**정책 목적**: 미션 관리

**정책들**:
- `Anyone can view missions`: 모든 사용자가 미션 조회 가능
- `Only admins can manage missions`: 관리자만 미션 생성/수정/삭제 가능

### 14. UserMissions 테이블

**정책 목적**: 사용자 미션 진행 상황 관리

**정책들**:
- `Users can view own user missions`: 사용자는 자신의 미션 진행 상황만 조회 가능
- `Authenticated users can join missions`: 인증된 사용자만 미션 참여 가능
- `Users can update own user missions`: 사용자는 자신의 미션 진행 상황만 수정 가능
- `Users can delete own user missions`: 사용자는 자신의 미션 진행 상황만 삭제 가능
- `Admins can view all user missions`: 관리자는 모든 사용자 미션 조회 가능

## 사용 방법

### 1. RLS 정책 적용

```bash
npm run db:apply-rls
```

### 2. RLS 정책 테스트

```bash
npm run db:test-rls
```

### 3. 특정 테이블의 정책만 적용

```typescript
import { applyUsersPolicies } from './app/lib/db/rls-policies';

// Users 테이블에만 RLS 정책 적용
await db.execute(applyUsersPolicies);
```

## 보안 고려사항

### 1. 인증 확인

모든 RLS 정책은 `auth.uid()`를 사용하여 현재 인증된 사용자를 확인합니다. 이는 Supabase의 인증 시스템과 연동됩니다.

### 2. 관리자 권한 확인

관리자 권한이 필요한 작업들은 다음과 같은 조건을 사용합니다:

```sql
EXISTS (
  SELECT 1 FROM users 
  WHERE id::text = auth.uid()::text 
  AND is_admin = true
)
```

### 3. 소유권 확인

사용자가 자신의 데이터만 접근할 수 있도록 다음과 같은 조건을 사용합니다:

```sql
auth.uid()::text = user_id::text
```

## 주의사항

1. **데이터 타입 변환**: UUID와 텍스트 간의 비교를 위해 `::text` 캐스팅을 사용합니다.
2. **정책 충돌**: 여러 정책이 동일한 작업에 적용될 때 OR 조건으로 결합됩니다.
3. **성능**: RLS 정책은 쿼리 실행 시마다 평가되므로 복잡한 정책은 성능에 영향을 줄 수 있습니다.

## 문제 해결

### 1. RLS 정책이 작동하지 않는 경우

- 데이터베이스 연결이 올바른지 확인
- `auth.uid()`가 올바르게 설정되어 있는지 확인
- 정책이 올바르게 생성되었는지 확인

### 2. 권한 오류가 발생하는 경우

- 사용자가 올바르게 인증되었는지 확인
- 관리자 권한이 필요한 작업인지 확인
- 해당 사용자가 작업 대상 데이터의 소유자인지 확인

### 3. 정책 테스트

```bash
npm run db:test-rls
```

이 명령어를 실행하여 RLS 정책이 올바르게 작동하는지 확인할 수 있습니다.

## 추가 정보

- [PostgreSQL RLS 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [DrizzleORM SQL 템플릿](https://orm.drizzle.team/docs/get-started-postgresql#sql-templates) 