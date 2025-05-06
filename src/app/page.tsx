import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center my-12">
        <h1 className="text-4xl font-bold mb-6">
          프로그램 업로드 및 공유 플랫폼
        </h1>
        <p className="text-xl mb-8">
          여러분의 소프트웨어를 쉽게 업로드하고 공유하세요.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/upload" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            지금 업로드하기
          </Link>
          <Link href="/programs" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors">
            프로그램 둘러보기
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl my-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">간편한 업로드</h3>
          <p className="text-gray-600">드래그 앤 드롭으로 쉽게 프로그램을 업로드하세요.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">손쉬운 다운로드</h3>
          <p className="text-gray-600">원하는 프로그램을 빠르게 다운로드하세요.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">쉬운 공유</h3>
          <p className="text-gray-600">링크 하나로 프로그램을 친구들과 공유하세요.</p>
        </div>
      </div>
    </div>
  );
} 