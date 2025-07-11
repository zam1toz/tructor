import { db } from '../lib/db';
import { restAreas } from '../lib/db/schema';
import { verifyToken } from '../lib/auth';

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ success: false, error: '인증 토큰이 필요합니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({ success: false, error: '유효하지 않은 토큰입니다.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { name, latitude, longitude, type, description } = body;

    // 입력 검증
    if (!name || name.trim().length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '쉼터/정비소 이름을 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!latitude || !longitude) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '위치 정보가 필요합니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!type || !['쉼터', '정비소'].includes(type)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '유효한 타입을 선택해주세요. (쉼터 또는 정비소)' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!description || description.trim().length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '신고 사유를 입력해주세요.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (description.length > 500) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: '신고 사유는 500자 이하여야 합니다.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // TODO: 실제 쉼터/정비소 신고 구현
    // 현재는 임시 응답
    const mockReport = {
      id: '1',
      name: name.trim(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      type,
      description: description.trim(),
      reporterId: decoded.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // TODO: 포인트 시스템 구현 시 포인트 지급
    // await addPoints(decoded.id, 10, '지도 신고');

    return new Response(JSON.stringify({ 
      success: true, 
      report: mockReport,
      message: '신고가 성공적으로 접수되었습니다. 검토 후 반영됩니다.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('지도 신고 오류:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: '신고 처리 중 오류가 발생했습니다.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 