const fs = require("fs");
const path = require("path");

// uploads 폴더 경로 설정 (프로젝트 루트 기준으로 설정)
const UPLOADS_DIR = path.join(__dirname, "uploads");

// .xlsx 파일 삭제 함수
const deleteExcelFiles = () => {
  console.log(`[${new Date().toLocaleString()}] .xlsx 파일 삭제 작업 시작...`);

  // uploads 폴더가 존재하는지 확인
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.warn(
      `[${new Date().toLocaleString()}] 경고: 'uploads' 폴더가 존재하지 않습니다. 생성 후 다시 시도하세요.`
    );
    return;
  }

  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      console.error(
        `[${new Date().toLocaleString()}] 'uploads' 폴더를 읽는 중 오류 발생:`,
        err
      );
      return;
    }

    const excelFiles = files.filter((file) => file.endsWith(".xlsx"));

    if (excelFiles.length === 0) {
      console.log(
        `[${new Date().toLocaleString()}] 삭제할 .xlsx 파일이 없습니다.`
      );
      return;
    }

    console.log(
      `[${new Date().toLocaleString()}] 다음 .xlsx 파일을 삭제합니다: ${excelFiles.join(
        ", "
      )}`
    );

    excelFiles.forEach((file) => {
      const filePath = path.join(UPLOADS_DIR, file);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            `[${new Date().toLocaleString()}] ${file} 삭제 중 오류 발생:`,
            unlinkErr
          );
        } else {
          console.log(`[${new Date().toLocaleString()}] ${file} 삭제 완료.`);
        }
      });
    });
  });
};

// console.log(
//   `[${new Date().toLocaleString()}] .xlsx 파일 삭제 Cron 작업이 스케줄링되었습니다. (매일 새벽 3시 30분, KST)`
// );
// console.log(`'uploads' 폴더에 .xlsx 파일을 생성하여 테스트해 보세요.`);

// 스크립트 시작 시 한 번 실행 (선택 사항)
// deleteExcelFiles();

module.exports = { deleteExcelFiles };
