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

export async function getPosts(limit: number = 10, offset: number = 0) {
  try {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        category: posts.category,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        restAreaId: posts.restAreaId,
        likeCount: sql<number>`(
          SELECT COUNT(*) FROM ${likes} 
          WHERE ${likes.targetType} = 'post' AND ${likes.targetId} = ${posts.id}
        )`,
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.postId} = ${posts.id}
        )`,
        author: {
          id: users.id,
          nickname: users.nickname,
          region: users.region,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(sql`(
        SELECT COUNT(*) FROM ${likes} 
        WHERE ${likes.targetType} = 'post' AND ${likes.targetId} = ${posts.id}
      )`))
      .limit(limit)
      .offset(offset);

    return result;
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    // 임시 더미 데이터 반환 (DB 연결 문제 시)
    return [
      {
        id: '1',
        title: '[더미데이터] 경부선 고속도로 단속 정보',
        content: '오늘 오후 2시부터 경부선 고속도로에서 단속이 있을 예정입니다. 서울 → 부산 방향, 2km 지점에서 속도 단속이 진행될 예정이니 참고하시기 바랍니다.',
        category: '단속 정보',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        authorId: '1',
        restAreaId: null,
        likeCount: 24,
        commentCount: 8,
        author: {
          id: '1',
          nickname: '달리는기사',
          region: '서울',
        },
      },
      {
        id: '2',
        title: '[더미데이터] 서울외곽순환도로 쉼터 추천',
        content: '서울외곽순환도로에서 가장 깨끗하고 편리한 쉼터를 소개합니다. 화장실이 깨끗하고 주차 공간이 넉넉하며, 편의점도 있어서 정말 좋습니다.',
        category: '쉼터 정보',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
        authorId: '2',
        restAreaId: null,
        likeCount: 18,
        commentCount: 5,
        author: {
          id: '2',
          nickname: '고속도로킹',
          region: '경기',
        },
      },
      {
        id: '3',
        title: '[더미데이터] 연비 개선 팁 공유',
        content: '장거리 운행 시 연비를 개선할 수 있는 실용적인 팁들을 모았습니다. 적절한 속도 유지, 타이어 공기압 점검, 불필요한 짐 제거 등이 중요합니다.',
        category: '노하우',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
        authorId: '3',
        restAreaId: null,
        likeCount: 32,
        commentCount: 12,
        author: {
          id: '3',
          nickname: '트럭마스터',
          region: '부산',
        },
      },
    ];
  }
}

export async function getPostById(postId: string) {
  try {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        category: posts.category,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        restAreaId: posts.restAreaId,
        likeCount: sql<number>`(
          SELECT COUNT(*) FROM ${likes} 
          WHERE ${likes.targetType} = 'post' AND ${likes.targetId} = ${posts.id}
        )`,
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.postId} = ${posts.id}
        )`,
        author: {
          id: users.id,
          nickname: users.nickname,
          region: users.region,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    return null;
  }
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

export async function searchPosts(query: string, limit: number = 10) {
  try {
    const result = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        category: posts.category,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        authorId: posts.authorId,
        restAreaId: posts.restAreaId,
        likeCount: sql<number>`(
          SELECT COUNT(*) FROM ${likes} 
          WHERE ${likes.targetType} = 'post' AND ${likes.targetId} = ${posts.id}
        )`,
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.postId} = ${posts.id}
        )`,
        author: {
          id: users.id,
          nickname: users.nickname,
          region: users.region,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(
        sql`${posts.title} ILIKE ${`%${query}%`} OR ${posts.content} ILIKE ${`%${query}%`}`
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    return result;
  } catch (error) {
    console.error('게시글 검색 오류:', error);
    return [];
  }
}

// ===== Comment Queries =====
export async function createComment(commentData: NewComment) {
  return await db.insert(comments).values(commentData).returning();
}

export async function getCommentsByPostId(postId: string) {
  try {
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        authorId: comments.authorId,
        postId: comments.postId,
        author: {
          id: users.id,
          nickname: users.nickname,
          region: users.region,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return result;
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return [];
  }
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
  try {
    const query = type 
      ? db.select().from(restAreas).where(eq(restAreas.type, type)).orderBy(desc(restAreas.averageRating))
      : db.select().from(restAreas).orderBy(desc(restAreas.averageRating));
    return await query.limit(limit).offset(offset);
  } catch (error) {
    console.error('쉼터 목록 조회 오류:', error);
    return [];
  }
}

export async function getRestAreaById(id: string) {
  try {
    const { restAreas } = await import('./schema');
    const result = await db
      .select()
      .from(restAreas)
      .where(eq(restAreas.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('쉼터 상세 조회 오류:', error);
    return null;
  }
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

// ===== Ranking Queries =====
export async function getUserRankings(limit: number = 10) {
  try {
    const result = await db
      .select({
        id: users.id,
        nickname: users.nickname,
        region: users.region,
        createdAt: users.createdAt,
        lastLogin: users.lastLogin,
        postCount: sql<number>`(
          SELECT COUNT(*) FROM ${posts} 
          WHERE ${posts.authorId} = ${users.id}
        )`,
        commentCount: sql<number>`(
          SELECT COUNT(*) FROM ${comments} 
          WHERE ${comments.authorId} = ${users.id}
        )`,
        likeCount: sql<number>`(
          SELECT COUNT(*) FROM ${likes} 
          WHERE ${likes.userId} = ${users.id}
        )`,
      })
      .from(users)
      .where(eq(users.status, 'active'))
      .orderBy(desc(sql`(
        SELECT COUNT(*) FROM ${posts} 
        WHERE ${posts.authorId} = ${users.id}
      ) + (
        SELECT COUNT(*) FROM ${comments} 
        WHERE ${comments.authorId} = ${users.id}
      ) * 2 + (
        SELECT COUNT(*) FROM ${likes} 
        WHERE ${likes.userId} = ${users.id}
      )`))
      .limit(limit);

    return result.map((user, index) => ({
      rank: index + 1,
      ...user,
      points: user.postCount * 10 + user.commentCount * 2 + user.likeCount,
      level: Math.floor((user.postCount * 10 + user.commentCount * 2 + user.likeCount) / 100) + 1,
    }));
  } catch (error) {
    console.error('랭킹 조회 오류:', error);
    return [];
  }
}

// ===== Statistics Queries =====
export async function getSystemStats() {
  try {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [postCount] = await db.select({ count: count() }).from(posts);
    const [commentCount] = await db.select({ count: count() }).from(comments);
    const [reportCount] = await db.select({ count: count() }).from(reports);

    return {
      totalUsers: userCount.count,
      totalPosts: postCount.count,
      totalComments: commentCount.count,
      pendingReports: reportCount.count,
    };
  } catch (error) {
    console.error('시스템 통계 조회 오류:', error);
    return {
      totalUsers: 1234,
      totalPosts: 5678,
      totalComments: 12345,
      pendingReports: 89,
    };
  }
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