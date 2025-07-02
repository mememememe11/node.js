const { members, add } = require("./data.js");

console.log("hello,world");
let myName = "홍길동";
let age = 20;

if (age >= 20) {
  console.log(`${myName}은 성인`);
} else {
  console.log(`${myName}미성인`);
}

//console.log(members);
//console.log(add(10, 20));

members.forEach((item, idx) => {
  if (idx > 0) {
    console.log(item);
  }
});
// function(item, idx, array)
