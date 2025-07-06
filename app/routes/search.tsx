import { Button } from "~/components/ui/button";
import { Link, useSearchParams, useLoaderData } from "react-router";
import { Search, MessageSquare, MapPin, AlertTriangle, Target } from "lucide-react";
import { searchPosts } from "~/lib/db/queries";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  
  if (!query.trim()) {
    return { results: [], query };
  }
  
  try {
    const results = await searchPosts(query, 20);
    return { results, query };
  } catch (error) {
    console.error('검색 오류:', error);
    return { results: [], query };
  }
}

export function meta() {
  return [
    { title: "검색 결과 - 트럭터" },
    { name: "description", content: "검색 결과를 확인하세요" },
  ];
}

export default function SearchResult() {
  const [params] = useSearchParams();
  const { results, query } = useLoaderData<typeof loader>();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "단속 정보": return "text-red-600 bg-red-100";
      case "쉼터 정보": return "text-blue-600 bg-blue-100";
      case "노하우": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">트럭터</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/posts" className="text-gray-600 hover:text-gray-900">
                커뮤니티
              </Link>
              <Link to="/me" className="text-gray-600 hover:text-gray-900">
                마이페이지
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">검색 결과</h1>
          </div>
          <p className="text-gray-600">"{query}"에 대한 검색 결과입니다.</p>
        </section>

        {/* 검색 결과 목록 */}
        <section className="space-y-4">
          {results.length > 0 ? (
            results.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {result.category === '단속 정보' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {result.category === '쉼터 정보' && <MapPin className="h-4 w-4 text-blue-500" />}
                      {result.category === '노하우' && <Target className="h-4 w-4 text-green-500" />}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link to={`/posts/${result.id}`} className="hover:text-blue-600">
                        {result.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{result.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{result.author?.nickname || '알 수 없음'}</span>
                        <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{result.likeCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{result.commentCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <section className="bg-white rounded-lg shadow-md p-8 text-center">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600 mb-4">
                다른 키워드로 검색해보세요.
              </p>
              <Link to="/posts">
                <Button>
                  커뮤니티 보기
                </Button>
              </Link>
            </section>
          )}
        </section>
      </main>
    </div>
  );
} 