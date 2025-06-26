import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Award, TrendingUp, Calendar, Star } from "lucide-react";

export function meta() {
  return [
    { title: "포인트 내역 - 트럭터" },
    { name: "description", content: "포인트 적립 및 사용 내역을 확인하세요" },
  ];
}

export default function MePoints() {
  // TODO: 실제 포인트 데이터로 교체
  const pointsData = {
    currentPoints: 1250,
    totalEarned: 1800,
    totalUsed: 550,
    level: 5,
    nextLevelPoints: 250,
    history: [
      {
        id: 1,
        type: "earn",
        amount: 50,
        description: "일일 게시글 작성",
        date: "2024-01-15 14:30",
        category: "미션"
      },
      {
        id: 2,
        type: "earn",
        amount: 100,
        description: "단속 정보 제보",
        date: "2024-01-15 12:15",
        category: "제보"
      },
      {
        id: 3,
        type: "earn",
        amount: 30,
        description: "댓글 작성",
        date: "2024-01-15 10:45",
        category: "커뮤니티"
      },
      {
        id: 4,
        type: "earn",
        amount: 80,
        description: "쉼터 후기 작성",
        date: "2024-01-14 16:20",
        category: "후기"
      },
      {
        id: 5,
        type: "use",
        amount: -100,
        description: "포인트 교환",
        date: "2024-01-14 09:30",
        category: "교환"
      }
    ]
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "미션": return "bg-blue-100 text-blue-800";
      case "제보": return "bg-red-100 text-red-800";
      case "커뮤니티": return "bg-green-100 text-green-800";
      case "후기": return "bg-purple-100 text-purple-800";
      case "교환": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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
              <Link to="/ranking" className="text-gray-600 hover:text-gray-900">
                랭킹
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 포인트 요약 */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">포인트 현황</h1>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{pointsData.currentPoints.toLocaleString()}</div>
                  <div className="text-sm opacity-90">현재 포인트</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{pointsData.totalEarned.toLocaleString()}</div>
                  <div className="text-sm opacity-90">총 적립</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{pointsData.totalUsed.toLocaleString()}</div>
                  <div className="text-sm opacity-90">총 사용</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5" />
                <span className="text-lg font-bold">Lv.{pointsData.level}</span>
              </div>
              <div className="text-sm opacity-90 mb-2">다음 레벨까지</div>
              <div className="text-2xl font-bold">{pointsData.nextLevelPoints}P</div>
              <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* 포인트 획득 방법 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">포인트 획득 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Award className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">미션 완료</h3>
                <p className="text-sm text-gray-600">일일/주간 미션 완료 시 포인트 획득</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">커뮤니티 활동</h3>
                <p className="text-sm text-gray-600">게시글, 댓글 작성 시 포인트 획득</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-gray-900">후기 작성</h3>
                <p className="text-sm text-gray-600">쉼터 후기 작성 시 포인트 획득</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-gray-900">정보 제보</h3>
                <p className="text-sm text-gray-600">단속 정보 제보 시 포인트 획득</p>
              </div>
            </div>
          </div>
        </section>

        {/* 포인트 내역 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">포인트 내역</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">전체</Button>
              <Button variant="outline" size="sm">적립</Button>
              <Button variant="outline" size="sm">사용</Button>
            </div>
          </div>

          <div className="space-y-4">
            {pointsData.history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {item.type === "earn" ? (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-red-600 transform rotate-180" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.description}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-sm text-gray-500">{item.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    item.type === "earn" ? "text-green-600" : "text-red-600"
                  }`}>
                    {item.type === "earn" ? "+" : ""}{item.amount}P
                  </span>
                </div>
              </div>
            ))}
          </div>

          {pointsData.history.length === 0 && (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">아직 포인트 내역이 없습니다.</p>
              <p className="text-gray-400 text-sm">활동을 시작해서 포인트를 획득해보세요!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
} 