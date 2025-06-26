import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Bookmark, MessageSquare, MapPin, AlertTriangle, Target } from "lucide-react";

export function meta() {
  return [
    { title: "북마크 - 트럭터" },
    { name: "description", content: "저장한 게시글을 확인하세요" },
  ];
}

export default function MeBookmarks() {
  // TODO: 실제 북마크 데이터로 교체
  const bookmarks = [
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
    },
    {
      id: 3,
      title: "연비 개선 팁 공유",
      content: "장거리 운행 시 연비를 개선할 수 있는 실용적인 팁들을 모았습니다...",
      category: "노하우",
      author: "트럭마스터",
      date: "2024-01-13",
      likes: 32,
      comments: 12,
      icon: <Target className="h-4 w-4 text-green-500" />
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
              <Link to="/me" className="text-gray-600 hover:text-gray-900">
                마이페이지
              </Link>
              <Link to="/posts" className="text-gray-600 hover:text-gray-900">
                커뮤니티
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Bookmark className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">북마크</h1>
          </div>
          <p className="text-gray-600">저장한 게시글을 확인하고 관리하세요.</p>
        </section>

        {/* 북마크 목록 */}
        <section className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div key={bookmark.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {bookmark.icon}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(bookmark.category)}`}>
                      {bookmark.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link to={`/posts/${bookmark.id}`} className="hover:text-blue-600">
                      {bookmark.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{bookmark.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{bookmark.author}</span>
                      <span>{bookmark.date}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{bookmark.likes}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{bookmark.comments}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    북마크 해제
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {bookmarks.length === 0 && (
          <section className="bg-white rounded-lg shadow-md p-8 text-center">
            <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">북마크한 게시글이 없습니다</h3>
            <p className="text-gray-600 mb-4">
              관심 있는 게시글을 북마크하면 나중에 쉽게 찾을 수 있습니다.
            </p>
            <Link to="/posts">
              <Button>
                커뮤니티 보기
              </Button>
            </Link>
          </section>
        )}
      </main>
    </div>
  );
} 