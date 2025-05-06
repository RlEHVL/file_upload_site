import Link from 'next/link';

interface Program {
  id: string;
  name: string;
  description: string;
  version: string;
  downloadCount: number;
  publishedAt: string;
  fileSize: string;
}

// 예시 데이터
const programs: Program[] = [
  {
    id: '1',
    name: '사진 편집기',
    description: '간단한 사진 편집 프로그램입니다. 필터, 크기 조정, 회전 등 다양한 기능을 제공합니다.',
    version: '1.2.0',
    downloadCount: 1256,
    publishedAt: '2023-10-15',
    fileSize: '15.4 MB'
  },
  {
    id: '2',
    name: '파일 정리 도구',
    description: '하드 드라이브의 파일을 자동으로 정리하고 중복 파일을 찾아주는 도구입니다.',
    version: '2.0.1',
    downloadCount: 879,
    publishedAt: '2023-09-22',
    fileSize: '8.2 MB'
  },
  {
    id: '3',
    name: '미디어 플레이어',
    description: '다양한 형식의 비디오와 오디오 파일을 재생할 수 있는 미디어 플레이어입니다.',
    version: '3.5.2',
    downloadCount: 3542,
    publishedAt: '2023-08-05',
    fileSize: '22.7 MB'
  },
  {
    id: '4',
    name: '텍스트 에디터',
    description: '코드 편집에 최적화된 텍스트 에디터입니다. 구문 강조, 자동 완성 등의 기능을 제공합니다.',
    version: '1.8.0',
    downloadCount: 1823,
    publishedAt: '2023-11-01',
    fileSize: '12.1 MB'
  },
  {
    id: '5',
    name: 'PDF 변환기',
    description: '다양한 문서 형식을 PDF로 변환하거나 PDF를 다른 형식으로 변환할 수 있는 도구입니다.',
    version: '2.3.4',
    downloadCount: 2156,
    publishedAt: '2023-07-19',
    fileSize: '18.5 MB'
  }
];

export default function ProgramsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">프로그램 목록</h1>
        <Link href="/upload" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors">
          프로그램 업로드
        </Link>
      </div>
      
      <div className="grid gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">{program.name}</h2>
                  <p className="text-gray-600 mb-4">{program.description}</p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-4">
                    <div>
                      <span className="font-medium">버전:</span> {program.version}
                    </div>
                    <div>
                      <span className="font-medium">파일 크기:</span> {program.fileSize}
                    </div>
                    <div>
                      <span className="font-medium">등록일:</span> {program.publishedAt}
                    </div>
                    <div>
                      <span className="font-medium">다운로드:</span> {program.downloadCount}회
                    </div>
                  </div>
                </div>
                
                <a 
                  href={`/api/download/${program.id}`}
                  className="bg-primary-100 hover:bg-primary-200 text-primary-800 px-4 py-2 rounded-md flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  다운로드
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 