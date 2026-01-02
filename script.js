let gameMode = "1p"; // "1p" or "2p"

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 100, paddleWidth = 10;
const paddleSpeed = 6;

const leftPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const rightPaddle = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, score: 0 };

const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speedX: 4, speedY: 3 };

const maxScore = 5;
let gameStarted = false;
let gameOver = false;

// -------- Controls (2P) --------
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

function goToHome() {
  gameStarted = false;
  gameOver = false;
  gameMode = "1p";

  const music = document.getElementById("bgMusic");
  music.pause();
  music.currentTime = 0;

  document.getElementById("instructions").style.display = "flex";

  leftPaddle.score = 0;
  rightPaddle.score = 0;

  leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
  rightPaddle.y = canvas.height / 2 - paddleHeight / 2;

  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  render(); // optional: redraw clean screen
}



document.addEventListener("keydown", (e) => {
  if (e.key === "w" || e.key === "W") wPressed = true;
  if (e.key === "s" || e.key === "S") sPressed = true;
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;

  if (e.key === "r" || e.key === "R") {
    goToHome();
  }
  
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "W") wPressed = false;
  if (e.key === "s" || e.key === "S") sPressed = false;
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});

// Mouse movement to control LEFT paddle (1P mode)
canvas.addEventListener("mousemove", (e) => {
  if (!gameStarted || gameOver) return;
  if (gameMode !== "1p") return;

  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddle.y = clamp(mouseY - paddleHeight / 2, 0, canvas.height - paddleHeight);
});

// Touch support for LEFT paddle (1P mode)
canvas.addEventListener("touchstart", handleTouch, { passive: false });
canvas.addEventListener("touchmove", handleTouch, { passive: false });

function handleTouch(evt) {
  if (!gameStarted || gameOver) return;
  if (gameMode !== "1p") return;

  evt.preventDefault();
  const touch = evt.touches[0];
  const rect = canvas.getBoundingClientRect();
  const touchY = touch.clientY - rect.top;
  leftPaddle.y = clamp(touchY - paddleHeight / 2, 0, canvas.height - paddleHeight);
}

// -------- Game Start --------
function startGame(mode) {
  if (gameStarted) return; // prevent multiple loops

  gameMode = mode;
  document.getElementById("instructions").style.display = "none";

  const music = document.getElementById("bgMusic");
  music.play().catch(() => {});

  resetGame();
  gameStarted = true;
  gameLoop();
}


// -------- Helpers --------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  // send ball toward whoever just got scored on (feels fair)
  ball.speedX = ball.speedX > 0 ? -4 : 4;
  ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function resetGame() {
  leftPaddle.score = 0;
  rightPaddle.score = 0;

  leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
  rightPaddle.y = canvas.height / 2 - paddleHeight / 2;

  gameOver = false;

  // reset ball direction randomly
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX = Math.random() > 0.5 ? 4 : -4;
  ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// -------- Update Paddles --------
function updatePaddles() {
  if (gameMode === "2p") {
    // Left paddle: W/S
    if (wPressed) leftPaddle.y -= paddleSpeed;
    if (sPressed) leftPaddle.y += paddleSpeed;

    // Right paddle: Arrow keys
    if (upPressed) rightPaddle.y -= paddleSpeed;
    if (downPressed) rightPaddle.y += paddleSpeed;
  } else {
    // 1P mode: Right paddle is AI
    const targetY = ball.y - paddleHeight / 2;
    const aiSpeed = paddleSpeed * 0.75;

    if (rightPaddle.y < targetY) rightPaddle.y += aiSpeed;
    if (rightPaddle.y > targetY) rightPaddle.y -= aiSpeed;
  }

  // clamp both paddles
  leftPaddle.y = clamp(leftPaddle.y, 0, canvas.height - paddleHeight);
  rightPaddle.y = clamp(rightPaddle.y, 0, canvas.height - paddleHeight);
}

// -------- Ball + Collision --------
function updateBall() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // top/bottom bounce
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.speedY *= -1;
  }

  // left paddle collision (with radius)
  if (
    ball.x - ball.radius <= leftPaddle.x + paddleWidth &&
    ball.x - ball.radius >= leftPaddle.x &&
    ball.y + ball.radius >= leftPaddle.y &&
    ball.y - ball.radius <= leftPaddle.y + paddleHeight &&
    ball.speedX < 0
  ) {
    ball.speedX *= -1;
  }

  // right paddle collision (with radius)
  if (
    ball.x + ball.radius >= rightPaddle.x &&
    ball.x + ball.radius <= rightPaddle.x + paddleWidth &&
    ball.y + ball.radius >= rightPaddle.y &&
    ball.y - ball.radius <= rightPaddle.y + paddleHeight &&
    ball.speedX > 0
  ) {
    ball.speedX *= -1;
  }

  // scoring
  if (ball.x + ball.radius < 0) {
    rightPaddle.score++;
    resetBall();
  }

  if (ball.x - ball.radius > canvas.width) {
    leftPaddle.score++;
    resetBall();
  }

  // game over
  if (leftPaddle.score >= maxScore || rightPaddle.score >= maxScore) {
    gameOver = true;
  }
}


// -------- Draw --------
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, size = 32) {
  ctx.fillStyle = "white";
  ctx.font = `${size}px Arial`;
  ctx.fillText(text, x, y);
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#013220");

  // net
  for (let i = 0; i < canvas.height; i += 20) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, "gray");
  }

  // paddles
  drawRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight, "white");
  drawRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight, "white");

  // ball
  drawCircle(ball.x, ball.y, ball.radius, "white");

  // scores
  drawText(leftPaddle.score, canvas.width / 4, 50);
  drawText(rightPaddle.score, (3 * canvas.width) / 4, 50);

  if (gameOver) {
    const leftName = "Player 1";
    const rightName = gameMode === "2p" ? "Player 2" : "Computer";
    const winner = leftPaddle.score >= maxScore ? leftName : rightName;
    
    // FIXED: Better text centering
    ctx.textAlign = "center";
    drawText(`${winner} Wins! Press R to Return to Menu`, canvas.width / 2, canvas.height / 2, 24);
    ctx.textAlign = "left"; // Reset alignment
  }
}

// -------- Loop --------
function gameLoop() {
  if (!gameStarted) return;

  if (!gameOver) {
    updatePaddles();
    updateBall();
  }
  render();

  requestAnimationFrame(gameLoop);
}
