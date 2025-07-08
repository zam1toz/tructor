import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { MapPin, TrendingUp, AlertTriangle, Users, Trophy, Target } from "lucide-react";
import type { Route } from "./+types/home";
import { useAuth } from "~/contexts/AuthContext";
/* import { Welcome } from "../welcome/welcome"; */

export function meta({}: Route.MetaArgs) {
  return [
    { title: "트럭터 - 화물차 기사 커뮤니티" },
    { name: "description", content: "화물차 기사들을 위한 운행기록 기반 커뮤니티 플랫폼" },
  ];
}

export default function Home() {
  const { user, loading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                트럭터
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <span>로딩 중...</span>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="font-bold">{user.nickname}님 환영합니다!</span>
                  <Link to="/me">
                    <Button variant="outline">마이페이지</Button>
                  </Link>
                  <Button variant="outline" onClick={logout}>로그아웃</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button>로그인</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline">회원가입</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 히어로 섹션 */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            혼자 써도 유용하고, 함께 쓰면 더 강력해지는
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            화물차 기사들을 위한 운행기록 기반 커뮤니티 플랫폼
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                지금 시작하기
              </Button>
            </Link>
            <Link to="/map">
              <Button variant="outline" size="lg">
                지도 보기
              </Button>
            </Link>
          </div>
        </section>

        {/* 주요 기능 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold">운행 기록</h3>
            </div>
            <p className="text-gray-600">
              GPS 기반으로 운행 경로를 시각화하고 개인 운행일지를 자동으로 생성합니다.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold">커뮤니티</h3>
            </div>
            <p className="text-gray-600">
              쉼터 정보, 단속 제보, 노하우 공유 등 기사들만의 특별한 소통 공간입니다.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
              <h3 className="text-lg font-semibold">게이미피케이션</h3>
            </div>
            <p className="text-gray-600">
              포인트, 뱃지, 랭킹 시스템으로 재미있게 참여하고 보상을 받으세요.
            </p>
          </div>
        </section>

        {/* 인기 콘텐츠 섹션 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">인기 게시글</h3>
            <Link to="/posts" className="text-blue-600 hover:text-blue-800">
              더보기 →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 인기 게시글 카드들 */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-sm text-red-600 font-medium">단속 정보</span>
              </div>
              <h4 className="font-semibold mb-2">경부선 고속도로 단속 정보</h4>
              <p className="text-sm text-gray-600 mb-3">
                오늘 오후 2시부터 경부선 고속도로에서 단속이 있을 예정입니다...
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>👍 24</span>
                <span>💬 8</span>
                <span>2시간 전</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-sm text-blue-600 font-medium">쉼터 정보</span>
              </div>
              <h4 className="font-semibold mb-2">서울외곽순환도로 쉼터 추천</h4>
              <p className="text-sm text-gray-600 mb-3">
                서울외곽순환도로에서 가장 깨끗하고 편리한 쉼터를 소개합니다...
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>👍 18</span>
                <span>💬 5</span>
                <span>5시간 전</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm text-green-600 font-medium">노하우</span>
              </div>
              <h4 className="font-semibold mb-2">연비 개선 팁 공유</h4>
              <p className="text-sm text-gray-600 mb-3">
                장거리 운행 시 연비를 개선할 수 있는 실용적인 팁들을 모았습니다...
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>👍 32</span>
                <span>💬 12</span>
                <span>1일 전</span>
              </div>
            </div>
          </div>
        </section>

        {/* 실시간 단속 정보 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">실시간 단속 정보</h3>
            <Link to="/map" className="text-blue-600 hover:text-blue-800">
              지도에서 보기 →
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-red-800">경부선 고속도로</h4>
                  <p className="text-sm text-red-600">서울 → 부산 방향, 2km 지점</p>
                </div>
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  진행중
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-yellow-800">영동선 고속도로</h4>
                  <p className="text-sm text-yellow-600">강릉 → 서울 방향, 15km 지점</p>
                </div>
                <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  예정
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">트럭터와 함께하는 기사님들</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1,234</div>
              <div className="text-gray-600">가입 기사</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">5,678</div>
              <div className="text-gray-600">총 게시글</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">12,345</div>
              <div className="text-gray-600">총 댓글</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">89</div>
              <div className="text-gray-600">등록 쉼터</div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">트럭터</h4>
              <p className="text-gray-300">
                화물차 기사들을 위한 운행기록 기반 커뮤니티 플랫폼
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/posts">커뮤니티</Link></li>
                <li><Link to="/map">지도</Link></li>
                <li><Link to="/ranking">랭킹</Link></li>
                <li><Link to="/missions">미션</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/faq">자주묻는질문</Link></li>
                <li><Link to="/terms">이용약관</Link></li>
                <li><Link to="/notifications">공지사항</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">계정</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/login">로그인</Link></li>
                <li><Link to="/register">회원가입</Link></li>
                <li><Link to="/me">마이페이지</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 트럭터. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
