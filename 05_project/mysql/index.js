const sql = require("mysql2");
const mysql = require("./product"); // {custList,}

const pool = sql.createPool({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.LIMIT,
});
//console.log(sql["productList"].query);
async function query(alias, values = [], where = "") {
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
