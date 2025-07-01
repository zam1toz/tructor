import { eq, and, desc, asc, count, sql } from 'drizzle-orm';
import { db } from './index';
import { 
  users, posts, comments, likes, reports, restAreas, 
  notifications, adminActionLogs, media, banHistory 
} from './schema';
import type { 
  NewUser, NewPost, NewComment, NewLike, NewReport, 
  NewRestArea, NewNotification, NewAdminActionLog, NewMedia, NewBanHistory 
} from './schema';

// ===== User Queries =====
export async function createUser(userData: NewUser) {
  return await db.insert(users).values(userData).returning();
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id)).limit(1);
}

export async function getUserByNickname(nickname: string) {
  return await db.select().from(users).where(eq(users.nickname, nickname)).limit(1);
}

export async function updateUser(id: string, userData: Partial<NewUser>) {
  return await db.update(users).set(userData).where(eq(users.id, id)).returning();
}

export async function updateUserLastLogin(id: string) {
  return await db.update(users).set({ lastLogin: new Date() }).where(eq(users.id, id)).returning();
}

// ===== Post Queries =====
export async function createPost(postData: NewPost) {
  return await db.insert(posts).values(postData).returning();
}

export async function getPosts(limit = 20, offset = 0) {
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    category: posts.category,
    likeCount: posts.likeCount,
    commentCount: posts.commentCount,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    author: {
      id: users.id,
      nickname: users.nickname,
      region: users.region,
    },
    restArea: {
      id: restAreas.id,
      name: restAreas.name,
      type: restAreas.type,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .leftJoin(restAreas, eq(posts.restAreaId, restAreas.id))
  .orderBy(desc(posts.createdAt))
  .limit(limit)
  .offset(offset);
}

export async function getPostById(id: string) {
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    category: posts.category,
    likeCount: posts.likeCount,
    commentCount: posts.commentCount,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    author: {
      id: users.id,
      nickname: users.nickname,
      region: users.region,
    },
    restArea: {
      id: restAreas.id,
      name: restAreas.name,
      type: restAreas.type,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .leftJoin(restAreas, eq(posts.restAreaId, restAreas.id))
  .where(eq(posts.id, id))
  .limit(1);
}

export async function getPostsByAuthor(authorId: string, limit = 20, offset = 0) {
  return await db.select().from(posts).where(eq(posts.authorId, authorId)).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
}

export async function getPostsByCategory(category: string, limit = 20, offset = 0) {
  return await db.select().from(posts).where(eq(posts.category, category)).orderBy(desc(posts.createdAt)).limit(limit).offset(offset);
}

export async function updatePost(id: string, postData: Partial<NewPost>) {
  return await db.update(posts).set({ ...postData, updatedAt: new Date() }).where(eq(posts.id, id)).returning();
}

export async function deletePost(id: string) {
  return await db.delete(posts).where(eq(posts.id, id)).returning();
}

export async function searchPosts(query: string, limit = 20, offset = 0) {
  const searchTerm = `%${query}%`;
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    category: posts.category,
    likeCount: posts.likeCount,
    commentCount: posts.commentCount,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    author: {
      id: users.id,
      nickname: users.nickname,
      region: users.region,
    },
    restArea: {
      id: restAreas.id,
      name: restAreas.name,
      type: restAreas.type,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .leftJoin(restAreas, eq(posts.restAreaId, restAreas.id))
  .where(
    sql`${posts.title} ILIKE ${searchTerm} OR ${posts.content} ILIKE ${searchTerm}`
  )
  .orderBy(desc(posts.createdAt))
  .limit(limit)
  .offset(offset);
}

// ===== Comment Queries =====
export async function createComment(commentData: NewComment) {
  return await db.insert(comments).values(commentData).returning();
}

export async function getCommentsByPost(postId: string, limit = 50, offset = 0) {
  return await db.select({
    id: comments.id,
    content: comments.content,
    likeCount: comments.likeCount,
    createdAt: comments.createdAt,
    author: {
      id: users.id,
      nickname: users.nickname,
      region: users.region,
    }
  })
  .from(comments)
  .leftJoin(users, eq(comments.authorId, users.id))
  .where(eq(comments.postId, postId))
  .orderBy(asc(comments.createdAt))
  .limit(limit)
  .offset(offset);
}

export async function getCommentById(id: string) {
  return await db.select().from(comments).where(eq(comments.id, id)).limit(1);
}

export async function updateComment(id: string, commentData: Partial<NewComment>) {
  return await db.update(comments).set(commentData).where(eq(comments.id, id)).returning();
}

export async function deleteComment(id: string) {
  return await db.delete(comments).where(eq(comments.id, id)).returning();
}

// ===== Like Queries =====
export async function createLike(likeData: NewLike) {
  return await db.insert(likes).values(likeData).returning();
}

export async function deleteLike(userId: string, targetType: 'post' | 'comment', targetId: string) {
  return await db.delete(likes).where(
    and(
      eq(likes.userId, userId),
      eq(likes.targetType, targetType),
      eq(likes.targetId, targetId)
    )
  ).returning();
}

export async function getLikesByTarget(targetType: 'post' | 'comment', targetId: string) {
  return await db.select().from(likes).where(
    and(
      eq(likes.targetType, targetType),
      eq(likes.targetId, targetId)
    )
  );
}

export async function checkUserLiked(userId: string, targetType: 'post' | 'comment', targetId: string) {
  const result = await db.select().from(likes).where(
    and(
      eq(likes.userId, userId),
      eq(likes.targetType, targetType),
      eq(likes.targetId, targetId)
    )
  ).limit(1);
  return result.length > 0;
}

// ===== Report Queries =====
export async function createReport(reportData: NewReport) {
  return await db.insert(reports).values(reportData).returning();
}

export async function getReports(status?: 'pending' | 'reviewed' | 'dismissed', limit = 50, offset = 0) {
  const query = status 
    ? db.select().from(reports).where(eq(reports.status, status)).orderBy(desc(reports.createdAt))
    : db.select().from(reports).orderBy(desc(reports.createdAt));
  return await query.limit(limit).offset(offset);
}

export async function updateReportStatus(id: string, status: 'pending' | 'reviewed' | 'dismissed', handledBy: string) {
  return await db.update(reports).set({ 
    status, 
    handledBy, 
    handledAt: new Date() 
  }).where(eq(reports.id, id)).returning();
}

// ===== RestArea Queries =====
export async function createRestArea(restAreaData: NewRestArea) {
  return await db.insert(restAreas).values(restAreaData).returning();
}

export async function getRestAreas(type?: '쉼터' | '정비소', limit = 100, offset = 0) {
  const query = type 
    ? db.select().from(restAreas).where(eq(restAreas.type, type)).orderBy(desc(restAreas.averageRating))
    : db.select().from(restAreas).orderBy(desc(restAreas.averageRating));
  return await query.limit(limit).offset(offset);
}

export async function getRestAreaById(id: string) {
  return await db.select().from(restAreas).where(eq(restAreas.id, id)).limit(1);
}

export async function updateRestArea(id: string, restAreaData: Partial<NewRestArea>) {
  return await db.update(restAreas).set(restAreaData).where(eq(restAreas.id, id)).returning();
}

export async function getRestAreasNearby(latitude: number, longitude: number, radiusKm: number = 10, limit = 50) {
  // Haversine 공식을 사용한 거리 계산 (대략적인 계산)
  const earthRadius = 6371; // 지구 반지름 (km)
  const latDiff = radiusKm / earthRadius * (180 / Math.PI);
  const lonDiff = radiusKm / earthRadius * (180 / Math.PI) / Math.cos(latitude * Math.PI / 180);
  
  return await db.select().from(restAreas).where(
    and(
      sql`${restAreas.latitude} BETWEEN ${latitude - latDiff} AND ${latitude + latDiff}`,
      sql`${restAreas.longitude} BETWEEN ${longitude - lonDiff} AND ${longitude + lonDiff}`
    )
  ).limit(limit);
}

// ===== Notification Queries =====
export async function createNotification(notificationData: NewNotification) {
  return await db.insert(notifications).values(notificationData).returning();
}

export async function getNotificationsByUser(userId: string, limit = 50, offset = 0) {
  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit).offset(offset);
}

export async function markNotificationAsRead(id: string) {
  return await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
}

export async function getUnreadNotificationCount(userId: string) {
  const result = await db.select({ count: count() }).from(notifications).where(
    and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, false)
    )
  );
  return result[0]?.count || 0;
}

