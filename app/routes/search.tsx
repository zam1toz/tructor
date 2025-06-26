import { Button } from "~/components/ui/button";
import { Link, useSearchParams } from "react-router";
import { Search, MessageSquare, MapPin, AlertTriangle, Target } from "lucide-react";

export function meta() {
  return [
    { title: "검색 결과 - 트럭터" },
    { name: "description", content: "검색 결과를 확인하세요" },
  ];
}

export default function SearchResult() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  // TODO: 실제 검색 결과 데이터로 교체
  const results = [
    {
      id: 1,
      title: "경부선 고속도로 단속 정보",
      content: "오늘 오후 2시부터 경부선 고속도로에서 단속이 있을 예정입니다...",
      category: "단속 정보",
      author: "달리는기사",
      date: "2024-01-15",
      likes: 24,
      comments: 8,
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />
    },
    {
      id: 2,
      title: "서울외곽순환도로 쉼터 추천",
      content: "서울외곽순환도로에서 가장 깨끗하고 편리한 쉼터를 소개합니다...",
      category: "쉼터 정보",
      author: "고속도로킹",
      date: "2024-01-14",
      likes: 18,
      comments: 5,
      icon: <MapPin className="h-4 w-4 text-blue-500" />
    }
  ];

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
                      {result.icon}
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
                        <span>{result.author}</span>
                        <span>{result.date}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{result.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{result.comments}</span>
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