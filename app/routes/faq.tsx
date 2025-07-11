import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { HelpCircle, ChevronDown, ChevronUp, Mail, Phone } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/Navbar";

export function meta() {
  return [
    { title: "자주 묻는 질문 - 트럭터" },
    { name: "description", content: "트럭터 서비스에 대한 자주 묻는 질문과 답변" },
  ];
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqData: FAQItem[] = [
    {
      question: "트럭터는 어떤 서비스인가요?",
      answer: "트럭터는 화물차 기사들을 위한 커뮤니티 플랫폼입니다. 운행 기록 관리, 쉼터 정보 공유, 단속 정보 제보, 게이미피케이션 등 다양한 서비스를 제공합니다."
    },
    {
      question: "회원가입은 어떻게 하나요?",
      answer: "홈페이지에서 '회원가입' 버튼을 클릭하신 후, 휴대폰 번호 인증을 거쳐 닉네임과 비밀번호를 설정하시면 됩니다. 간단한 절차로 가입이 가능합니다."
    },
    {
      question: "위치 정보는 필수인가요?",
      answer: "위치 정보는 서비스 이용을 위해 필요하지만, 사용자가 선택적으로 제공할 수 있습니다. 지도 서비스와 쉼터 정보 제공을 위해 사용됩니다."
    },
    {
      question: "운행 기록은 어떻게 저장되나요?",
      answer: "앱을 통해 운행 시작과 종료를 기록하면 자동으로 저장됩니다. 운행 경로, 시간, 거리 등이 자동으로 계산되어 저장되며, 필요시 수동으로 편집할 수 있습니다."
    },
    {
      question: "단속 정보는 어떻게 제보하나요?",
      answer: "지도에서 해당 위치를 선택한 후 '단속 제보' 버튼을 클릭하시면 됩니다. 단속 유형, 시간, 상세 정보를 입력하여 다른 기사들과 공유할 수 있습니다."
    },
    {
      question: "포인트는 어떻게 적립하나요?",
      answer: "운행 기록 작성, 쉼터 정보 제보, 단속 정보 제보, 커뮤니티 활동 등을 통해 포인트를 적립할 수 있습니다. 적립된 포인트는 다양한 혜택으로 사용 가능합니다."
    },
    {
      question: "개인정보는 안전한가요?",
      answer: "네, 회사는 개인정보보호법을 준수하여 회원의 개인정보를 보호합니다. 암호화 기술을 사용하여 안전하게 저장하고, 제3자에게 제공하지 않습니다."
    },
    {
      question: "서비스 이용료는 있나요?",
      answer: "기본 서비스는 무료로 제공됩니다. 일부 프리미엄 기능이나 추가 서비스는 유료일 수 있으며, 해당 경우 사전에 안내드립니다."
    },
    {
      question: "계정을 삭제하려면 어떻게 해야 하나요?",
      answer: "마이페이지에서 '계정 삭제' 메뉴를 통해 삭제할 수 있습니다. 삭제 시 모든 데이터가 영구적으로 삭제되므로 신중하게 결정해 주세요."
    },
    {
      question: "기술적 문제가 발생하면 어떻게 해야 하나요?",
      answer: "앱 내 '고객센터' 메뉴를 통해 문의하거나, 이메일로 연락해 주시면 빠르게 해결해 드리겠습니다."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 섹션 */}
        <section className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">자주 묻는 질문</h1>
          </div>
          <p className="text-gray-600">트럭터 서비스에 대한 자주 묻는 질문과 답변을 확인하세요.</p>
        </section>

        {/* FAQ 목록 */}
        <section className="bg-white rounded-lg shadow-md overflow-hidden">
          {faqData.map((item, index) => (
            <div key={index} className="border-b last:border-b-0">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* 추가 문의 */}
        <section className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">더 궁금한 점이 있으신가요?</h2>
          <p className="text-gray-600 mb-6 text-center">
            위의 FAQ에서 답변을 찾지 못하셨다면, 언제든 연락해 주세요.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">이메일 문의</h3>
              <p className="text-gray-600 mb-3">support@tructor.com</p>
              <p className="text-sm text-gray-500">24시간 내 답변</p>
            </div>
            <div className="text-center">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900 mb-2">전화 문의</h3>
              <p className="text-gray-600 mb-3">1588-0000</p>
              <p className="text-sm text-gray-500">평일 09:00-18:00</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link to="/terms">
              <Button variant="outline" className="mr-4">
                이용약관 보기
              </Button>
            </Link>
            <Link to="/">
              <Button>
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
} 