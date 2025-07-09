const sql = require("mysql2");
const mysql = require("./product"); // {custList,}

const pool = sql.createPool({
  //환경변수 db를 활용하기위함
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.LIMIT,
});
//console.log(sql["productList"].query);
async function query(alias, values = [], where = "") {
  // query라는 함수만듬 key를넣어주면 쿼리를실행 2번째매개값 value는 사용자등록같은값 3번째 매개값은 추가적인쿼리를 붙일때
  return new Promise((resolve, reject) => {
    console.log(mysql[alias].query + where);
    pool.query(mysql[alias].query + where, values, (err, result) => {
      if (err) {
        console.log("처리중 에러", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
} // end of query.

module.exports = {
  query,
};
