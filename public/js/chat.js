//start chat
const popup = document.querySelector(".chat-popup");
const chatBtn = document.querySelector(".chat-btn");
const submitBtn = document.querySelector(".submit");
const chatArea = document.querySelector(".chat-area");
const inputElm = document.querySelector(".input-area input");

chatBtn.addEventListener("click", () => {
  popup.classList.toggle("show");
});
submitBtn.addEventListener("click", () => {
  console.log("Here");
  let userInput = inputElm.value;

  let myMessage = `<div class="out-msg">
              <span class="my-msg">${userInput}</span>
              <img src="/images/profile.png" class="avatar">
              </div>`;
  chatArea.insertAdjacentHTML("beforeend", myMessage);

  fetch("/chat/response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ msg: userInput }),
  })
    .then((res) => {
      return res.json();
      console.log(res.body);
    })

    .then((data) => {
      let resMessage = `<div class="income-msg">
            <img src="/images/profile.png" class="avatar">
            <span class="msg">${data}</span>
            </div>`;
      chatArea.insertAdjacentHTML("beforeend", resMessage);
      inputElm.value = "";
    })
    .catch((err) => {
      console.error(err);
    });
});
//end chat
