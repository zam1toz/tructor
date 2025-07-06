import { db } from '../app/lib/db';
import { users, posts, restAreas } from '../app/lib/db/schema';

async function seed() {
  console.log('🌱 데이터베이스 시드 시작...');

  try {
    // 관리자 사용자 생성
    const adminUser = await db.insert(users).values({
      nickname: 'admin',
      region: '서울',
      isAdmin: true,
      status: 'active',
    }).returning();

    console.log('✅ 관리자 사용자 생성 완료:', adminUser[0].id);

    // 테스트 사용자 생성
    const testUsers = await db.insert(users).values([
      {
        nickname: '트럭기사1',
        region: '경기',
        isAdmin: false,
        status: 'active',
      },
      {
        nickname: '고속도로킹',
        region: '부산',
        isAdmin: false,
        status: 'active',
      },
      {
        nickname: '달리는기사',
        region: '대구',
        isAdmin: false,
        status: 'active',
      },
    ]).returning();

    console.log('✅ 테스트 사용자 생성 완료:', testUsers.length + '명');

    // 쉼터 데이터 생성
    const restAreasData = await db.insert(restAreas).values([
      {
        name: '경부선 고속도로 쉼터',
        latitude: '37.5665',
        longitude: '126.9780',
        type: '쉼터',
        averageRating: '4.20',
        reviewCount: 15,
      },
      {
        name: '서울외곽순환도로 정비소',
        latitude: '37.5665',
        longitude: '126.9780',
        type: '정비소',
        averageRating: '4.50',
        reviewCount: 8,
      },
      {
        name: '경부선 고속도로 정비소',
        latitude: '35.1796',
        longitude: '129.0756',
        type: '정비소',
        averageRating: '4.00',
        reviewCount: 12,
      },
    ]).returning();

    console.log('✅ 쉼터 데이터 생성 완료:', restAreasData.length + '개');

    // 테스트 게시글 생성
    const testPosts = await db.insert(posts).values([
      {
        authorId: testUsers[0].id,
        category: '단속 정보',
        title: '경부선 고속도로 단속 정보',
        content: '오늘 오후 2시부터 경부선 고속도로에서 단속이 있을 예정입니다. 주의하세요!',
        restAreaId: restAreasData[0].id,
        likeCount: 24,
        commentCount: 8,
      },
      {
        authorId: testUsers[1].id,
        category: '쉼터 정보',
        title: '서울외곽순환도로 쉼터 추천',
        content: '서울외곽순환도로에서 가장 깨끗하고 편리한 쉼터를 소개합니다. 화장실도 깨끗하고 주차장도 넓어요!',
        restAreaId: restAreasData[1].id,
        likeCount: 18,
        commentCount: 5,
      },
      {
        authorId: testUsers[2].id,
        category: '노하우',
        title: '장거리 운전 피로도 줄이는 팁',
        content: '10년간 장거리 운전하면서 터득한 피로도 줄이는 방법들을 공유합니다. 2시간마다 휴식 취하기, 충분한 수분 섭취 등이 중요해요.',
        likeCount: 32,
        commentCount: 12,
      },
    ]).returning();

    console.log('✅ 테스트 게시글 생성 완료:', testPosts.length + '개');

    console.log('🎉 모든 시드 데이터 생성 완료!');

  } catch (error) {
    console.error('❌ 시드 데이터 생성 실패:', error);
    throw error;
  }
}

// ES 모듈에서 직접 실행 확인
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.log('✅ 시드 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 시드 실패:', error);
      process.exit(1);
    });
} 