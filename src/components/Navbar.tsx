import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          프로그램 공유 사이트
        </Link>
        <div className="flex space-x-4">
          <Link href="/" className="hover:text-primary-200">
            홈
          </Link>
          <Link href="/upload" className="hover:text-primary-200">
            업로드
          </Link>
          <Link href="/programs" className="hover:text-primary-200">
            프로그램 목록
          </Link>
        </div>
      </div>
    </nav>
  );
} 