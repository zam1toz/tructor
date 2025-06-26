import { useParams, Link } from "react-router";

export default function PostDetailPage() {
  const { postId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/posts" className="text-blue-600 hover:underline">
            ← 게시글 목록으로
          </Link>
        </div>
        
        <article className="border rounded-lg p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold mb-2">게시글 제목 (ID: {postId})</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>작성자</span>
              <span>2024-01-01</span>
              <span>조회수: 123</span>
            </div>
          </header>
          
          <div className="prose max-w-none mb-6">
            <p>게시글 내용이 여기에 표시됩니다...</p>
          </div>
          
          <footer className="border-t pt-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  좋아요
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  북마크
                </button>
              </div>
              <div className="flex gap-2">
                <Link 
                  to={`/posts/${postId}/edit`}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  수정
                </Link>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  삭제
                </button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
} 