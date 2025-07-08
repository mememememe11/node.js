const mysql = require("mysql2");
const custSql = require("./customerSql"); // {custList,}

const pool = mysql.createPool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.LIMIT,
});

async function query(alias, values) {
  return new Promise((resolve, reject) => {
    pool.query(custSql[alias], values, (err, result) => {
      if (err) {
        console.log("처리중 에러", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
} // end of query.

module.exports = { query };
