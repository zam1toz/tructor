import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function meta() {
  return [
    { title: "페이지를 찾을 수 없습니다 - 트럭터" },
    { name: "description", content: "존재하지 않는 페이지입니다." },
  ];
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8 text-center">
          요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.<br />
          주소를 다시 한 번 확인해 주세요.
        </p>
        <Link to="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
} 