import { useParams, Link, useLoaderData } from "react-router";
import { getPostById, getCommentsByPostId } from "~/lib/db/queries";
import { AlertTriangle, MapPin, Target } from "lucide-react";

export async function loader({ params }: { params: { postId: string } }) {
  try {
    const post = await getPostById(params.postId);
    if (!post) {
      throw new Response("게시글을 찾을 수 없습니다.", { status: 404 });
    }
    
    const comments = await getCommentsByPostId(params.postId);
    
    return { post, comments };
  } catch (error) {
    console.error('게시글 상세 로딩 오류:', error);
    throw new Response("게시글을 불러올 수 없습니다.", { status: 500 });
  }
}

export default function PostDetailPage() {
  const { postId } = useParams();
  const { post, comments } = useLoaderData<typeof loader>();

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
            <div className="flex items-center mb-2">
              {post.category === '단속 정보' && <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />}
              {post.category === '쉼터 정보' && <MapPin className="h-5 w-5 text-blue-500 mr-2" />}
              {post.category === '노하우' && <Target className="h-5 w-5 text-green-500 mr-2" />}
              <span className={`text-sm font-medium ${
                post.category === '단속 정보' ? 'text-red-600' :
                post.category === '쉼터 정보' ? 'text-blue-600' :
                'text-green-600'
              }`}>
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span>{post.author?.nickname || '알 수 없음'}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>👍 {post.likeCount}</span>
              <span>💬 {post.commentCount}</span>
            </div>
          </header>
          
          <div className="prose max-w-none mb-6">
            <p className="whitespace-pre-wrap">{post.content}</p>
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

        {/* 댓글 섹션 */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">댓글 ({comments.length})</h3>
          {comments.length === 0 ? (
            <p className="text-gray-500">아직 댓글이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author?.nickname || '알 수 없음'}</span>
                      <span className="text-sm text-gray-500">({comment.author?.region || '지역 미정'})</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 