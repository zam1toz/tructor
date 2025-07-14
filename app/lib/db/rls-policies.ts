import { sql } from 'drizzle-orm';
import { 
  users, 
  posts, 
  comments, 
  likes, 
  reports, 
  restAreas, 
  notifications, 
  adminActionLogs, 
  media, 
  banHistory, 
  bookmarks, 
  points, 
  missions, 
  userMissions 
} from './schema';

// RLS 활성화를 위한 SQL
export const enableRLS = sql`
-- 모든 테이블에 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE rest_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ban_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE points ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
`;

// Users 테이블 RLS 정책
export const usersPolicies = sql`
-- Users 테이블 정책

-- 1. 사용자는 자신의 정보만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- 2. 관리자는 모든 사용자 정보 조회/수정 가능
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 3. 회원가입 시 INSERT 허용 (인증된 사용자만)
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- 4. 삭제는 관리자만 가능
CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Posts 테이블 RLS 정책
export const postsPolicies = sql`
-- Posts 테이블 정책

-- 1. 모든 사용자가 게시글 조회 가능
CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

-- 2. 인증된 사용자만 게시글 작성 가능
CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

-- 3. 작성자만 게시글 수정 가능
CREATE POLICY "Authors can update own posts" ON posts
  FOR UPDATE USING (auth.uid()::text = author_id::text);

-- 4. 작성자와 관리자만 게시글 삭제 가능
CREATE POLICY "Authors and admins can delete posts" ON posts
  FOR DELETE USING (
    auth.uid()::text = author_id::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Comments 테이블 RLS 정책
export const commentsPolicies = sql`
-- Comments 테이블 정책

-- 1. 모든 사용자가 댓글 조회 가능
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

-- 2. 인증된 사용자만 댓글 작성 가능
CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

-- 3. 작성자만 댓글 수정 가능
CREATE POLICY "Authors can update own comments" ON comments
  FOR UPDATE USING (auth.uid()::text = author_id::text);

-- 4. 작성자와 관리자만 댓글 삭제 가능
CREATE POLICY "Authors and admins can delete comments" ON comments
  FOR DELETE USING (
    auth.uid()::text = author_id::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Likes 테이블 RLS 정책
export const likesPolicies = sql`
-- Likes 테이블 정책

-- 1. 사용자는 자신의 좋아요만 조회 가능
CREATE POLICY "Users can view own likes" ON likes
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 2. 인증된 사용자만 좋아요 생성 가능
CREATE POLICY "Authenticated users can create likes" ON likes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 3. 사용자만 자신의 좋아요 삭제 가능
CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- 4. 관리자는 모든 좋아요 조회 가능
CREATE POLICY "Admins can view all likes" ON likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Reports 테이블 RLS 정책
export const reportsPolicies = sql`
-- Reports 테이블 정책

-- 1. 신고자는 자신의 신고만 조회 가능
CREATE POLICY "Reporters can view own reports" ON reports
  FOR SELECT USING (auth.uid()::text = reporter_id::text);

-- 2. 인증된 사용자만 신고 생성 가능
CREATE POLICY "Authenticated users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid()::text = reporter_id::text);

-- 3. 관리자는 모든 신고 조회/수정 가능
CREATE POLICY "Admins can manage all reports" ON reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 4. 신고자는 자신의 신고 수정 불가 (상태 변경은 관리자만)
CREATE POLICY "Only admins can update reports" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// RestAreas 테이블 RLS 정책
export const restAreasPolicies = sql`
-- RestAreas 테이블 정책

-- 1. 모든 사용자가 휴게소 조회 가능
CREATE POLICY "Anyone can view rest areas" ON rest_areas
  FOR SELECT USING (true);

-- 2. 관리자만 휴게소 생성/수정/삭제 가능
CREATE POLICY "Only admins can manage rest areas" ON rest_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Notifications 테이블 RLS 정책
export const notificationsPolicies = sql`
-- Notifications 테이블 정책

-- 1. 사용자는 자신의 알림만 조회 가능
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 2. 시스템이 알림 생성 가능 (관리자 권한으로)
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 3. 사용자는 자신의 알림 상태만 수정 가능 (읽음 표시)
CREATE POLICY "Users can update own notification status" ON notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 4. 사용자는 자신의 알림만 삭제 가능
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid()::text = user_id::text);
`;

// AdminActionLogs 테이블 RLS 정책
export const adminActionLogsPolicies = sql`
-- AdminActionLogs 테이블 정책

-- 1. 관리자만 로그 조회 가능
CREATE POLICY "Only admins can view action logs" ON admin_action_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 2. 관리자만 로그 생성 가능
CREATE POLICY "Only admins can create action logs" ON admin_action_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 3. 관리자만 로그 수정 가능
CREATE POLICY "Only admins can update action logs" ON admin_action_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 4. 관리자만 로그 삭제 가능
CREATE POLICY "Only admins can delete action logs" ON admin_action_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Media 테이블 RLS 정책
export const mediaPolicies = sql`
-- Media 테이블 정책

-- 1. 모든 사용자가 미디어 조회 가능
CREATE POLICY "Anyone can view media" ON media
  FOR SELECT USING (true);

-- 2. 인증된 사용자만 미디어 업로드 가능
CREATE POLICY "Authenticated users can upload media" ON media
  FOR INSERT WITH CHECK (auth.uid()::text = owner_id::text);

-- 3. 소유자만 미디어 수정 가능
CREATE POLICY "Owners can update own media" ON media
  FOR UPDATE USING (auth.uid()::text = owner_id::text);

-- 4. 소유자와 관리자만 미디어 삭제 가능
CREATE POLICY "Owners and admins can delete media" ON media
  FOR DELETE USING (
    auth.uid()::text = owner_id::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// BanHistory 테이블 RLS 정책
export const banHistoryPolicies = sql`
-- BanHistory 테이블 정책

-- 1. 사용자는 자신의 차단 기록만 조회 가능
CREATE POLICY "Users can view own ban history" ON ban_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 2. 관리자만 차단 기록 생성 가능
CREATE POLICY "Only admins can create ban history" ON ban_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 3. 관리자만 차단 기록 수정 가능
CREATE POLICY "Only admins can update ban history" ON ban_history
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 4. 관리자만 차단 기록 삭제 가능
CREATE POLICY "Only admins can delete ban history" ON ban_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Bookmarks 테이블 RLS 정책
export const bookmarksPolicies = sql`
-- Bookmarks 테이블 정책

-- 1. 사용자는 자신의 북마크만 조회 가능
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 2. 인증된 사용자만 북마크 생성 가능
CREATE POLICY "Authenticated users can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 3. 사용자만 자신의 북마크 삭제 가능
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid()::text = user_id::text);
`;

// Points 테이블 RLS 정책
export const pointsPolicies = sql`
-- Points 테이블 정책

-- 1. 사용자는 자신의 포인트 기록만 조회 가능
CREATE POLICY "Users can view own points" ON points
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 2. 시스템이 포인트 생성 가능 (관리자 권한으로)
CREATE POLICY "System can create points" ON points
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 3. 관리자만 포인트 수정 가능
CREATE POLICY "Only admins can update points" ON points
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 4. 관리자만 포인트 삭제 가능
CREATE POLICY "Only admins can delete points" ON points
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// Missions 테이블 RLS 정책
export const missionsPolicies = sql`
-- Missions 테이블 정책

-- 1. 모든 사용자가 미션 조회 가능
CREATE POLICY "Anyone can view missions" ON missions
  FOR SELECT USING (true);

-- 2. 관리자만 미션 생성/수정/삭제 가능
CREATE POLICY "Only admins can manage missions" ON missions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// UserMissions 테이블 RLS 정책
export const userMissionsPolicies = sql`
-- UserMissions 테이블 정책

-- 1. 사용자는 자신의 미션 진행 상황만 조회 가능
CREATE POLICY "Users can view own user missions" ON user_missions
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- 2. 인증된 사용자만 미션 참여 가능
CREATE POLICY "Authenticated users can join missions" ON user_missions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 3. 사용자는 자신의 미션 진행 상황만 수정 가능
CREATE POLICY "Users can update own user missions" ON user_missions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 4. 사용자는 자신의 미션 진행 상황만 삭제 가능
CREATE POLICY "Users can delete own user missions" ON user_missions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- 5. 관리자는 모든 사용자 미션 조회 가능
CREATE POLICY "Admins can view all user missions" ON user_missions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );
`;

// 모든 정책을 한 번에 적용하는 함수
export const applyAllRLSPolicies = sql`
${enableRLS}

