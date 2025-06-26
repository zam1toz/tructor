import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { 
  User, 
  MapPin, 
  Trophy, 
  Bookmark, 
  MessageSquare, 
  Settings, 
  LogOut,
  Star,
  Calendar,
  TrendingUp
} from "lucide-react";

export function meta() {
  return [
    { title: "마이페이지 - 트럭터" },
    { name: "description", content: "내 활동 내역과 정보를 확인하세요" },
  ];
}

export default function Me() {
  // TODO: 실제 사용자 데이터로 교체
  const userData = {
    nickname: "김기사",
    level: 5,
    points: 1250,
    totalPosts: 23,
    totalComments: 67,
    joinDate: "2024-01-15",
    badges: ["단속헌터", "쉼터마스터", "댓글왕"],
    recentActivity: [
      { type: "post", title: "경부선 단속 정보", time: "2시간 전" },
      { type: "comment", title: "서울외곽순환도로 쉼터 추천", time: "5시간 전" },
      { type: "stamp", title: "서울 쉼터 방문", time: "1일 전" },
    ]
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
              <Link to="/notifications" className="text-gray-600 hover:text-gray-900">
                알림
              </Link>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 섹션 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{userData.nickname}</h1>
                <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                  <Star className="h-4 w-4 mr-1" />
                  Lv.{userData.level}
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                가입일: {userData.joinDate} • 총 포인트: {userData.points.toLocaleString()}P
              </p>
              <div className="flex space-x-2">
                {userData.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <Link to="/me/points">
                <Button variant="outline">
                  포인트 내역
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 통계 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-2">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userData.totalPosts}</div>
            <div className="text-gray-600">총 게시글</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-2">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userData.totalComments}</div>
            <div className="text-gray-600">총 댓글</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-2">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userData.badges.length}</div>
            <div className="text-gray-600">획득 뱃지</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-2">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-gray-600">방문 쉼터</div>
          </div>
        </section>

        {/* 메뉴 그리드 */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/me/bookmarks" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <Bookmark className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">북마크</h3>
                <p className="text-gray-600">저장한 게시글</p>
              </div>
            </div>
          </Link>
          
          <Link to="/me/reports" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">내 신고</h3>
                <p className="text-gray-600">신고한 콘텐츠</p>
              </div>
            </div>
          </Link>
          
          <Link to="/ranking" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">랭킹</h3>
                <p className="text-gray-600">내 순위 확인</p>
              </div>
            </div>
          </Link>
          
          <Link to="/missions" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">미션</h3>
                <p className="text-gray-600">진행 중인 미션</p>
              </div>
            </div>
          </Link>
          
          <Link to="/map" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <MapPin className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">지도</h3>
                <p className="text-gray-600">운행 기록 보기</p>
              </div>
            </div>
          </Link>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-gray-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">설정</h3>
                <p className="text-gray-600">계정 설정</p>
              </div>
            </div>
          </div>
        </section>

        {/* 최근 활동 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-4">
            {userData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === "post" && <MessageSquare className="h-5 w-5 text-blue-600" />}
                  {activity.type === "comment" && <MessageSquare className="h-5 w-5 text-green-600" />}
                  {activity.type === "stamp" && <MapPin className="h-5 w-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 