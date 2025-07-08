const nodemailer = require("nodemailer");

const config = {
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: "tunaya1234@daum.net",
    pass: "iifenjwtuxoacspf",
  },
};

const sendEmail = async (data) => {
  //Promise 객체로 반환
  return new Promise(async (resolve, reject) => {
    let tp = nodemailer.createTransport(config);
    try {
      let result = await tp.sendMail(data);
      console.log("메일성공", result);
      resolve(result);
    } catch (err) {
      console.log("메일실패", err);
      reject(err);
    }
  });
};

module.exports = {
  sendEmail,
};

// tp.sendMail({
//   from: "bbtheory0325@daum.net",
//   to: "cholee@yedam.ac",
//   subject: "mail 연습",
//   text: "메일이 잘가는지 연습",
// });
