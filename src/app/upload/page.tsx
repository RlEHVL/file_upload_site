'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [programName, setProgramName] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) => 
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/octet-stream': ['.exe', '.zip', '.rar', '.7z', '.msi'],
      'application/zip': ['.zip'],
      'application/x-rar-compressed': ['.rar'],
      'application/x-7z-compressed': ['.7z'],
      'application/x-msi': ['.msi']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setErrorMessage('파일을 선택해주세요.');
      return;
    }

    if (!programName) {
      setErrorMessage('프로그램 이름을 입력해주세요.');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    
    // 실제 업로드 API 구현 시 여기에 코드 추가
    // 간단한 데모를 위해 타이머로 대체
    setTimeout(() => {
      setUploading(false);
      setSuccessMessage('프로그램이 성공적으로 업로드되었습니다!');
      // 폼 리셋
      setProgramName('');
      setDescription('');
      setVersion('');
      setFiles([]);
    }, 2000);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview || '');
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">프로그램 업로드</h1>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="program-name" className="block text-gray-700 font-medium mb-2">
            프로그램 이름 *
          </label>
          <input
            type="text"
            id="program-name"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="version" className="block text-gray-700 font-medium mb-2">
            버전
          </label>
          <input
            type="text"
            id="version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            설명
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 h-32"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            프로그램 파일 *
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-8 rounded-md text-center cursor-pointer ${
              isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'
            }`}
          >
            <input {...getInputProps()} />
            {files.length > 0 ? (
              <div>
                {files.map((file, index) => (
                  <div key={file.name} className="flex items-center justify-between p-2 border rounded mt-2">
                    <span>{file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            ) : isDragActive ? (
              <p>파일을 여기에 놓으세요...</p>
            ) : (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p>파일을 여기에 드래그하거나 클릭하여 업로드하세요</p>
                <p className="text-sm text-gray-500 mt-1">
                  (최대 1개 파일, 지원 형식: .exe, .zip, .rar, .7z, .msi)
                </p>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={uploading}
          className={`w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? '업로드 중...' : '프로그램 업로드'}
        </button>
      </form>
    </div>
  );
} 