${usersPolicies}
${postsPolicies}
${commentsPolicies}
${likesPolicies}
${reportsPolicies}
${restAreasPolicies}
${notificationsPolicies}
${adminActionLogsPolicies}
${mediaPolicies}
${banHistoryPolicies}
${bookmarksPolicies}
${pointsPolicies}
${missionsPolicies}
${userMissionsPolicies}
`;

// 특정 테이블의 정책만 적용하는 함수들
export const applyUsersPolicies = sql`${enableRLS} ${usersPolicies}`;
export const applyPostsPolicies = sql`${enableRLS} ${postsPolicies}`;
export const applyCommentsPolicies = sql`${enableRLS} ${commentsPolicies}`;
export const applyLikesPolicies = sql`${enableRLS} ${likesPolicies}`;
export const applyReportsPolicies = sql`${enableRLS} ${reportsPolicies}`;
export const applyRestAreasPolicies = sql`${enableRLS} ${restAreasPolicies}`;
export const applyNotificationsPolicies = sql`${enableRLS} ${notificationsPolicies}`;
export const applyAdminActionLogsPolicies = sql`${enableRLS} ${adminActionLogsPolicies}`;
export const applyMediaPolicies = sql`${enableRLS} ${mediaPolicies}`;
export const applyBanHistoryPolicies = sql`${enableRLS} ${banHistoryPolicies}`;
export const applyBookmarksPolicies = sql`${enableRLS} ${bookmarksPolicies}`;
export const applyPointsPolicies = sql`${enableRLS} ${pointsPolicies}`;
export const applyMissionsPolicies = sql`${enableRLS} ${missionsPolicies}`;
export const applyUserMissionsPolicies = sql`${enableRLS} ${userMissionsPolicies}`; 