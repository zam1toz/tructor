import { Link } from "react-router";

export default function MapReportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/map" className="text-blue-600 hover:underline">
            ← 지도로 돌아가기
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">위치 제보</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-2">
              위치 유형
            </label>
            <select
              id="locationType"
              name="locationType"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">위치 유형을 선택하세요</option>
              <option value="rest">쉼터/휴게소</option>
              <option value="repair">정비소</option>
              <option value="enforcement">단속 위치</option>
              <option value="other">기타</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              위치명
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="위치명을 입력하세요"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              주소
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="주소를 입력하세요"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                위도
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="위도"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                경도
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="경도"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              상세 설명
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="위치에 대한 상세한 설명을 입력하세요"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              제보하기
            </button>
            <Link
              to="/map"
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 