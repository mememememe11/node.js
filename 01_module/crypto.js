// crypto.js
const crypto = require("crypto");

let pw = crypto.createHash("sha512").update("pw1234").digest("base64");
// console.log(pw);

// salting암호화.
const createSalt = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        reject(err);
      }
      resolve(buf.toString("base64"));
    });
  });
};

// createSalt() //
//   .then((result) => console.log(result));
// salt방식으로 암호화.
const createCryptoPassword = (plainPassword, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 10000, 64, "sha512", (err, key) => {
      if (err) {
        reject(err);
      }
      resolve({ salt: salt, password: key.toString("base64") });
    });
  });
};

// 패스워드 생성.
async function main() {
  const salt = await createSalt();
  const pw = await createCryptoPassword("1111", salt);
  console.log(pw);
}

main();
