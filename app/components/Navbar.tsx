import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  return (
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
  );
} 