import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function MapReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    latitude: searchParams.get('lat') || '',
    longitude: searchParams.get('lng') || '',
    name: '',
    type: '쉼터',
    description: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    '잘못된 위치 정보',
    '폐쇄된 쉼터',
    '부적절한 정보',
    '중복 등록',
    '기타'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.reason) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/rest-areas/report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('신고가 접수되었습니다. 검토 후 처리하겠습니다.');
        navigate('/map');
      } else {
        const errorData = await response.json();
        alert(errorData.error || '신고 접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 접수 오류:', error);
      alert('신고 접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getAuthToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
            <Link 
              to="/map" 
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
              </svg>
              지도로
            </Link>
            <div className="text-gray-400">|</div>
            <span className="text-sm text-gray-600">위치 제보</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">쉼터 정보 신고</h1>
          <Button onClick={() => navigate('/map')} variant="outline">
            뒤로가기
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 위치 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                  위도
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="위도"
                  required
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
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="경도"
                  required
                />
              </div>
            </div>

            {/* 쉼터 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                쉼터 이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="쉼터 이름을 입력하세요"
                maxLength={100}
                required
              />
            </div>

            {/* 쉼터 유형 */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                쉼터 유형
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="쉼터">쉼터</option>
                <option value="정비소">정비소</option>
              </select>
            </div>

            {/* 신고 사유 */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                신고 사유
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">신고 사유를 선택하세요</option>
                {reportReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* 상세 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                상세 설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="신고 사유에 대한 상세한 설명을 입력하세요"
                maxLength={500}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500
              </p>
            </div>

            {/* 신고 가이드라인 */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">신고 가이드라인</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• 정확한 정보를 바탕으로 신고해주세요</li>
                <li>• 개인적인 불만이나 감정적인 내용은 제외해주세요</li>
                <li>• 구체적인 사유와 근거를 명시해주세요</li>
                <li>• 허위 신고는 제재 대상이 될 수 있습니다</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => navigate('/map')}
                variant="outline"
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim() || !formData.description.trim() || !formData.reason}
              >
                {isSubmitting ? '신고 중...' : '신고 접수'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 