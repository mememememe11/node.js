const express = require("express");
const mysql = require("mysql2");
require("dotenv").config({ path: "./mysql/.env" });
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser"); // express app.post 사용시 포스트맨/ 지금 이 줄 코드도 같이사용
const { query } = require("./mysql/index.js");

const app = express(); // 인스턴스 생성

app.use(bodyParser.json({ limit: "10mb" }));
// 0709
app.use(cors()); // CORS 처리

// 0708 업로드 경로 확인
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  // D: //dev/git..../05_project/uploads
  fs.mkdirSync(uploadDir);
}

//이거 안쓰는디
//app.use(express.json({ limit: "10mb"}));

// body - parser
//app.use(express.json()); // 여기도 같이써야함

app.listen(3000, () => {
  // 3000포트
  console.log("npm install");
  console.log("http://localhost:3000");
});

app.get("/", (req, res) => {
  //get방식요청 들어오면 실행할 함수
  res.send("Root Router");
});

// 0708 index.html을 열어줘야함
app.get("/fileupload", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // const path = require("path");맨위 써야함
});

app.get("/download/:productId/:fileName", (req, res) => {
  //params는 productId 말하는것
  const { productId, fileName } = req.params;
  const filepath = `${__dirname}/uploads/${productId}/${fileName}`;
  //응답정보
  res.header(
    "Content-Type",
    `image/${fileName.substring(fileName.lastIndexOf("."))}`
  );
  fs.createReadStream(filepath).pipe(res);
  if (!fs.existsSync(filepath)) {
    res.send("파일이 없습니다");
  }
  fs.createReadStream(filepath).pipe(res);
  res.send("다운로드 완료");
});

// 0708 업로드 //업로드는 페이지만듬(폴더) // "/upload/:filename" << uploads 2/3 밑에 hong.png있음
app.post("/upload/:filename/:pid", (req, res) => {
  const { filename, pid } = req.params; // {filename: 'sample.jpg', product: 3} // params를 열어보면 이렇게 적혀있음
  //const filepath = path{__dirname}/uploads/${safeFilename}`; // d드라이브 - 05_project - uploads - sample.jpg
  let productDir = path.join(uploadDir, pid);
  if (!fs.existsSync(productDir)) {
    fs.mkdirSync(productDir);
  }

  const safeFilename = path.basename(filename); //경로공격
  const filePath = path.join(uploadDir, pid, safeFilename);
  try {
    let base64data = req.body.data;
    let data = req.body.data.slice(req.body.data.lastIndexOf(";base64,") + 8); //axios넘겨줄때 data 속성으로 넘기는걸 받는다
    // 전체값에서 base64부터 짤라냄 그걸 let "data" 에 담음
    fs.writeFile(filepath, data, "base64", (err) => {
      if (err) {
        res.send("error");
      } else {
        res.send("success");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).send("invalid data");
  }
});

// 데이터 쿼리

app.post("/api/:alias", async (req, res) => {
  //alias:productlist,productinsrt 등
  //   console.log(req.params.alias);
  //alias : 파라메타값
  // localhost:3000/api/productList <== 이 주소로 들어오면 리스트 Detail은 상세
  console.log(req.params.alias);
  console.log(req.body);
  //   console.log(req.body.where);

  const result = await query(
    req.params.alias,
    req.body.param.id,
    req.body.where
  );
  res.send(result);
});

// 0709 node
app.get("/todoList", async (req, res) => {
  const result = await query("todoList");
  console.log(result);
  res.json(result);
});

// todo 삭제
app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("todoDelete", req.params.id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});
