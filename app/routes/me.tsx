import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function MePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleUpdateProfile = async (formData: FormData) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // 프로필 업데이트 성공 처리
        window.location.reload();
      } else {
        const data = await response.json();
        alert(data.error || '프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
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
              <span className="text-sm text-gray-600">내 프로필</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8">내 프로필</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <p className="text-lg font-semibold">{user.nickname}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                <p className="text-lg">{user.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  지역
                </label>
                <p className="text-lg">{user.region}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가입일
                </label>
                <p className="text-lg">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={() => navigate('/me/points')}
              className="w-full"
            >
              포인트 내역
            </Button>
            
            <Button 
              onClick={() => navigate('/me/bookmarks')}
              className="w-full"
              variant="outline"
            >
              북마크
            </Button>
            
            <Button 
              onClick={() => navigate('/me/reports')}
              className="w-full"
              variant="outline"
            >
              내 신고 내역
            </Button>
            
            <Button 
              onClick={() => navigate('/notifications')}
              className="w-full"
              variant="outline"
            >
              알림
            </Button>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="flex-1"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 