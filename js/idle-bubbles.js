// ===== Canvas Setup =====
const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");

const bubbles = [];
const bubbleCount = 40;

let score = 0;

// ===== Score Display =====
function updateScoreDisplay() {
  const el = document.getElementById("bubbleScore");
  if (el) el.textContent = `Score: ${score}`;
}

// ===== Bubble Creation =====
function createBubble() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + Math.random() * 200,
    radius: 10 + Math.random() * 30,
    speed: 1 + Math.random() * 2,
    color: `hsla(${Math.random() * 360}, 70%, 70%, 0.6)`
  };
}

// Fill initial bubbles
for (let i = 0; i < bubbleCount; i++) {
  bubbles.push(createBubble());
}

// ===== Animation Loop =====
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let b of bubbles) {
    b.y -= b.speed;

    // Respawn bubble when it leaves the top
    if (b.y + b.radius < 0) {
      Object.assign(b, createBubble());
      b.y = canvas.height + b.radius;
    }

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = b.color;
    ctx.fill();
  }

  requestAnimationFrame(animate);
}

// ===== Click Detection =====
function getCanvasMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

// ===== Bubble Popping =====
canvas.addEventListener("click", (event) => {
  const mouse = getCanvasMousePos(event);

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    const dx = mouse.x - b.x;
    const dy = mouse.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= b.radius) {
      bubbles.splice(i, 1);
      bubbles.push(createBubble());

      score++;
      updateScoreDisplay();
      break;
    }
  }
});

// ===== Start =====
animate();
updateScoreDisplay();

// ===== Fullscreen Hook =====
window.addEventListener("load", () => {
  if (typeof enableFullscreen === "function") {
    enableFullscreen(canvas, [
      document.getElementById("fullscreenBtn"),
      document.getElementById("bubbleScore")
    ]);
  }
});