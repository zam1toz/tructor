import { Link, useLoaderData } from "react-router";
import { getRestAreas } from "~/lib/db/queries";
import Navbar from "../components/Navbar";

export async function loader() {
  try {
    const restAreas = await getRestAreas();
    return { restAreas };
  } catch (error) {
    console.error('지도 데이터 로딩 오류:', error);
    return { restAreas: [] };
  }
}

export default function MapPage() {
  const { restAreas } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* 네비게이션 바 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              홈으로
            </Link>
            <div className="text-gray-400">|</div>
            <span className="text-sm text-gray-600">지도 탐색</span>
          </div>
          
          <Link 
            to="/map/report" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            위치 제보하기
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">지도 탐색</h1>
          <p className="text-gray-600 mb-4">
            쉼터, 정비소, 단속 위치를 지도에서 확인하세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 지도 영역 */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg p-4 h-96 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <p className="text-gray-600">지도가 여기에 표시됩니다</p>
                <p className="text-sm text-gray-500">Google Maps 또는 Kakao Maps API 연동</p>
              </div>
            </div>
          </div>
          
          {/* 필터 및 목록 */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">필터</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  쉼터
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  정비소
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  단속 위치
                </label>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">등록된 위치 ({restAreas.length})</h3>
              <div className="space-y-2">
                {restAreas.length === 0 ? (
                  <p className="text-gray-500 text-sm">등록된 위치가 없습니다.</p>
                ) : (
                  restAreas.map((restArea) => (
                    <Link 
                      key={restArea.id} 
                      to={`/location/${restArea.id}`}
                      className="block p-2 border rounded cursor-pointer hover:bg-gray-50"
                    >
                      <div className="font-medium">{restArea.name}</div>
                      <div className="text-sm text-gray-600">
                        {restArea.type} • 평점: {restArea.averageRating}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 