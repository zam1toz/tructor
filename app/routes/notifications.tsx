import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Bell, MessageSquare, Award, MapPin, CheckCircle } from "lucide-react";

export function meta() {
  return [
    { title: "알림 - 트럭터" },
    { name: "description", content: "알림을 확인하세요" },
  ];
}

export default function Notifications() {
  // TODO: 실제 알림 데이터로 교체
  const notifications = [
    {
      id: 1,
      type: "comment",
      title: "댓글이 달렸습니다",
      content: "작성하신 게시글에 새로운 댓글이 달렸습니다.",
      date: "방금 전",
      read: false,
      icon: <MessageSquare className="h-5 w-5 text-blue-600" />
    },
    {
      id: 2,
      type: "mission",
      title: "미션 완료!",
      content: "일일 게시글 작성 미션을 완료했습니다. 50P를 획득했습니다.",
      date: "10분 전",
      read: false,
      icon: <Award className="h-5 w-5 text-yellow-600" />
    },
    {
      id: 3,
      type: "stamp",
      title: "스탬프 획득!",
      content: "서울 쉼터를 방문하여 스탬프를 획득했습니다.",
      date: "1시간 전",
      read: true,
      icon: <MapPin className="h-5 w-5 text-purple-600" />
    }
  ];

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
              <Button variant="outline" size="sm">
                모두 읽음 처리
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">알림</h1>
          </div>
          <p className="text-gray-600">새로운 소식과 활동 알림을 확인하세요.</p>
        </section>

        {/* 알림 목록 */}
        <section className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                notification.read ? 'border-gray-200' : 'border-blue-500'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <span className="text-sm text-gray-500">{notification.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{notification.content}</p>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        읽음 처리
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {notifications.length === 0 && (
          <section className="bg-white rounded-lg shadow-md p-8 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-gray-600 mb-4">
              새로운 활동이 있을 때 알림을 받을 수 있습니다.
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