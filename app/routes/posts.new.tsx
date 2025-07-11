import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function NewPostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '일반'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    '일반',
    '단속 정보',
    '쉼터 정보',
    '노하우',
    '질문',
    '잡담'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        alert('게시글이 작성되었습니다!');
        navigate(`/posts/${data.post.id}`);
      } else {
        const errorData = await response.json();
        alert(errorData.error || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">새 게시글 작성</h1>
          <Button onClick={() => navigate('/posts')} variant="outline">
            뒤로가기
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 선택 */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 제목 입력 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="제목을 입력하세요"
                maxLength={100}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/100
              </p>
            </div>

            {/* 내용 입력 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="내용을 입력하세요"
                maxLength={2000}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.content.length}/2000
              </p>
            </div>

            {/* 작성 가이드라인 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">작성 가이드라인</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 다른 사용자를 비방하거나 욕설을 사용하지 마세요</li>
                <li>• 개인정보나 민감한 정보를 포함하지 마세요</li>
                <li>• 상업적 광고나 홍보는 금지됩니다</li>
                <li>• 관련 없는 내용이나 스팸은 삭제될 수 있습니다</li>
              </ul>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => navigate('/posts')}
                variant="outline"
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              >
                {isSubmitting ? '작성 중...' : '게시글 작성'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
} 