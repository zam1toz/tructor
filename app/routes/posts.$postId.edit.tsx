import { useParams, Link } from "react-router";

export default function EditPostPage() {
  const { postId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to={`/posts/${postId}`} className="text-blue-600 hover:underline">
            ← 게시글로 돌아가기
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">게시글 수정</h1>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="기존 게시글 제목"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="기존 게시글 내용..."
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              수정 완료
            </button>
            <Link
              to={`/posts/${postId}`}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 