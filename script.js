const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 100, paddleWidth = 10;
const player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const ai = { x: canvas.width - 20, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speedX: 3, speedY: 3 };

const maxScore = 5;
let gameStarted = false;
let gameOver = false;

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speedX *= -1;
  ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function resetGame() {
  player.score = 0;
  ai.score = 0;
  player.y = canvas.height / 2 - paddleHeight / 2;
  ai.y = canvas.height / 2 - paddleHeight / 2;
  gameOver = false;
  resetBall();
}

function startGame() {
  document.getElementById("bgMusic").play();
  document.getElementById("instructions").style.display = "none";
  gameStarted = true;
  gameLoop();
}

// Keyboard: arrow keys to move, R to restart
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    player.y = Math.max(player.y - 20, 0);
  }
  if (e.key === "ArrowDown") {
    player.y = Math.min(player.y + 20, canvas.height - paddleHeight);
  }
  if (e.key === "r" || e.key === "R") resetGame();
});

// Mouse movement to control paddle
canvas.addEventListener("mousemove", (e) => {
  if (!gameStarted || gameOver) return;
  const canvasRect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - canvasRect.top;
  player.y = Math.min(Math.max(mouseY - paddleHeight / 2, 0), canvas.height - paddleHeight);
});

// Touch support for mobile devices
canvas.addEventListener("touchstart", handleTouch);
canvas.addEventListener("touchmove", handleTouch);

function handleTouch(evt) {
  if (!gameStarted || gameOver) return;
  evt.preventDefault(); // prevent scrolling

  const touch = evt.touches[0];
  const canvasRect = canvas.getBoundingClientRect();
  const touchY = touch.clientY - canvasRect.top;

  player.y = Math.min(Math.max(touchY - paddleHeight / 2, 0), canvas.height - paddleHeight);
}

// Draw helpers
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

function drawText(text, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText(text, x, y);
}

function update() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Wall bounce
  if (ball.y < 0 || ball.y > canvas.height) ball.speedY *= -1;

  // Player collision
  if (
    ball.x - ball.radius < player.x + paddleWidth &&
    ball.y > player.y &&
    ball.y < player.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  // AI collision
  if (
    ball.x + ball.radius > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + paddleHeight
  ) {
    ball.speedX *= -1;
  }

  // Score check
  if (ball.x < 0) {
    ai.score++;
    resetBall();
  }

  if (ball.x > canvas.width) {
    player.score++;
    resetBall();
  }

  if (player.score === maxScore || ai.score === maxScore) {
    gameOver = true;
  }

  // AI movement
  ai.y += (ball.y - (ai.y + paddleHeight / 2)) * 0.03;
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#013220"); // green background
  drawRect(player.x, player.y, paddleWidth, paddleHeight, "white");
  drawRect(ai.x, ai.y, paddleWidth, paddleHeight, "white");
  drawCircle(ball.x, ball.y, ball.radius, "white");

  // Center net
  for (let i = 0; i < canvas.height; i += 20) {
    drawRect(canvas.width / 2 - 1, i, 2, 10, "gray");
  }

  drawText(player.score, canvas.width / 4, 40);
  drawText(ai.score, (3 * canvas.width) / 4, 40);

  if (gameOver) {
    const winner = player.score === maxScore ? "Player" : "Computer";
    drawText(`${winner} Wins! Press R to Restart`, canvas.width / 2 - 200, canvas.height / 2);
  }
}

function gameLoop() {
  if (gameStarted) {
    if (!gameOver) {
      update();
    }
    render();
    requestAnimationFrame(gameLoop);
  }
}
