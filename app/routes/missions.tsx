import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { 
  Target, 
  Award, 
  Calendar, 
  CheckCircle, 
  Circle,
  Trophy,
  Star,
  Clock
} from "lucide-react";

export function meta() {
  return [
    { title: "미션 - 트럭터" },
    { name: "description", content: "미션을 완료하고 포인트를 획득하세요" },
  ];
}

export default function Missions() {
  // TODO: 실제 미션 데이터로 교체
  const missions = {
    daily: [
      { id: 1, title: "일일 게시글 작성", description: "오늘 게시글을 1개 작성하세요", reward: 50, completed: true, progress: 1, target: 1 },
      { id: 2, title: "댓글 3개 작성", description: "다른 게시글에 댓글을 3개 작성하세요", reward: 30, completed: false, progress: 2, target: 3 },
      { id: 3, title: "단속 정보 제보", description: "단속 정보를 1개 제보하세요", reward: 100, completed: false, progress: 0, target: 1 },
    ],
    weekly: [
      { id: 4, title: "쉼터 후기 5개 작성", description: "쉼터 후기를 5개 작성하세요", reward: 200, completed: false, progress: 3, target: 5 },
      { id: 5, title: "게시글 10개 작성", description: "게시글을 10개 작성하세요", reward: 300, completed: false, progress: 7, target: 10 },
      { id: 6, title: "댓글 20개 작성", description: "댓글을 20개 작성하세요", reward: 150, completed: false, progress: 15, target: 20 },
    ],
    achievement: [
      { id: 7, title: "단속헌터", description: "단속 정보를 50개 제보하세요", reward: 1000, completed: false, progress: 23, target: 50, badge: "단속헌터" },
      { id: 8, title: "쉼터마스터", description: "쉼터 후기를 100개 작성하세요", reward: 1500, completed: false, progress: 45, target: 100, badge: "쉼터마스터" },
      { id: 9, title: "댓글왕", description: "댓글을 500개 작성하세요", reward: 2000, completed: false, progress: 234, target: 500, badge: "댓글왕" },
    ]
  };

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 미션 통계 */}
        <section className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg shadow-md p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">미션 현황</h1>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">3</div>
                  <div className="text-sm opacity-90">완료된 미션</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">6</div>
                  <div className="text-sm opacity-90">진행 중</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">280P</div>
                  <div className="text-sm opacity-90">획득 포인트</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90 mb-2">다음 리셋까지</div>
              <div className="text-2xl font-bold">12:34:56</div>
              <div className="text-sm opacity-90">일일 미션</div>
            </div>
          </div>
        </section>

        {/* 일일 미션 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">일일 미션</h2>
            <span className="text-sm text-gray-500">매일 자정에 리셋됩니다</span>
          </div>
          
          <div className="space-y-4">
            {missions.daily.map((mission) => (
              <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                      {mission.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-900">{mission.reward}P</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {mission.progress}/{mission.target}
                        </div>
                      </div>
                      {mission.completed ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">완료</span>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          진행하기
                        </Button>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(mission.progress, mission.target)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 주간 미션 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">주간 미션</h2>
            <span className="text-sm text-gray-500">매주 월요일에 리셋됩니다</span>
          </div>
          
          <div className="space-y-4">
            {missions.weekly.map((mission) => (
              <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                      {mission.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-900">{mission.reward}P</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {mission.progress}/{mission.target}
                        </div>
                      </div>
                      {mission.completed ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">완료</span>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          진행하기
                        </Button>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(mission.progress, mission.target)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 업적 미션 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Trophy className="h-6 w-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">업적 미션</h2>
            <span className="text-sm text-gray-500">한 번 완료하면 영구 보상</span>
          </div>
          
          <div className="space-y-4">
            {missions.achievement.map((mission) => (
              <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">{mission.title}</h3>
                      {mission.badge && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {mission.badge}
                        </span>
                      )}
                      {mission.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-900">{mission.reward}P</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {mission.progress}/{mission.target}
                        </div>
                      </div>
                      {mission.completed ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">완료</span>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          진행하기
                        </Button>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(mission.progress, mission.target)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 