import Ball from "./ball";
import Paddle from "./Paddle";
import "./style.css";

const ballInstance = document.querySelector("#ball");
const playerPaddleInstance = document.querySelector("#player-paddle");
const computerPaddleInstance = document.querySelector("#computer-paddle");
const scores = document.querySelector(".score-wrapper");
const startModal = document.querySelector(".start-modal");
const startButton = document.querySelector("button");
const playerScore = document.querySelector("#player-score");
const computerScore = document.querySelector("#computer-score");

const ball = new Ball(ballInstance);
const playerPaddle = new Paddle(playerPaddleInstance);
const computerPaddle = new Paddle(computerPaddleInstance);

let computerPoint = 0;
let playerPoint = 0;

let lastTime;
const update = (time) => {
  if (computerPoint >= 1) {
    handleGameOver();
    return;
  }
  if (lastTime) {
    const delta = time - lastTime;

    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.update(delta, ball.x);
    hasLost() && handleLost();
  }
  lastTime = time;

  window.requestAnimationFrame(update);
};

const handleGameOver = () => {
  playerPoint = 0;
  computerPoint = 0;

  startModal.classList.remove("close");
  startModal.querySelector("h1").textContent = "Oops! You lost :(";
  startButton.textContent = "Replay";
  document.body.style.setProperty("cursor", "default");
  // startButton.addEventListener("click", startGame);
};

const hasLost = () =>
  ball.rect().bottom >= window.innerHeight || ball.rect().top <= 0;

const handleLost = () => {
  const rect = ball.rect();
  if (rect.top <= 0) {
    scores.classList.add("won");
    removeClass("won");
    playerScore.textContent = ++playerPoint;
  } else {
    scores.classList.add("lost");
    removeClass("lost");
    computerScore.textContent = ++computerPoint;
  }

  ball.reset();
};

const removeClass = (classToRemove) => {
  setTimeout(() => {
    scores.classList.remove(classToRemove);
  }, 400);
};
const startGame = () => {
  playerScore.textContent = 0;
  computerScore.textContent = 0;
  startModal.classList.add("close");
  window.requestAnimationFrame(update);
  document.body.style.setProperty("cursor", "none");
};

startButton.addEventListener("click", startGame);
window.addEventListener("mousemove", (e) => {
  playerPaddle.position = (e.x / window.innerWidth) * 100;
});
