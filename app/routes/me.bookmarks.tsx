import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BookmarkedPost {
  id: string;
  title: string;
  content: string;
  category: string;
  authorNickname: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  bookmarkedAt: string;
}

export default function BookmarksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/user/bookmarks', {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      } else {
        console.error('북마크 조회 실패');
      }
    } catch (error) {
      console.error('북마크 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });

      if (response.ok) {
        // 북마크 목록에서 제거
        setBookmarks(prev => prev.filter(bookmark => bookmark.id !== postId));
      } else {
        alert('북마크 해제에 실패했습니다.');
      }
    } catch (error) {
      console.error('북마크 해제 오류:', error);
      alert('북마크 해제 중 오류가 발생했습니다.');
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
          <h1 className="text-3xl font-bold">북마크</h1>
          <Button onClick={() => navigate('/me')} variant="outline">
            뒤로가기
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">북마크된 게시글이 없습니다</h3>
            <p className="text-gray-500 mb-6">관심 있는 게시글을 북마크해보세요!</p>
            <Button onClick={() => navigate('/posts')}>
              게시글 보기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {bookmark.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(bookmark.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    
                    <h3 
                      className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/posts/${bookmark.id}`)}
                    >
                      {bookmark.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {bookmark.content}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>작성자: {bookmark.authorNickname}</span>
                        <span>좋아요 {bookmark.likeCount}</span>
                        <span>댓글 {bookmark.commentCount}</span>
                      </div>
                      <span>북마크: {new Date(bookmark.bookmarkedAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => navigate(`/posts/${bookmark.id}`)}
                      size="sm"
                      variant="outline"
                    >
                      보기
                    </Button>
                    <Button
                      onClick={() => removeBookmark(bookmark.id)}
                      size="sm"
                      variant="destructive"
                    >
                      북마크 해제
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 