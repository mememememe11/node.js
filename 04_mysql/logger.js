const winston = require("winston");
const { combine, timestamp, printf, colorize } = winston.format;

// 로그 형식 정의
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// 로거 인스턴스 생성
const logger = winston.createLogger({
  level: "info", // 기본 로그 레벨 설정 (info, warn, error, debug 등)
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    // 콘솔에 로그 출력
    new winston.transports.Console({
      format: combine(
        colorize(), // 콘솔 출력 시 색상 적용
        logFormat
      ),
    }),
    // 파일에 로그 출력 (daily rotate를 사용하면 더 좋지만 간단한 예제를 위해)
    new winston.transports.File({ filename: "error.log", level: "error" }), // 에러만 기록
    new winston.transports.File({ filename: "combined.log" }), // 모든 로그 기록
  ],
});

// 예제 로그 메시지
// logger.info("이것은 정보성 메시지입니다.");
// logger.warn("이것은 경고 메시지입니다.");
// logger.error("이것은 에러 메시지입니다.");
// logger.debug(
//   "이것은 디버그 메시지입니다. (기본 레벨이 info이므로 콘솔에는 출력되지 않음)"
// );

// 실제 사용 예시
function doSomething(data) {
  if (!data) {
    logger.error("doSomething 함수에 유효하지 않은 데이터가 전달되었습니다.");
    return;
  }
  logger.info(`doSomething 함수가 데이터 ${data}로 실행되었습니다.`);
  // ... 로직 처리
}

module.exports = { logger };
