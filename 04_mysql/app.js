const express = require("express"); //익스프레스 모듈을 가져옴
const bodyParser = require("body-parser"); //body parser modeul 설치
const multer = require("multer");
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
require("dotenv").config({ path: "./sql/.env" });
const nodemailer = require("./nodemailer");

console.log(process.env.HOST);
console.log(process.env.USER);

const mysql = require("./sql");

const app = express();
app.use(bodyParser.json()); //json이라는 메소드넣음

app.get("/", (req, res) => {
  //get방식 요청
  res.send("Root 경로");
});

// 이메일 전송
app.post("/email", async (req, res) => {
  try {
    let result = await nodemailer.sendEmail(req.body.param); //리퀘스트 바디에 param이라는 값을 넣어줘야함
    console.log(result);
    res.json({ retCode: "success", retVal: result });
  } catch (err) {
    res.json({ retCode: "fail" });
  }
});

//엑셀 업로드 -> db insert
// multer
//이메일 발송 화면
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //저장 경로
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // 업로드 파일명
    let fn = Buffer.from(file.originalname, "latin1").toString("utf-8");
    cb(null, Date.now() + "_" + fn); // 121212131_sample.jpg
    //Data.now 현재시간
  },
});
// Multer 인스턴스 생성
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//이메일 발송 화면
app.get("/excel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "excel.html")); //public 폴더밑 sendFile 절대경로
});

// 첨부처리
app.post("/excel", upload.single("myFile"), (req, res) => {
  console.log(req.file); // 업로드된 파일의 정보
  console.log(req.body); // 요청몸체의 정보
  const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
  const firstSheetName = workbook.SheetNames[0]; // 첫번째 시트
  //시트명으로 첫번째 시트가져오기
  const firstSheet = workbook.sheets[firstSheetName];
  //첫번째 시트의 데이터를 json으로 생성
  const firstSheetJson = xlsx.utils.sheet_to_json(firstSheet);
  console.log(firstSheetJson);
  // 반복문 활용 insert
  const fsj = firstSheetJson // [{a},{c},{k},{b}]
    .sort((a, b) => {
      return a.name < b.name;
    });

  fsj.forEach(async (customer) => {
    let result = await mysql.query("customerInsert", customer);
  });

  // 정렬된 배열을 다시 생성

  if ((!req, file)) {
    res.send("이미지 처리가능");
  } else {
    res.send("업로드 완료");
  }
});

//데이터 조회
app.get("/customers", async (req, res) => {
  try {
    let result = await mysql.query("customerList");
    res.send(result); // //처리된결과를 화면에 보여줌
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

// 추가
app.post("/customer", async (req, res) => {
  try {
    console.log(req.body.param);
    let data = req.body.param;
    let result = await mysql.query("customerInsert", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

// 수정
app.put("/customer", async (req, res) => {
  try {
    let data = req.body.param;
    let result = await mysql.query("customerUpdate", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

// 삭제 http://localhost:3000/customer/?id=8&name=Hong&pont=23
// 삭제 http://localhost:3000/customer/8/Hong/23
app.delete("/customer/:id/:name/:point", async (req, res) => {
  try {
    console.log(req.params);
    let { id } = req.params; // {id:8}
    let result = await mysql.query("customerDelete", id);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

app.listen(3000, () => {
  //3000번 포트를 실행시킴 호출되면 콘솔로그출력
  console.log("http://localhost:3000 running...!!!");
});

// let data = ["name01", "test@email.com", "010-1234-5678"];
// data = {
//   name: "username",
//   email: "user@email.com",
//   phone: "010-0101-0101",
//   address: "",
// };

// customers → Excel export
app.get("/excel/download", async (req, res) => {
  try {
    // DB에서 고객 리스트 조회
    let result = await mysql.query("customerList"); // 고객 목록 가져오기

    // 워크북, 워크시트 생성
    const wb = xlsx.utils.book_new(); // 새 엑셀 파일
    const ws = xlsx.utils.json_to_sheet(result); // JSON → 시트 변환

    // 워크북에 시트 추가
    xlsx.utils.book_append_sheet(wb, ws, "Customers");

    // 파일로 저장
    const filePath = "./downloads/customers.xlsx";
    xlsx.writeFile(wb, filePath); // 실제 파일 생성

    // 클라이언트에게 파일 전송
    res.download(filePath, "고객목록.xlsx", (err) => {
      if (err) {
        console.error("파일 다운로드 에러:", err);
        res.status(500).send("파일 다운로드 실패");
      } else {
        console.log("파일 다운로드 완료");
      }
    });
  } catch (err) {
    console.error("엑셀 다운로드 에러:", err);
    res.status(500).send("엑셀 다운로드 에러 발생");
  }
});

const xlsx = require("xlsx" - js - style);
const workbook = xlsx.utils.book_new();

const customers = [{ A: "고객명", B: "이메일", C: "연락처" }];
