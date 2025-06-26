import { Link } from "react-router";

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">지도 탐색</h1>
        <p className="text-gray-600 mb-4">
          쉼터, 정비소, 단속 위치를 지도에서 확인하세요
        </p>
        <Link 
          to="/map/report" 
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          위치 제보하기
        </Link>
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
            <h3 className="font-semibold mb-3">근처 위치</h3>
            <div className="space-y-2">
              <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                <div className="font-medium">휴게소 A</div>
                <div className="text-sm text-gray-600">거리: 2.3km</div>
              </div>
              <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                <div className="font-medium">정비소 B</div>
                <div className="text-sm text-gray-600">거리: 5.1km</div>
              </div>
              <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                <div className="font-medium">단속 구간 C</div>
                <div className="text-sm text-gray-600">거리: 8.7km</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 