// ===== AdminActionLog Queries =====
export async function createAdminActionLog(logData: NewAdminActionLog) {
  return await db.insert(adminActionLogs).values(logData).returning();
}

export async function getAdminActionLogs(adminId?: string, limit = 100, offset = 0) {
  const query = adminId 
    ? db.select().from(adminActionLogs).where(eq(adminActionLogs.adminId, adminId)).orderBy(desc(adminActionLogs.createdAt))
    : db.select().from(adminActionLogs).orderBy(desc(adminActionLogs.createdAt));
  return await query.limit(limit).offset(offset);
}

// ===== Media Queries =====
export async function createMedia(mediaData: NewMedia) {
  return await db.insert(media).values(mediaData).returning();
}

export async function getMediaByTarget(linkedToType: 'post' | 'comment', linkedToId: string) {
  return await db.select().from(media).where(
    and(
      eq(media.linkedToType, linkedToType),
      eq(media.linkedToId, linkedToId)
    )
  );
}

export async function deleteMedia(id: string) {
  return await db.delete(media).where(eq(media.id, id)).returning();
}

// ===== BanHistory Queries =====
export async function createBanHistory(banData: NewBanHistory) {
  return await db.insert(banHistory).values(banData).returning();
}

export async function getBanHistoryByUser(userId: string) {
  return await db.select().from(banHistory).where(eq(banHistory.userId, userId)).orderBy(desc(banHistory.startAt));
}

