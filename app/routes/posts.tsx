import { Link, useLoaderData } from 'react-router';
import { getPosts } from '~/lib/db/queries';
import { AlertTriangle, MapPin, Target } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                트럭터
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                로그인
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
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