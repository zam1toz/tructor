import { useParams, Link } from "react-router";

export default function LocationDetailPage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/map" className="text-blue-600 hover:underline">
            ← 지도로 돌아가기
          </Link>
        </div>
        
        <div className="border rounded-lg p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-2">위치 정보 (ID: {id})</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>위치명</span>
              <span>등록일: 2024-01-01</span>
              <span>방문자: 45명</span>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">위치 상세 정보</h2>
              <div className="space-y-3">
                <div>
                  <label className="font-medium text-gray-700">주소:</label>
                  <p className="text-gray-900">서울특별시 강남구 테헤란로 123</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">좌표:</label>
                  <p className="text-gray-900">37.5665, 126.9780</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">카테고리:</label>
                  <p className="text-gray-900">관광지</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">설명:</label>
                  <p className="text-gray-900">이곳은 아름다운 관광지입니다. 많은 사람들이 방문하는 인기 있는 장소입니다.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">사진</h2>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-500">위치 사진이 여기에 표시됩니다</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">리뷰</h2>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">사용자1</span>
                  <span className="text-yellow-500">★★★★★</span>
                </div>
                <p className="text-gray-700">정말 멋진 곳이에요! 꼭 방문해보세요.</p>
              </div>
              <div className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">사용자2</span>
                  <span className="text-yellow-500">★★★★☆</span>
                </div>
                <p className="text-gray-700">좋은 경험이었습니다. 추천합니다!</p>
              </div>
            </div>
          </div>
          
          <footer className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  방문 체크
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  북마크
                </button>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  리뷰 작성
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  신고
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
} 