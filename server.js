const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const archiver = require('archiver');

// 디버그 로그
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// 기본 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// 업로드 디렉토리 설정
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// 데이터 저장소
let programs = [];

// 홈페이지
app.get('/', (req, res) => {
  log('홈페이지 요청');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 단일 파일 업로드 설정
const fileUpload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.originalname}`;
      cb(null, filename);
    }
  }),
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

// 폴더 업로드 설정
const folderUpload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      try {
        // 새 프로그램 ID 생성
        if (!req.programId) {
          req.programId = Date.now().toString();
        }
        
        // 폴더 경로 생성
        const programDir = path.join(uploadDir, req.programId);
        if (!fs.existsSync(programDir)) {
          fs.mkdirSync(programDir, { recursive: true });
        }
        
        cb(null, programDir);
      } catch (err) {
        log(`폴더 생성 오류: ${err.message}`);
        cb(err);
      }
    },
    filename: function(req, file, cb) {
      // 원본 파일명 사용
      cb(null, file.originalname);
    }
  }),
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB
});

// API - 프로그램 목록
app.get('/api/programs', (req, res) => {
  log('프로그램 목록 요청');
  res.json(programs);
});

// API - 파일 업로드
app.post('/api/upload/file', (req, res) => {
  log('파일 업로드 요청 시작');
  
  fileUpload.single('file')(req, res, function(err) {
    if (err) {
      log(`파일 업로드 미들웨어 오류: ${err.message}`);
      return res.status(500).json({
        error: `파일 업로드 오류: ${err.message}`
      });
    }
    
    try {
      // 파일 확인
      if (!req.file) {
        log('업로드된 파일 없음');
        return res.status(400).json({ error: '파일이 없습니다' });
      }
      
      // 프로그램 이름 확인
      if (!req.body.name) {
        log('프로그램 이름 없음');
        return res.status(400).json({ error: '이름이 필요합니다' });
      }
      
      log(`파일 업로드 완료: ${req.file.originalname}, 크기: ${req.file.size} 바이트`);
      
      // 프로그램 정보 생성
      const newProgram = {
        id: Date.now().toString(),
        name: req.body.name,
        description: req.body.description || '',
        downloadCount: 0,
        publishedAt: new Date().toISOString().slice(0, 10),
        fileSize: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
        filename: req.file.filename,
        isFolder: false
      };
      
      // 프로그램 목록에 추가
      programs.unshift(newProgram);
      log(`파일 업로드 성공: ID ${newProgram.id}`);
      
      // 응답
      res.status(201).json(newProgram);
    } catch (error) {
      log(`파일 업로드 처리 오류: ${error.message}`);
      res.status(500).json({ error: `업로드 처리 오류: ${error.message}` });
    }
  });
});

// API - 폴더 업로드
app.post('/api/upload/folder', (req, res) => {
  log('폴더 업로드 요청 시작');
  
  folderUpload.array('files')(req, res, function(err) {
    if (err) {
      log(`폴더 업로드 미들웨어 오류: ${err.message}`);
      return res.status(500).json({
        error: `폴더 업로드 오류: ${err.message}`
      });
    }
    
    try {
      // 파일 확인
      if (!req.files || req.files.length === 0) {
        log('업로드된 파일 없음');
        return res.status(400).json({ error: '파일이 없습니다' });
      }
      
      // 프로그램 이름 확인
      if (!req.body.name) {
        log('프로그램 이름 없음');
        return res.status(400).json({ error: '이름이 필요합니다' });
      }
      
      // 프로그램 ID
      const programId = req.programId || Date.now().toString();
      log(`폴더 업로드 ID: ${programId}, 파일 수: ${req.files.length}`);
      
      // 총 크기 계산
      let totalSize = 0;
      req.files.forEach(file => {
        totalSize += file.size;
      });
      
      // 프로그램 정보 생성
      const newProgram = {
        id: programId,
        name: req.body.name,
        description: req.body.description || '',
        downloadCount: 0,
        publishedAt: new Date().toISOString().slice(0, 10),
        fileSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB',
        fileCount: req.files.length,
        folderPath: programId,
        isFolder: true
      };
      
      // 프로그램 목록에 추가
      programs.unshift(newProgram);
      log(`폴더 업로드 성공: ID ${newProgram.id}, 파일 ${req.files.length}개`);
      
      // 응답
      res.status(201).json(newProgram);
    } catch (error) {
      log(`폴더 업로드 처리 오류: ${error.message}`);
      res.status(500).json({ error: `업로드 처리 오류: ${error.message}` });
    }
  });
});

// API - 다운로드
app.get('/api/download/:id', (req, res) => {
  log(`다운로드 요청: ID ${req.params.id}`);
  
  // 프로그램 찾기
  const program = programs.find(p => p.id === req.params.id);
  if (!program) {
    log(`다운로드 오류: 프로그램 없음 (ID: ${req.params.id})`);
    return res.status(404).json({ error: '프로그램을 찾을 수 없습니다' });
  }
  
  try {
    if (program.isFolder) {
      log(`폴더 다운로드: ${program.name}`);
      
      // 폴더 경로 확인
      const folderPath = path.join(uploadDir, program.folderPath);
      if (!fs.existsSync(folderPath)) {
        log(`다운로드 오류: 폴더 없음 (경로: ${folderPath})`);
        return res.status(404).json({ error: '폴더를 찾을 수 없습니다' });
      }
      
      // ZIP 파일 생성
      const zipFileName = `${program.name}.zip`;
      const zipFilePath = path.join(uploadDir, zipFileName);
      
      // 기존 ZIP 파일 삭제
      if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
      }
      
      // ZIP 파일 생성
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });
      
      // 압축 완료 이벤트
      output.on('close', function() {
        log(`압축 완료: ${zipFilePath}, 크기: ${archive.pointer()} 바이트`);
        
        // 다운로드 카운트 증가
        program.downloadCount++;
        
        // 파일 다운로드
        res.download(zipFilePath, zipFileName, (err) => {
          if (err) {
            log(`다운로드 전송 오류: ${err.message}`);
          }
          
          // 임시 ZIP 파일 삭제
          setTimeout(() => {
            if (fs.existsSync(zipFilePath)) {
              fs.unlinkSync(zipFilePath);
              log(`임시 ZIP 파일 삭제: ${zipFilePath}`);
            }
          }, 5000); // 5초 후 삭제
        });
      });
      
      // 압축 오류 이벤트
      archive.on('error', function(err) {
        log(`압축 오류: ${err.message}`);
        res.status(500).json({ error: '폴더 압축 중 오류가 발생했습니다' });
      });
      
      // 압축 시작
      archive.pipe(output);
      archive.directory(folderPath, false);
      archive.finalize();
    } else {
      log(`파일 다운로드: ${program.name} (${program.filename})`);
      
      // 파일 경로 확인
      const filePath = path.join(uploadDir, program.filename);
      if (!fs.existsSync(filePath)) {
        log(`다운로드 오류: 파일 없음 (경로: ${filePath})`);
        return res.status(404).json({ error: '파일을 찾을 수 없습니다' });
      }
      
      // 다운로드 카운트 증가
      program.downloadCount++;
      
      // 파일 다운로드
      res.download(filePath, path.basename(program.filename));
    }
  } catch (error) {
    log(`다운로드 처리 오류: ${error.message}`);
    res.status(500).json({ error: `다운로드 처리 오류: ${error.message}` });
  }
});

// API - 삭제
app.delete('/api/program/:id', (req, res) => {
  log(`삭제 요청: ID ${req.params.id}`);
  
  // 프로그램 찾기
  const programIndex = programs.findIndex(p => p.id === req.params.id);
  if (programIndex === -1) {
    log(`삭제 오류: 프로그램 없음 (ID: ${req.params.id})`);
    return res.status(404).json({ error: '프로그램을 찾을 수 없습니다' });
  }
  
  const program = programs[programIndex];
  
  try {
    if (program.isFolder) {
      // 폴더 삭제
      const folderPath = path.join(uploadDir, program.folderPath);
      log(`폴더 삭제: ${folderPath}`);
      
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
      }
    } else {
      // 파일 삭제
      const filePath = path.join(uploadDir, program.filename);
      log(`파일 삭제: ${filePath}`);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    // 프로그램 목록에서 제거
    programs.splice(programIndex, 1);
    log(`프로그램 삭제 성공: ID ${req.params.id}`);
    
    res.json({ success: true, message: '프로그램이 삭제되었습니다' });
  } catch (error) {
    log(`삭제 처리 오류: ${error.message}`);
    res.status(500).json({ error: `삭제 처리 오류: ${error.message}` });
  }
});

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  log(`서버 오류: ${err.message}`);
  res.status(500).json({ error: err.message || '서버 오류가 발생했습니다' });
});

// 서버 시작
let server;
try {
  server = app.listen(port, () => {
    log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
  });
  
  // 오류 처리
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      log(`포트 ${port}가 이미 사용 중입니다. 다른 포트로 시도합니다...`);
      
      // 다른 포트로 시도
      const newPort = port + 1;
      server = app.listen(newPort, () => {
        log(`서버가 http://localhost:${newPort} 에서 실행 중입니다`);
      });
    } else {
      log(`서버 시작 오류: ${err.message}`);
      console.error(err);
    }
  });
} catch (err) {
  log(`서버 시작 중 치명적 오류: ${err.message}`);
  console.error(err);
}