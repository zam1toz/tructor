import { Link, useLoaderData } from 'react-router';
import { getPosts } from '~/lib/db/queries';
import { AlertTriangle, MapPin, Target } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";

export async function loader() {
  try {
    const posts = await getPosts(20, 0);
    return { posts };
  } catch (error) {
    console.error('게시글 목록 로딩 오류:', error);
    return { posts: [] };
  }
}

export default function PostsPage() {
  const { posts } = useLoaderData<typeof loader>();
  const { user, loading, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
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
            <span className="text-sm text-gray-600">게시글 목록</span>
          </div>
          
          <Link 
            to="/posts/new" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            글쓰기
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">게시글 목록</h1>
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">게시글이 없습니다.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.id} to={`/posts/${post.id}`} className="block">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  {post.category === '단속 정보' && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
                  {post.category === '쉼터 정보' && <MapPin className="h-4 w-4 text-blue-500 mr-2" />}
                  {post.category === '노하우' && <Target className="h-4 w-4 text-green-500 mr-2" />}
                  <span className={`text-sm font-medium ${
                    post.category === '단속 정보' ? 'text-red-600' :
                    post.category === '쉼터 정보' ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-3">
                  {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>👍 {post.likeCount}</span>
                    <span>💬 {post.commentCount}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {post.author?.nickname || '알 수 없음'} ({post.author?.region || '지역 미정'})
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      </div>
    </div>
  );
} 