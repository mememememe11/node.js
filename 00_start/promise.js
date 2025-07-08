// promise.js
const promise = new Promise(function (resolve, reject) {
  let run = parseInt(Math.random() * 2); //
  // falsy => 0, null, "", undefied 이외에는 truty.
  setTimeout(function () {
    if (run) {
      resolve({ id: "user", name: "회원" });
    } else {
      reject(new Error("에러호출"));
    }
  }, 1000);
});

promise //
  .then(function (result) {
    console.log(result);
  })
  .catch(function (err) {
    console.log(err);
  });

// ajax call.
fetch(
  "https://charleslee-6617723.postman.co/workspace/3461b914-2d4f-41c9-8c64-f24308da11f5/request/45560951-edf6f244-dc04-42e6-a962-02a67c0332d1?action=share&source=copy-link&creator=45560951&ctx=documentation"
) //
  .then((json) => json.json()) //
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));
