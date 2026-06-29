// Variables to control game state
let gameRunning = false;
let dropMaker;
let timerInterval;
let score = 0;
let timeLeft = 30;
let dropCount = 0;

const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");
const gameMessage = document.getElementById("game-message");

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

function startGame() {
  if (gameRunning) return;

  score = 0;
  timeLeft = 30;
  dropCount = 0;
  gameRunning = true;
  gameMessage.textContent = "";
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startButton.disabled = true;
  startButton.textContent = "Game in Progress";

  clearDrops();
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  dropMaker = setInterval(createDrop, 800);
  timerInterval = setInterval(updateTimer, 1000);
  createDrop();
}

function resetGame() {
  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  clearDrops();

  score = 0;
  timeLeft = 30;
  dropCount = 0;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  gameMessage.textContent = "";
  startButton.disabled = false;
  startButton.textContent = "Start Game";
}

function createDrop() {
  if (!gameRunning) return;

  dropCount += 1;
  const isBadDrop = dropCount % 5 === 0;

  const drop = document.createElement("div");
  drop.className = "water-drop";
  if (isBadDrop) {
    drop.classList.add("bad-drop");
  }

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;

  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * Math.max(0, gameWidth - size);
  drop.style.left = `${xPosition}px`;
  drop.style.top = "-20px";
  drop.style.animationDuration = "4s";

  drop.addEventListener("click", () => collectDrop(drop));
  gameContainer.appendChild(drop);

  drop.addEventListener("animationend", () => {
    if (drop.isConnected) {
      drop.remove();
    }
  });
}

function collectDrop(drop) {
  if (!gameRunning) return;

  drop.remove();
  if (drop.classList.contains("bad-drop")) {
    score = Math.max(0, score - 1);
  } else {
    score += 1;
  }
  scoreDisplay.textContent = score;
}

function updateTimer() {
  if (!gameRunning) return;

  timeLeft -= 1;
  timeDisplay.textContent = timeLeft;

  if (timeLeft <= 0) {
    endGame();
  }
}

function endGame() {
  if (!gameRunning) return;

  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timerInterval);
  clearDrops();

  startButton.disabled = false;
  startButton.textContent = "Play Again";
  showEndMessage();
}

function clearDrops() {
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());
}

function showEndMessage() {
  const winningMessages = [
    "Amazing work! You saved the day with a splash of kindness.",
    "Fantastic catch! Your compassion is making waves.",
    "You nailed it! Every drop counted.",
    "Incredible focus! You collected a heroic amount of water."
  ];

  const losingMessages = [
    "Nice effort! Keep practicing and try again.",
    "The drops are still falling—give it another try.",
    "Almost there! A few more catches and you'll win.",
    "You’re getting closer—try another round."
  ];

  const isWin = score >= 20;
  const messages = isWin ? winningMessages : losingMessages;
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  gameMessage.textContent = `${randomMessage} Final score: ${score}.`;
  gameMessage.classList.toggle("win-message", isWin);
  gameMessage.classList.toggle("lose-message", !isWin);
}

