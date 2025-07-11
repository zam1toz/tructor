import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  nickname: string;
  phone: string;
  region: string;
  status: 'active' | 'banned';
  is_admin: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface Report {
  id: string;
  targetType: 'post' | 'comment';
  targetId: string;
  targetContent: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  reporterNickname: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
  pendingReports: number;
}

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'reports'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('통계 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('사용자 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
      }
    } catch (error) {
      console.error('신고 목록 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, status: 'banned' as const }
              : user
          )
        );
        alert('사용자가 차단되었습니다.');
      } else {
        alert('사용자 차단에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 차단 오류:', error);
      alert('사용자 차단 중 오류가 발생했습니다.');
    }
  };

  const unbanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        setUsers(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, status: 'active' as const }
              : user
          )
        );
        alert('사용자 차단이 해제되었습니다.');
      } else {
        alert('사용자 차단 해제에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 차단 해제 오류:', error);
      alert('사용자 차단 해제 중 오류가 발생했습니다.');
    }
  };

  const handleReport = async (reportId: string, action: 'approve' | 'dismiss', memo?: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ memo })
      });

      if (response.ok) {
        setReports(prev => 
          prev.map(report => 
            report.id === reportId 
              ? { ...report, status: action === 'approve' ? 'reviewed' : 'dismissed' }
              : report
          )
        );
        alert(`신고가 ${action === 'approve' ? '승인' : '기각'}되었습니다.`);
      } else {
        alert('신고 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 처리 오류:', error);
      alert('신고 처리 중 오류가 발생했습니다.');
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
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">관리자 페이지</h1>
          <Button onClick={() => navigate('/me')} variant="outline">
            뒤로가기
          </Button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <Button
            onClick={() => setActiveTab('dashboard')}
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            className="flex-1"
          >
            대시보드
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            className="flex-1"
          >
            사용자 관리
          </Button>
          <Button
            onClick={() => setActiveTab('reports')}
            variant={activeTab === 'reports' ? 'default' : 'ghost'}
            className="flex-1"
          >
            신고 관리
          </Button>
        </div>

        {/* 대시보드 */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">총 사용자</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">총 게시글</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.totalPosts.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">총 신고</h3>
                  <p className="text-3xl font-bold text-red-600">{stats.totalReports.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">대기 신고</h3>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingReports.toLocaleString()}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* 사용자 관리 */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">사용자 관리</h2>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        사용자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        지역
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        가입일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.nickname}</div>
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.region}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? '활성' : '차단'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.status === 'active' ? (
                            <Button
                              onClick={() => banUser(user.id, '관리자에 의한 차단')}
                              size="sm"
                              variant="destructive"
                            >
                              차단
                            </Button>
                          ) : (
                            <Button
                              onClick={() => unbanUser(user.id)}
                              size="sm"
                              variant="outline"
                            >
                              차단 해제
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 신고 관리 */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">처리할 신고가 없습니다.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {report.targetType === 'post' ? '게시글' : '댓글'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'reviewed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.status === 'pending' ? '대기' :
                           report.status === 'reviewed' ? '처리됨' : '기각됨'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        신고 사유: {report.reason}
                      </h3>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700">
                          <strong>신고된 콘텐츠:</strong> {report.targetContent}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-500">
                        신고자: {report.reporterNickname}
                      </p>
                    </div>
                    
                    {report.status === 'pending' && (
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          onClick={() => handleReport(report.id, 'approve')}
                          size="sm"
                          variant="default"
                        >
                          승인
                        </Button>
                        <Button
                          onClick={() => handleReport(report.id, 'dismiss')}
                          size="sm"
                          variant="destructive"
                        >
                          기각
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 