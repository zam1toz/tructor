import { useParams, Link, useLoaderData } from "react-router";
import { getRestAreaById } from "~/lib/db/queries";

export async function loader({ params }: { params: { id: string } }) {
  try {
    const restArea = await getRestAreaById(params.id);
    if (!restArea) {
      throw new Response("쉼터를 찾을 수 없습니다.", { status: 404 });
    }
    
    return { restArea };
  } catch (error) {
    console.error('쉼터 상세 로딩 오류:', error);
    throw new Response("쉼터 정보를 불러올 수 없습니다.", { status: 500 });
  }
}

export default function LocationDetailPage() {
  const { id } = useParams();
  const { restArea } = useLoaderData<typeof loader>();

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
            <h1 className="text-3xl font-bold mb-2">{restArea.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                restArea.type === '쉼터' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                {restArea.type}
              </span>
              <span>등록일: {new Date(restArea.createdAt).toLocaleDateString()}</span>
              <span>평점: {restArea.averageRating} ({restArea.reviewCount}개 리뷰)</span>
            </div>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">위치 상세 정보</h2>
              <div className="space-y-3">
                <div>
                  <label className="font-medium text-gray-700">위치:</label>
                  <p className="text-gray-900">위도: {restArea.latitude}, 경도: {restArea.longitude}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">유형:</label>
                  <p className="text-gray-900">{restArea.type}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">평균 평점:</label>
                  <p className="text-gray-900">{restArea.averageRating} / 5.00</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">리뷰 수:</label>
                  <p className="text-gray-900">{restArea.reviewCount}개</p>
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