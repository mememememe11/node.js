const url = new URL(
  "https://user:pass@sum.example.com:8080/a/b/c?query=name&num=1#node"
);
const url2 = require("url");

const params = url.searchParams;
console.log(params.get("query")); //
console.log(params.get("num"));

console.log(
  url2.parse(
    "https://user:pass@sum.example.com:8080/a/b/c?query=name&num=1#node"
  )
);
