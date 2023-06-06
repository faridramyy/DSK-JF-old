let countDownDate = new Date("Dec 31, 2023 23:59:59").getTime();

let counter = setInterval(() => {
  // Get Date Now
  let dateNow = new Date().getTime();

  // Find The Date Difference Between Now And Countdown Date
  let dateDiff = countDownDate - dateNow;

  let days = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((dateDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((dateDiff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((dateDiff % (1000 * 60)) / 1000);

  document.querySelector("#days").innerHTML =
    days < 10 ? `0${days}<br />Days` : `${days}<br />Days`;
  document.querySelector("#hours").innerHTML =
    hours < 10 ? `0${hours}<br />Hours` : `${hours}<br />Hours`;
  document.querySelector("#min").innerHTML =
    minutes < 10 ? `0${minutes}<br />Minutes` : `${minutes}<br />Minutes`;
  document.querySelector("#sec").innerHTML =
    seconds < 10 ? `0${seconds}<br />Seconds` : `${seconds}<br />Seconds`;
}, 1000);