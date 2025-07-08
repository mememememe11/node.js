const members = [
  { id: "guest", name: "손님" },
  { id: "user", name: "회원" },
  { id: "admin", name: "관리자" },
];

let add = (num1, num2) => num1 + num2;

let getPerson = () => {
  return {
    firstName: "John",
    lastName: "Doe",
    age: 37,
    email: "john@email.com",
  };
};

module.exports = { members, add, getPerson };
