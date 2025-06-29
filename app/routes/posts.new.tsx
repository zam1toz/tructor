import { Link } from 'react-router';

export default function NewPostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/posts" className="text-blue-600 hover:underline">
            ← 게시글 목록으로
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">새 게시글 작성</h1>
        
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
              placeholder="게시글 제목을 입력하세요"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              id="category"
              name="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">카테고리를 선택하세요</option>
              <option value="general">일반</option>
              <option value="question">질문</option>
              <option value="review">후기</option>
              <option value="news">뉴스</option>
            </select>
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
              placeholder="게시글 내용을 입력하세요"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              게시글 작성
            </button>
            <Link
              to="/posts"
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