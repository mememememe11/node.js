const { members, add, getPerson } = require("./data.js");

console.log("hello, world");
let myName = "홍길동";
let age = 20;

if (age >= 20) {
  console.log(`${myName}은 성인`);
} else {
  console.log(`${myName}은 미성인`);
}

// console.log(members);
// console.log(add(10, 20));

members.forEach((item, idx) => {
  if (idx > 0) {
    console.log(item);
  }
}); // function(item, idx, array)

let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let result = [...arr1, ...arr2];
console.log(result);

// Object Destructuring
let { firstName, lastName, email } = getPerson(); // {fn, ln....}
console.log(firstName, lastName, email);

// Array Destructuring
function getScores() {
  return [70, 80, 90, 50, 60, 40];
}

let [x, y, ...z] = getScores();
// scoreAry[1]
console.log(x, y, z); // [90,60,50] => 90, 60, 50

function sumAry(...ary) {
  let sum = 0;
  for (let num of ary) {
    sum += num;
  }
  console.log(`합계: ${sum}`);
}
sumAry(1, 2, 3, 4, 5, 6, 7, 8);
