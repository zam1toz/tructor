import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { Shield, AlertTriangle, User, BarChart2, CheckCircle, XCircle } from "lucide-react";

export function meta() {
  return [
    { title: "관리자 대시보드 - 트럭터" },
    { name: "description", content: "신고 관리, 사용자 제재, 통계 등 관리자 기능" },
  ];
}

export default function AdminDashboard() {
  // TODO: 실제 관리자 데이터로 교체
  const reports = [
    {
      id: 1,
      type: "post",
      title: "부적절한 광고 게시글",
      status: "pending",
      date: "2024-01-15",
      reporter: "김기사"
    },
    {
      id: 2,
      type: "comment",
      title: "비방 댓글",
      status: "reviewed",
      date: "2024-01-14",
      reporter: "박기사"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
          text: "검토 중",
          color: "text-yellow-600 bg-yellow-100"
        };
      case "reviewed":
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          text: "처리 완료",
          color: "text-green-600 bg-green-100"
        };
      case "dismissed":
        return {
          icon: <XCircle className="h-4 w-4 text-red-600" />,
          text: "반려됨",
          color: "text-red-600 bg-red-100"
        };
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4 text-gray-600" />,
          text: "대기 중",
          color: "text-gray-600 bg-gray-100"
        };
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
              <Button variant="outline" size="sm">
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 관리자 대시보드 헤더 */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          </div>
          <p className="text-gray-600">신고 관리, 사용자 제재, 통계 등 관리자 기능을 제공합니다.</p>
        </section>

        {/* 신고 관리 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">신고 게시글 관리</h2>
          <div className="space-y-4">
            {reports.map((report) => {
              const statusInfo = getStatusInfo(report.status);
              return (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {statusInfo.icon}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                    <span className="text-gray-900 font-semibold">{report.title}</span>
                    <span className="text-gray-500">({report.type === "post" ? "게시글" : "댓글"})</span>
                    <span className="text-gray-400 text-xs">신고자: {report.reporter}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">숨기기</Button>
                    <Button size="sm" variant="outline">삭제</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 통계 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart2 className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">통계</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">1,234</div>
              <div className="text-sm text-gray-600">총 회원 수</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">5,678</div>
              <div className="text-sm text-gray-600">총 게시글</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-2">12,345</div>
              <div className="text-sm text-gray-600">총 댓글</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 