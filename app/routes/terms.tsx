import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { FileText, Shield, Users } from "lucide-react";
import Navbar from "../components/Navbar";

export function meta() {
  return [
    { title: "이용약관 - 트럭터" },
    { name: "description", content: "트럭터 이용약관 및 개인정보 처리방침" },
  ];
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">이용약관</h1>
          </div>
          <p className="text-gray-600">트럭터 서비스 이용에 관한 약관입니다.</p>
        </section>

        {/* 이용약관 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">제1조 (목적)</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              이 약관은 트럭터(이하 "회사")가 제공하는 화물차 기사 커뮤니티 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>1. "서비스"라 함은 회사가 제공하는 화물차 기사 커뮤니티 플랫폼을 의미합니다.</p>
              <p>2. "회원"이라 함은 회사의 서비스에 접속하여 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</p>
              <p>3. "게시물"이라 함은 회원이 서비스를 이용하면서 게시한 부호, 문자, 음성, 음향, 화상, 동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>1. 이 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.</p>
              <p>2. 회사는 필요한 경우 관련법령을 위배하지 않는 범위에서 이 약관을 변경할 수 있습니다.</p>
              <p>3. 약관이 변경되는 경우, 회사는 변경사항을 시행일자 7일 전부터 공지사항을 통해 공지합니다.</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공)</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>1. 회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>화물차 기사 커뮤니티 서비스</li>
                <li>운행 기록 및 지도 서비스</li>
                <li>쉼터 정보 공유 서비스</li>
                <li>단속 정보 제보 서비스</li>
                <li>게이미피케이션 서비스</li>
              </ul>
              <p>2. 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">제5조 (회원의 의무)</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>1. 회원은 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>허위 정보의 게시</li>
                <li>타인의 권리나 명예, 신용 등을 침해하는 행위</li>
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>불법적인 목적으로 서비스를 이용하는 행위</li>
                <li>기타 관련법령에 위배되는 행위</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 개인정보 처리방침 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">개인정보 처리방침</h2>
          </div>
          
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">1. 개인정보의 수집 및 이용목적</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>서비스 제공 및 운영</li>
                <li>회원 관리 및 서비스 이용에 따른 본인확인</li>
                <li>고객상담 및 불만처리</li>
                <li>서비스 개선 및 신규 서비스 개발</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">2. 수집하는 개인정보 항목</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>필수항목: 휴대폰 번호, 닉네임, 비밀번호</li>
                <li>선택항목: 프로필 정보, 위치 정보(서비스 이용 시)</li>
                <li>자동수집항목: IP 주소, 쿠키, 서비스 이용 기록</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보의 파기절차 및 방법</h3>
            <div className="space-y-2 text-gray-700 mb-6">
              <p>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>
            </div>
          </div>
        </section>

        {/* 문의 */}
        <section className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">문의사항</h2>
          <p className="text-gray-600 mb-4">
            약관에 대한 문의사항이 있으시면 언제든 연락해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/faq">
              <Button variant="outline">
                자주 묻는 질문
              </Button>
            </Link>
            <Button>
              고객센터 문의
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
} 