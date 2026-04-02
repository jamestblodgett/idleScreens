// ===== Canvas Setup =====
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

const fireworks = [];
const particles = [];

// ===== Utility =====
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColor() {
  return `hsl(${Math.random() * 360}, 100%, 60%)`;
}

// ===== Firework Object =====
class Firework {
  constructor(x, y, targetY, color, type) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.speed = random(4, 7);
    this.color = color;
    this.type = type;
  }

  update() {
    this.y -= this.speed;

    if (this.y <= this.targetY) {
      explode(this.x, this.y, this.color, this.type);
      return true; // remove firework
    }
    return false;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - 2, this.y - 10, 4, 10);
  }
}

// ===== Particle Object =====
class Particle {
  constructor(x, y, color, size, speed, angle) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.speed = speed;
    this.angle = angle;
    this.alpha = 1;
    this.decay = random(0.01, 0.03);
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.alpha -= this.decay;
    return this.alpha <= 0;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// ===== Explosion Types =====
function explode(x, y, color, type) {
  let count = 50;

  if (type === "big") count = 120;
  if (type === "spark") count = 30;
  if (type === "white") color = "white";

  for (let i = 0; i < count; i++) {
    const angle = random(0, Math.PI * 2);
    const speed = random(1, type === "spark" ? 6 : 4);
    const size = random(2, type === "big" ? 4 : 3);

    particles.push(new Particle(x, y, color, size, speed, angle));
  }
}

// ===== Launch Firework =====
function launchFirework(type = "standard") {
  const x = random(100, canvas.width - 100);
  const y = canvas.height;
  const targetY = random(100, canvas.height / 2);
  const color = randomColor();

  fireworks.push(
    new Firework(
      x,
      y,
      targetY,
      color,
      type === "random" ? randomType() : type
    )
  );
}

function randomType() {
  const types = ["standard", "big", "spark", "white"];
  return types[Math.floor(Math.random() * types.length)];
}

// ===== Automatic Fireworks =====
setInterval(() => {
  launchFirework("random");
}, 1200);

// ===== Animation Loop =====
function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    if (fireworks[i].update()) fireworks.splice(i, 1);
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    if (particles[i].update()) particles.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

animate();

// ===== Fullscreen Hook =====
window.addEventListener("load", () => {
  if (typeof enableFullscreen === "function") {
    enableFullscreen(canvas, [
      document.getElementById("fullscreenBtn"),
      ...document.querySelectorAll(".firework-buttons button")
    ]);
  }
});