import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PointHistory {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
  createdAt: string;
}

export default function PointsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    fetchPointHistory();
  }, []);

  const fetchPointHistory = async () => {
    try {
      const response = await fetch('/api/user/points', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPointHistory(data.history);
        setTotalPoints(data.totalPoints);
      } else {
        console.error('포인트 내역 조회 실패');
      }
    } catch (error) {
      console.error('포인트 내역 조회 오류:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold">포인트 내역</h1>
          <Button onClick={() => navigate('/me')} variant="outline">
            뒤로가기
          </Button>
        </div>

        {/* 포인트 요약 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">
              {totalPoints.toLocaleString()} P
            </h2>
            <p className="text-gray-600">현재 보유 포인트</p>
          </div>
        </div>

        {/* 포인트 내역 */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold">포인트 내역</h3>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : pointHistory.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              포인트 내역이 없습니다.
            </div>
          ) : (
            <div className="divide-y">
              {pointHistory.map((item) => (
                <div key={item.id} className="p-6 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${
                      item.type === 'earn' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.type === 'earn' ? '+' : '-'}{item.amount.toLocaleString()} P
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 포인트 획득 방법 안내 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">포인트 획득 방법</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>게시글 작성: +10P</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>댓글 작성: +2P</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>좋아요 받기: +1P</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>쉼터 방문 체크인: +5P</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 