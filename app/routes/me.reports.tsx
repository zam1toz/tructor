import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { AlertTriangle, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

export function meta() {
  return [
    { title: "내 신고 - 트럭터" },
    { name: "description", content: "신고한 콘텐츠를 확인하세요" },
  ];
}

export default function MeReports() {
  // TODO: 실제 신고 데이터로 교체
  const reports = [
    {
      id: 1,
      type: "post",
      title: "부적절한 광고 게시글",
      content: "스팸성 광고가 포함된 게시글입니다...",
      status: "pending",
      date: "2024-01-15",
      reason: "스팸/광고"
    },
    {
      id: 2,
      type: "comment",
      title: "부적절한 댓글",
      content: "타인을 비방하는 내용의 댓글입니다...",
      status: "reviewed",
      date: "2024-01-14",
      reason: "비방/욕설"
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="h-4 w-4 text-yellow-600" />,
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
          icon: <Clock className="h-4 w-4 text-gray-600" />,
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
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">내 신고</h1>
          </div>
          <p className="text-gray-600">신고한 콘텐츠의 처리 상태를 확인하세요.</p>
        </section>

        {/* 신고 목록 */}
        <section className="space-y-4">
          {reports.map((report) => {
            const statusInfo = getStatusInfo(report.status);
            
            return (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-500">
                        {report.type === "post" ? "게시글" : "댓글"}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-gray-600 mb-3">{report.content}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>신고 사유: {report.reason}</span>
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {statusInfo.icon}
                        <span className="text-sm font-medium">{statusInfo.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {reports.length === 0 && (
          <section className="bg-white rounded-lg shadow-md p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">신고한 콘텐츠가 없습니다</h3>
            <p className="text-gray-600 mb-4">
              부적절한 콘텐츠를 발견하면 신고해 주세요.
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