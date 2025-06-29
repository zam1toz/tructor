import { Link } from 'react-router';

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">게시글 목록</h1>
      <div className="grid gap-4">
        {/* 게시글 목록 컴포넌트가 여기에 들어갈 예정 */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">샘플 게시글</h2>
          <p className="text-gray-600 mb-2">게시글 내용 미리보기...</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">작성자 • 2024-01-01</span>
            <Link to="/posts/1" className="text-blue-600 hover:underline">
              자세히 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 