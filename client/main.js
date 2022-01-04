import Ball from "./ball";
import Paddle from "./Paddle";
import "./style.css";
import boom from "./sounds/boom.wav";
import ride from "./sounds/ride.wav";
import openhat from "./sounds/openhat.wav";

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

document.documentElement.style.setProperty("--hue", Math.random() * 360);
const update = (time) => {
  if (computerPoint >= 5) {
    handleGameOver("Oops! You lost :(");
    return;
  } else if (playerPoint >= 5) {
    handleGameOver("Horray! You won :)");
    return;
  }

  if (lastTime) {
    const delta = time - lastTime;
    const hue = getComputedStyle(document.documentElement).getPropertyValue(
      "--hue"
    );
    document.documentElement.style.setProperty(
      "--hue",
      (parseFloat(hue) + 0.01 * delta) % 360
    );

    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);
    computerPaddle.update(delta, ball.x);
    hasLost() && handleLost();
  }
  lastTime = time;

  window.requestAnimationFrame(update);
};

const handleGameOver = (message) => {
  playerPoint = 0;
  computerPoint = 0;
  lastTime = null;
  playerScore.textContent = 0;
  computerScore.textContent = 0;
  startModal.classList.remove("close");
  startModal.querySelector("h1").textContent = message;
  startButton.textContent = "Replay";
  document.body.style.setProperty("cursor", "default");
};

const hasLost = () =>
  ball.rect().bottom >= window.innerHeight || ball.rect().top <= 0;

const handleLost = () => {
  const rect = ball.rect();
  if (rect.bottom >= window.innerHeight) {
    const audio = document.createElement("audio");
    audio.src = boom;
    audio.load();
    audio.volume = 0.5;
    audio.play();
    scores.classList.add("lost");
    removeClass("lost");
    computerScore.textContent = ++computerPoint;
  } else {
    const audio = document.createElement("audio");
    audio.src = ride;
    audio.load();
    audio.volume = 0.5;
    audio.play();
    scores.classList.add("won");
    removeClass("won");
    playerScore.textContent = ++playerPoint;
  }

  ball.reset();
  computerPaddle.reset();
};

const removeClass = (classToRemove) => {
  setTimeout(() => {
    scores.classList.remove(classToRemove);
  }, 800);
};

const startGame = () => {
  const audio = document.createElement("audio");
  audio.src = openhat;
  audio.load();
  audio.volume = 0.5;
  audio.play();
  startModal.classList.add("close");
  document.body.style.setProperty("cursor", "none");
  window.requestAnimationFrame(update);
};

startButton.addEventListener("click", startGame);
window.addEventListener("mousemove", (e) => {
  playerPaddle.position = (e.x / window.innerWidth) * 100;
});
