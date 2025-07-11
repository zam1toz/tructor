import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Report {
  id: string;
  targetType: 'post' | 'comment';
  targetId: string;
  targetTitle?: string;
  targetContent: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
  handledAt?: string;
  result?: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/user/reports', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports);
      } else {
        console.error('신고 내역 조회 실패');
      }
    } catch (error) {
      console.error('신고 내역 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        // 신고 목록에서 제거
        setReports(prev => prev.filter(report => report.id !== reportId));
        alert('신고가 취소되었습니다.');
      } else {
        alert('신고 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 취소 오류:', error);
      alert('신고 취소 중 오류가 발생했습니다.');
    }
  };

  const getAuthToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '검토 중';
      case 'reviewed':
        return '처리 완료';
      case 'dismissed':
        return '기각됨';
      default:
        return '알 수 없음';
    }
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">내 신고 내역</h1>
          <Button onClick={() => navigate('/me')} variant="outline">
            뒤로가기
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">신고 내역이 없습니다</h3>
            <p className="text-gray-500">부적절한 콘텐츠를 발견하면 신고해주세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {report.targetType === 'post' ? '게시글' : '댓글'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
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
                    
                    {report.handledAt && (
                      <div className="text-sm text-gray-500 mb-2">
                        처리일: {new Date(report.handledAt).toLocaleDateString('ko-KR')}
                      </div>
                    )}
                    
                    {report.result && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-blue-800">
                          <strong>처리 결과:</strong> {report.result}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {report.targetType === 'post' && (
                      <Button
                        onClick={() => navigate(`/posts/${report.targetId}`)}
                        size="sm"
                        variant="outline"
                      >
                        게시글 보기
                      </Button>
                    )}
                    
                    {report.status === 'pending' && (
                      <Button
                        onClick={() => cancelReport(report.id)}
                        size="sm"
                        variant="destructive"
                      >
                        신고 취소
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 신고 가이드라인 */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">신고 가이드라인</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>욕설, 비방, 차별적 표현</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>허위 정보 또는 스팸</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>개인정보 노출</span>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>상업적 광고 또는 홍보</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 