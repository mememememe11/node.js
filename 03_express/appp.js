const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan"); // Morgan 모듈 추가
const winston = require("winston"); // Winston 모듈 추가

const customerRoute = require("./routes/customer");
const productRoute = require("./routes/product");

const app = express(); // express서버의 instance생성.

// --- 로그 디렉토리 설정 및 생성 ---
const logDirectory = path.join(__dirname, "logs");
// logs 디렉토리가 없으면 생성
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// --- Morgan 설정 (HTTP 요청 로그) ---
// access.log 파일에 로그를 추가 모드(append mode)로 기록
const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);
// 'combined' 포맷으로 HTTP 요청 로그를 accessLogStream에 기록
app.use(morgan("combined", { stream: accessLogStream }));

// --- Winston 설정 (애플리케이션 로그) ---
const logger = winston.createLogger({
  level: "info", // 최소 기록 레벨 설정 (info, warn, error 등)
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss", // 타임스탬프 형식 지정
    }),
    winston.format.errors({ stack: true }), // 에러 발생 시 스택 트레이스 포함
    winston.format.splat(), // 문자열 보간을 위한 형식
    winston.format.json() // 로그를 JSON 형식으로 출력
  ),
  transports: [
    // 콘솔에 로그 출력 (개발 환경에서 유용)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // 콘솔 출력 시 색상 적용
        winston.format.simple() // 간단한 콘솔 형식
      ),
    }),
    // error.log 파일에 'error' 레벨 이상의 로그만 기록
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB (5 * 1024 * 1024 bytes)
      maxFiles: 5, // 최대 5개의 파일 유지 (로테이션)
      handleExceptions: true, // 처리되지 않은 예외도 기록
      json: true,
    }),
    // combined.log 파일에 모든 'info' 레벨 이상의 로그 기록
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
      json: true,
    }),
  ],
  // 처리되지 않은 예외(uncaughtException)를 별도 파일에 기록
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDirectory, "exceptions.log"),
    }),
  ],
});

// application/json 요청.
app.use(bodyParser.json());
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// 파일업로드. multer.
// 저장경로와 파일명 지정.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 저장경로.
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // 업로드 파일명.
    let fn = Buffer.from(file.originalname, "latin1").toString("utf-8");
    cb(null, Date.now() + "_" + fn); // 121212131_sample.jpg
  },
});
// Multer 인스턴스 생성.
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const mimetype = /jpg|jpeg|png|gif/.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    return cb(null, false);
  },
});
// 동일출처 원칙. // 모든 서버에서의 요청 허락.
app.use(cors());

app.get("/", (req, res) => {
  logger.info("GET / 요청이 들어왔습니다."); // Winston을 사용한 애플리케이션 로깅
  fs.readFile("./public/index.html", "utf-8", (err, data) => {
    if (err) {
      logger.error(`index.html 파일 읽기 오류: ${err.message}`); // 에러 로깅
      res.status(500).send("Internal Server Error"); // 에러 발생 시 500 응답
      return; // 응답 후 함수 종료
    }
    res.send(data);
  });
});

// 첨부파일 업로드 화면.
app.get("/upload", (req, res) => {
  logger.info("GET /upload 요청이 들어왔습니다.");
  fs.readFile("./public/upload.html", "utf-8", (err, data) => {
    if (err) {
      logger.error(`upload.html 파일 읽기 오류: ${err.message}`);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(data);
  });
});

// express에서 에러처리하는 미들웨어.
// 이 미들웨어는 모든 라우트 및 다른 미들웨어에서 발생한 에러를 catch
app.use((err, req, res, next) => {
  // Multer 에러 처리 (파일 크기 초과, 파일 타입 불일치 등)
  if (err instanceof multer.MulterError) {
    logger.warn(`Multer 에러 발생: ${err.message}`);
    return res.status(400).send(`파일 업로드 오류: ${err.message}`);
  } else if (err) {
    // 그 외 일반 에러 처리
    logger.error(`서버 에러 발생: ${err.stack}`); // 에러 스택 트레이스 기록
    return res.status(500).send("서버 내부 오류가 발생했습니다.");
  }
  next(); // 다음 미들웨어로 제어 전달 (이 경우, 에러가 없으면 실행되지 않음)
});

// 첨부처리.
app.post("/upload", upload.array("myFile"), (req, res) => {
  logger.info("POST /upload 요청이 들어왔습니다.");
  logger.info("업로드된 파일 정보:", req.files); // 업로드된 파일의 정보.
  logger.info("요청 바디 정보:", req.body); // 요청몸체의 정보.

  if (!req.files || req.files.length === 0) {
    logger.warn("업로드된 파일이 없습니다.");
    res.status(400).send("이미지 파일이 필요합니다."); // 파일이 없는 경우 400 Bad Request
  } else {
    logger.info("파일 업로드 완료.");
    res.status(200).send("업로드 완료");
  }
});

// 동일출처원칙.
app.get("/getCors", (req, res) => {
  logger.info("GET /getCors 요청이 들어왔습니다.");
  let result = { id: "user01", name: "Hong" };
  res.json(result);
});

// bodyParser를 활용해서 요청정보의 body정보를 해석.
app.post("/json-data", (req, res) => {
  logger.info("POST /json-data 요청이 들어왔습니다.");
  logger.info("JSON 요청 바디:", req.body);
  res.send("json 요청");
});
app.post("/form-data", (req, res) => {
  logger.info("POST /form-data 요청이 들어왔습니다.");
  logger.info("Form-data 요청 바디:", req.body);
  res.send("form-data 요청");
});

// 라우팅정보를 파일로 분리.
app.use("/customer", customerRoute);
app.use("/product", productRoute);

app.listen(3000, () => {
  console.log("http://localhost:3000 서버실행.");
  logger.info("Express 서버가 http://localhost:3000 에서 실행 중입니다."); // 서버 시작 로깅
});
