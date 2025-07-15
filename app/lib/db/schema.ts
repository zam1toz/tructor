import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer, 
  decimal,
  uuid,
  pgEnum,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';

// Enums
export const userStatusEnum = pgEnum('user_status', ['active', 'banned']);
export const targetTypeEnum = pgEnum('target_type', ['post', 'comment']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'dismissed']);
export const restAreaTypeEnum = pgEnum('rest_area_type', ['쉼터', '정비소']);
export const notificationTypeEnum = pgEnum('notification_type', ['comment', 'mention', 'announcement']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);
export const linkedToTypeEnum = pgEnum('linked_to_type', ['post', 'comment']);

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  phone: text('phone').notNull(),
  password: text('password').notNull(),
  nickname: text('nickname').notNull(),
  region: text('region').notNull(),
  is_admin: boolean('is_admin').notNull().default(false),
  status: userStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastLogin: timestamp('last_login'),
}, (table) => ({
  phoneIdx: uniqueIndex('users_phone_idx').on(table.phone),
  nicknameIdx: uniqueIndex('users_nickname_idx').on(table.nickname),
  statusIdx: index('users_status_idx').on(table.status),
}));

// Posts table
export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  restAreaId: uuid('rest_area_id').references(() => restAreas.id),
  rating: integer('rating'), // 휴게소 평점 (1-5)
  likeCount: integer('like_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  authorIdx: index('posts_author_idx').on(table.authorId),
  categoryIdx: index('posts_category_idx').on(table.category),
  restAreaIdx: index('posts_rest_area_idx').on(table.restAreaId),
  ratingIdx: index('posts_rating_idx').on(table.rating),
  createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
}));

// Comments table
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  likeCount: integer('like_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  postIdx: index('comments_post_idx').on(table.postId),
  authorIdx: index('comments_author_idx').on(table.authorId),
  createdAtIdx: index('comments_created_at_idx').on(table.createdAt),
}));

// Likes table
export const likes = pgTable('likes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: targetTypeEnum('target_type').notNull(),
  targetId: uuid('target_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userTargetIdx: uniqueIndex('likes_user_target_idx').on(table.userId, table.targetType, table.targetId),
  targetIdx: index('likes_target_idx').on(table.targetType, table.targetId),
}));

// Reports table
export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  reporterId: uuid('reporter_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetType: targetTypeEnum('target_type').notNull(),
  targetId: uuid('target_id').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: reportStatusEnum('status').notNull().default('pending'),
  handledBy: uuid('handled_by').references(() => users.id),
  handledAt: timestamp('handled_at'),
}, (table) => ({
  reporterTargetIdx: uniqueIndex('reports_reporter_target_idx').on(table.reporterId, table.targetType, table.targetId),
  targetIdx: index('reports_target_idx').on(table.targetType, table.targetId),
  statusIdx: index('reports_status_idx').on(table.status),
  handledByIdx: index('reports_handled_by_idx').on(table.handledBy),
}));

// RestAreas table
export const restAreas = pgTable('rest_areas', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  type: restAreaTypeEnum('type').notNull(),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).notNull().default('0.00'),
  reviewCount: integer('review_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  locationIdx: index('rest_areas_location_idx').on(table.latitude, table.longitude),
  typeIdx: index('rest_areas_type_idx').on(table.type),
  ratingIdx: index('rest_areas_rating_idx').on(table.averageRating),
}));

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  content: text('content').notNull(),
  relatedPostId: uuid('related_post_id').references(() => posts.id, { onDelete: 'cascade' }),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}));

// AdminActionLogs table
export const adminActionLogs = pgTable('admin_action_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  adminId: uuid('admin_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: uuid('target_id').notNull(),
  memo: text('memo'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  adminIdx: index('admin_action_logs_admin_idx').on(table.adminId),
  targetIdx: index('admin_action_logs_target_idx').on(table.targetType, table.targetId),
  createdAtIdx: index('admin_action_logs_created_at_idx').on(table.createdAt),
}));

// Media table
export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: text('url').notNull(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: mediaTypeEnum('type').notNull(),
  linkedToType: linkedToTypeEnum('linked_to_type').notNull(),
  linkedToId: uuid('linked_to_id').notNull(),
}, (table) => ({
  ownerIdx: index('media_owner_idx').on(table.ownerId),
  linkedToIdx: index('media_linked_to_idx').on(table.linkedToType, table.linkedToId),
}));

// BanHistory table
export const banHistory = pgTable('ban_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reason: text('reason').notNull(),
  startAt: timestamp('start_at').notNull(),
  endAt: timestamp('end_at').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
}, (table) => ({
  userIdx: index('ban_history_user_idx').on(table.userId),
  createdByIdx: index('ban_history_created_by_idx').on(table.createdBy),
  dateRangeIdx: index('ban_history_date_range_idx').on(table.startAt, table.endAt),
}));

// Bookmarks table
export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userPostIdx: uniqueIndex('bookmarks_user_post_idx').on(table.userId, table.postId),
  userIdx: index('bookmarks_user_idx').on(table.userId),
  postIdx: index('bookmarks_post_idx').on(table.postId),
}));

// Points table
export const points = pgTable('points', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('points_user_idx').on(table.userId),
  createdAtIdx: index('points_created_at_idx').on(table.createdAt),
}));

// Missions table
export const missions = pgTable('missions', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  points: integer('points').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('missions_category_idx').on(table.category),
  isActiveIdx: index('missions_is_active_idx').on(table.isActive),
}));

// UserMissions table
export const userMissions = pgTable('user_missions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  missionId: uuid('mission_id').notNull().references(() => missions.id, { onDelete: 'cascade' }),
  progress: integer('progress').notNull().default(0),
  maxProgress: integer('max_progress').notNull().default(1),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userMissionIdx: uniqueIndex('user_missions_user_mission_idx').on(table.userId, table.missionId),
  userIdx: index('user_missions_user_idx').on(table.userId),
  missionIdx: index('user_missions_mission_idx').on(table.missionId),
  isCompletedIdx: index('user_missions_is_completed_idx').on(table.isCompleted),
}));

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type RestArea = typeof restAreas.$inferSelect;
export type NewRestArea = typeof restAreas.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type AdminActionLog = typeof adminActionLogs.$inferSelect;
export type NewAdminActionLog = typeof adminActionLogs.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type BanHistory = typeof banHistory.$inferSelect;
export type NewBanHistory = typeof banHistory.$inferInsert;
export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
export type Point = typeof points.$inferSelect;
export type NewPoint = typeof points.$inferInsert;
export type Mission = typeof missions.$inferSelect;
export type NewMission = typeof missions.$inferInsert;
export type UserMission = typeof userMissions.$inferSelect;
export type NewUserMission = typeof userMissions.$inferInsert; 