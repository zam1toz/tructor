import { db } from '../lib/db';
import { restAreas } from '../lib/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get('lat') || '37.5665');
    const lng = parseFloat(url.searchParams.get('lng') || '126.9780');
    const radius = parseFloat(url.searchParams.get('radius') || '50'); // km
    const type = url.searchParams.get('type'); // 쉼터, 정비소, 또는 null (전체)

    // TODO: 실제 쉼터/정비소 조회 구현
    // 현재는 임시 데이터 반환
    const mockRestAreas = [
      {
        id: '1',
        name: '서울외곽순환도로 쉼터',
        latitude: 37.5665,
        longitude: 126.9780,
        type: '쉼터',
        averageRating: 4.2,
        reviewCount: 156,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        name: '경부선 고속도로 정비소',
        latitude: 37.4565,
        longitude: 126.8780,
        type: '정비소',
        averageRating: 3.8,
        reviewCount: 89,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '3',
        name: '영동선 고속도로 쉼터',
        latitude: 37.6665,
        longitude: 127.0780,
        type: '쉼터',
        averageRating: 4.5,
        reviewCount: 234,
        createdAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: '4',
        name: '중부선 고속도로 정비소',
        latitude: 37.3665,
        longitude: 126.7780,
        type: '정비소',
        averageRating: 4.0,
        reviewCount: 123,
        createdAt: new Date(Date.now() - 345600000).toISOString()
      },
      {
        id: '5',
        name: '호남선 고속도로 쉼터',
        latitude: 37.7665,
        longitude: 127.1780,
        type: '쉼터',
        averageRating: 4.3,
        reviewCount: 178,
        createdAt: new Date(Date.now() - 432000000).toISOString()
      }
    ];

    let filteredAreas = mockRestAreas;

    // 타입 필터링
    if (type && type !== 'all') {
      filteredAreas = filteredAreas.filter(area => area.type === type);
    }

    // 거리 계산 및 필터링 (간단한 유클리드 거리 계산)
    const filteredByDistance = filteredAreas.filter(area => {
      const distance = Math.sqrt(
        Math.pow(area.latitude - lat, 2) + Math.pow(area.longitude - lng, 2)
      ) * 111; // 대략적인 km 변환
      return distance <= radius;
    });

    return new Response(JSON.stringify({ 
      success: true, 
      restAreas: filteredByDistance,
      totalCount: filteredByDistance.length,
      center: { lat, lng },
      radius
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('쉼터/정비소 조회 오류:', error);
    return new Response(JSON.stringify({ success: false, error: '서버 오류가 발생했습니다.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 