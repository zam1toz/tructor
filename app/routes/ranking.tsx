import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from "../components/Navbar";

interface RankingUser {
  id: string;
  nickname: string;
  region: string;
  points: number;
  level: number;
  totalPosts: number;
  totalComments: number;
  rank: number;
}

interface RankingCategory {
  id: string;
  name: string;
  description: string;
}

export default function RankingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('points');
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<RankingUser | null>(null);

  const categories: RankingCategory[] = [
    {
      id: 'points',
      name: '포인트',
      description: '포인트 순위'
    },
    {
      id: 'posts',
      name: '게시글',
      description: '게시글 작성 순위'
    },
    {
      id: 'comments',
      name: '댓글',
      description: '댓글 작성 순위'
    }
  ];

  useEffect(() => {
    fetchRankings();
  }, [activeCategory]);

  const fetchRankings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ranking/${activeCategory}`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRankings(data.rankings);
        setMyRank(data.myRank);
      } else {
        console.error('랭킹 조회 실패');
      }
    } catch (error) {
      console.error('랭킹 조회 오류:', error);
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600';
    if (level >= 7) return 'text-red-600';
    if (level >= 5) return 'text-orange-600';
    if (level >= 3) return 'text-blue-600';
    return 'text-gray-600';
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
              <span className="text-sm text-gray-600">랭킹</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">랭킹</h1>
            <Button onClick={() => navigate('/me')} variant="outline">
              뒤로가기
            </Button>
          </div>

          {/* 내 순위 */}
          {myRank && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-white">
              <h2 className="text-xl font-semibold mb-4">내 순위</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">
                    {getRankIcon(myRank.rank)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{myRank.nickname}</p>
                    <p className="text-sm opacity-90">{myRank.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {activeCategory === 'points' && `${myRank.points.toLocaleString()}P`}
                    {activeCategory === 'posts' && `${myRank.totalPosts}개`}
                    {activeCategory === 'comments' && `${myRank.totalComments}개`}
                  </p>
                  <p className="text-sm opacity-90">
                    Lv.{myRank.level}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 카테고리 탭 */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? 'default' : 'ghost'}
                className="flex-1"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* 랭킹 목록 */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {categories.find(c => c.id === activeCategory)?.description}
              </h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : rankings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                랭킹 데이터가 없습니다.
              </div>
            ) : (
              <div className="divide-y">
                {rankings.map((rankingUser) => (
                  <div key={rankingUser.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-gray-400 w-8 text-center">
                          {getRankIcon(rankingUser.rank)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-gray-900">
                              {rankingUser.nickname}
                            </p>
                            <span className={`text-sm font-medium ${getLevelColor(rankingUser.level)}`}>
                              Lv.{rankingUser.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{rankingUser.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {activeCategory === 'points' && `${rankingUser.points.toLocaleString()}P`}
                          {activeCategory === 'posts' && `${rankingUser.totalPosts}개`}
                          {activeCategory === 'comments' && `${rankingUser.totalComments}개`}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>게시글 {rankingUser.totalPosts}</span>
                          <span>댓글 {rankingUser.totalComments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 랭킹 안내 */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">랭킹 시스템 안내</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">포인트 획득 방법</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• 게시글 작성: +10P</li>
                  <li>• 댓글 작성: +2P</li>
                  <li>• 좋아요 받기: +1P</li>
                  <li>• 쉼터 방문: +5P</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">레벨 시스템</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Lv.1-2: 초보자</li>
                  <li>• Lv.3-4: 중급자</li>
                  <li>• Lv.5-6: 고급자</li>
                  <li>• Lv.7+: 마스터</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 