-- Tructor 프로젝트 RLS 정책 적용
-- Supabase Dashboard → SQL Editor에서 실행하세요

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

-- Users 테이블 정책
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "Only admins can delete users" ON users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Posts 테이블 정책
CREATE POLICY "Anyone can view posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "Authors can update own posts" ON posts
  FOR UPDATE USING (auth.uid()::text = author_id::text);

CREATE POLICY "Authors and admins can delete posts" ON posts
  FOR DELETE USING (
    auth.uid()::text = author_id::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Comments 테이블 정책
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid()::text = author_id::text);

CREATE POLICY "Authors can update own comments" ON comments
  FOR UPDATE USING (auth.uid()::text = author_id::text);

CREATE POLICY "Authors and admins can delete comments" ON comments
  FOR DELETE USING (
    auth.uid()::text = author_id::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Likes 테이블 정책
CREATE POLICY "Users can view own likes" ON likes
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can create likes" ON likes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all likes" ON likes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Reports 테이블 정책
CREATE POLICY "Reporters can view own reports" ON reports
  FOR SELECT USING (auth.uid()::text = reporter_id::text);

CREATE POLICY "Authenticated users can create reports" ON reports
  FOR INSERT WITH CHECK (auth.uid()::text = reporter_id::text);

CREATE POLICY "Admins can manage all reports" ON reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update reports" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- RestAreas 테이블 정책
CREATE POLICY "Anyone can view rest areas" ON rest_areas
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage rest areas" ON rest_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Notifications 테이블 정책
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Users can update own notification status" ON notifications
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- AdminActionLogs 테이블 정책
CREATE POLICY "Only admins can view action logs" ON admin_action_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can create action logs" ON admin_action_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update action logs" ON admin_action_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete action logs" ON admin_action_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Media 테이블 정책
CREATE POLICY "Anyone can view media" ON media
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON media
  FOR INSERT WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Owners can update own media" ON media
  FOR UPDATE USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Owners and admins can delete media" ON media
  FOR DELETE USING (
    auth.uid()::text = owner_id::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- BanHistory 테이블 정책
CREATE POLICY "Users can view own ban history" ON ban_history
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Only admins can create ban history" ON ban_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update ban history" ON ban_history
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete ban history" ON ban_history
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Bookmarks 테이블 정책
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can create bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Points 테이블 정책
CREATE POLICY "Users can view own points" ON points
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can create points" ON points
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can update points" ON points
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

CREATE POLICY "Only admins can delete points" ON points
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- Missions 테이블 정책
CREATE POLICY "Anyone can view missions" ON missions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can manage missions" ON missions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- UserMissions 테이블 정책
CREATE POLICY "Users can view own user missions" ON user_missions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can join missions" ON user_missions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own user missions" ON user_missions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own user missions" ON user_missions
  FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all user missions" ON user_missions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND is_admin = true
    )
  );

-- 완료 메시지
SELECT 'RLS 정책이 성공적으로 적용되었습니다!' as message; 