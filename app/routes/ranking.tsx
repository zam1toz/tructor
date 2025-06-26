import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Medal, 
  Target,
  Calendar,
  Award
} from "lucide-react";

export function meta() {
  return [
    { title: "랭킹 - 트럭터" },
    { name: "description", content: "포인트 랭킹과 미션을 확인하세요" },
  ];
}

export default function Ranking() {
  // TODO: 실제 랭킹 데이터로 교체
  const rankingData = {
    myRank: 15,
    myPoints: 1250,
    myLevel: 5,
    rankings: [
      { rank: 1, nickname: "달리는기사", points: 3450, level: 12, badges: ["단속헌터", "쉼터마스터"] },
      { rank: 2, nickname: "고속도로킹", points: 2980, level: 10, badges: ["댓글왕"] },
      { rank: 3, nickname: "트럭마스터", points: 2670, level: 9, badges: ["단속헌터"] },
      { rank: 4, nickname: "도로의달인", points: 2340, level: 8, badges: ["쉼터마스터"] },
      { rank: 5, nickname: "운전고수", points: 2100, level: 7, badges: [] },
      { rank: 6, nickname: "길잡이", points: 1890, level: 6, badges: [] },
      { rank: 7, nickname: "도로친구", points: 1670, level: 6, badges: [] },
      { rank: 8, nickname: "고속도로맨", points: 1450, level: 5, badges: [] },
      { rank: 9, nickname: "트럭러버", points: 1320, level: 5, badges: [] },
      { rank: 10, nickname: "운전왕", points: 1180, level: 4, badges: [] },
    ]
  };

  const missions = [
    { id: 1, title: "일일 게시글 작성", description: "오늘 게시글을 1개 작성하세요", reward: 50, completed: true },
    { id: 2, title: "단속 정보 제보", description: "단속 정보를 1개 제보하세요", reward: 100, completed: false },
    { id: 3, title: "쉼터 후기 작성", description: "쉼터 후기를 1개 작성하세요", reward: 80, completed: false },
    { id: 4, title: "댓글 5개 작성", description: "다른 게시글에 댓글을 5개 작성하세요", reward: 30, completed: true },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-500" />;
    return <span className="text-lg font-bold text-gray-600">{rank}</span>;
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
              <Link to="/missions" className="text-gray-600 hover:text-gray-900">
                미션
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 내 랭킹 정보 */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">내 랭킹</h1>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{rankingData.myRank}</div>
                  <div className="text-sm opacity-90">순위</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{rankingData.myPoints.toLocaleString()}</div>
                  <div className="text-sm opacity-90">포인트</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">Lv.{rankingData.myLevel}</div>
                  <div className="text-sm opacity-90">레벨</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-2">다음 레벨까지</div>
              <div className="text-2xl font-bold">250P</div>
              <div className="w-32 bg-white bg-opacity-20 rounded-full h-2 mt-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* 랭킹 탭 */}
        <section className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600">
                포인트 랭킹
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                주간 랭킹
              </button>
              <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                월간 랭킹
              </button>
            </nav>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {rankingData.rankings.map((user) => (
                <div key={user.rank} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 text-center">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{user.nickname}</h3>
                      <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Lv.{user.level}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">{user.points.toLocaleString()}P</span>
                      {user.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 미션 섹션 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">오늘의 미션</h2>
            <Link to="/missions">
              <Button variant="outline" size="sm">
                전체 미션 보기
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map((mission) => (
              <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-900">{mission.reward}P</span>
                      </div>
                      {mission.completed ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <span className="text-sm">완료</span>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          진행하기
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 레벨 정보 */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">레벨 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">Lv.1-5</div>
              <div className="text-sm text-gray-600">초보 기사</div>
              <div className="text-xs text-gray-500 mt-1">기본 기능 사용</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">Lv.6-10</div>
              <div className="text-sm text-gray-600">중급 기사</div>
              <div className="text-xs text-gray-500 mt-1">미션 참여 가능</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">Lv.11+</div>
              <div className="text-sm text-gray-600">고급 기사</div>
              <div className="text-xs text-gray-500 mt-1">특별 보상 획득</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 