export async function getActiveBanHistory(userId: string) {
  const now = new Date();
  return await db.select().from(banHistory).where(
    and(
      eq(banHistory.userId, userId),
      sql`${banHistory.startAt} <= ${now}`,
      sql`${banHistory.endAt} >= ${now}`
    )
  ).limit(1);
}

// ===== Utility Queries =====
export async function updatePostCounts(postId: string) {
  // 좋아요 수 업데이트
  const likeCount = await db.select({ count: count() }).from(likes).where(
    and(
      eq(likes.targetType, 'post'),
      eq(likes.targetId, postId)
    )
  );
  
  // 댓글 수 업데이트
  const commentCount = await db.select({ count: count() }).from(comments).where(eq(comments.postId, postId));
  
  // 포스트 업데이트
  await db.update(posts).set({
    likeCount: likeCount[0]?.count || 0,
    commentCount: commentCount[0]?.count || 0
  }).where(eq(posts.id, postId));
}

export async function updateCommentLikeCount(commentId: string) {
  const likeCount = await db.select({ count: count() }).from(likes).where(
    and(
      eq(likes.targetType, 'comment'),
      eq(likes.targetId, commentId)
    )
  );
  
  await db.update(comments).set({
    likeCount: likeCount[0]?.count || 0
  }).where(eq(comments.id, commentId));
}

// ===== Statistics Queries =====
export async function getSystemStats() {
  const [userCount, postCount, commentCount, reportCount] = await Promise.all([
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(posts),
    db.select({ count: count() }).from(comments),
    db.select({ count: count() }).from(reports).where(eq(reports.status, 'pending'))
  ]);

  return {
    totalUsers: userCount[0]?.count || 0,
    totalPosts: postCount[0]?.count || 0,
    totalComments: commentCount[0]?.count || 0,
    pendingReports: reportCount[0]?.count || 0,
  };
}

export async function getUserStats(userId: string) {
  const [postCount, commentCount, likeCount, reportCount] = await Promise.all([
    db.select({ count: count() }).from(posts).where(eq(posts.authorId, userId)),
    db.select({ count: count() }).from(comments).where(eq(comments.authorId, userId)),
    db.select({ count: count() }).from(likes).where(eq(likes.userId, userId)),
    db.select({ count: count() }).from(reports).where(eq(reports.reporterId, userId))
  ]);

  return {
    posts: postCount[0]?.count || 0,
    comments: commentCount[0]?.count || 0,
    likes: likeCount[0]?.count || 0,
    reports: reportCount[0]?.count || 0,
  };
} 