const canvas = document.getElementById("fishCanvas");
const ctx = canvas.getContext("2d");

function animate() {
    drawBackground();
    drawBackStructures();

    fishList.forEach(f => {
        updateFish(f);
        drawFish(f);
    })
    drawFrontStructures();
    requestAnimationFrame(animate);
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#a0e9ff");
    gradient.addColorStop(1, "#0077b6");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const fishList = [];
const backStructures = [];
const frontStructures = [];
const centerpieceOptions = ["driftwood", "treasure", "bigRock"];

// ----------------------------------------------------
// FISH PERSONALITY DEFINITIONS
// ----------------------------------------------------
const fishTypes = {
    normal: {
        colors: ["#5f27cd", "#feca57", "#48dbfb"],
        speedRange: [1, 3],
        wiggleRange: [10, 20],
        turnBufferRange: [30, 140]
    },
    shy: {
        colors: ["#1dd1a1"],
        speedRange: [0.5, 1.2],
        wiggleRange: [5, 12],
        turnBufferRange: [10, 40],
        lowY: true,
        pauses: true
    },
    bold: {
        colors: ["#ff6b6b"],
        speedRange: [2, 4],
        wiggleRange: [20, 35],
        turnBufferRange: [60, 160]
    },
    lazy: {
        colors: ["#341f97"],
        speedRange: [0.4, 1],
        wiggleRange: [25, 40],
        turnBufferRange: [80, 200]
    },
    hyper: {
        colors: ["#feca57"],
        speedRange: [3, 6],
        wiggleRange: [5, 15],
        turnBufferRange: [5, 20],
        erratic: true
    },
    pair: {
        colors: ["#ff9ff3", "#00d2d3"],
        speedRange: [1, 2],
        wiggleRange: [10, 20],
        turnBufferRange: [20, 60],
        small: true,
        group: true
    },
    big: {
        colors: ["#10ac84"],
        speedRange: [0.5, 1.2],
        wiggleRange: [5, 10],
        turnBufferRange: [100, 200],
        big: true
    }
};

// ----------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randRange([min, max]) {
    return min + Math.random() * (max - min);
}

// ----------------------------------------------------
// CREATE FISH
// ----------------------------------------------------
function createFish(type = "normal", x, y) {
    const t = fishTypes[type];

    const speed = randRange(t.speedRange);
    const wiggle = randRange(t.wiggleRange);
    const turnBuffer = randRange(t.turnBufferRange);

    const startX = x ?? Math.random() * canvas.width;
    const startY = y ?? 80 + Math.random() * (canvas.height - 160);

    const fish = {
        type,
        x: startX,
        y: startY,

        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,

        baseY: startY,

        speed,
        wiggleStrength: wiggle,
        turnBuffer,

        direction: Math.random() < 0.5 ? -1 : 1,
        color: pick(t.colors),

        lowY: t.lowY || false,
        pauses: t.pauses || false,
        erratic: t.erratic || false,
        small: t.small || false,
        big: t.big || false,
        group: t.group || false
    };

    // Shy fish start lower
    if (t.lowY) {
        fish.baseY = canvas.height - 100 + Math.random() * 20;
        fish.y = fish.baseY;
    }

    // Normal fish start higher
    if (type === "normal" || type === "big" || type === "hyper" || type === "pair") {
        const highZone = 60 + Math.random() * (canvas.height * 0.3);
        fish.baseY = highZone;
        fish.y = highZone;
    }

    if (type === "bold") {
        const highZone = 130 + Math.random() * (canvas.height * 0.3);
        fish.baseY = highZone;
        fish.y = highZone;
    }


    return fish;
}

// ----------------------------------------------------
// ADD / REMOVE FISH BUTTONS
// ----------------------------------------------------
document.getElementById("addFishBtn").addEventListener("click", () => {
    const type = document.getElementById("fishTypeSelect").value;
    fishList.push(createFish(type));
});

document.getElementById("removeFishBtn").addEventListener("click", () => {
    if (fishList.length > 0) fishList.pop();
});

// ----------------------------------------------------
// INITIAL FISH SPAWN — 1 of each type + random extras
// ----------------------------------------------------
const allTypes = Object.keys(fishTypes);

// 1. Spawn at least one of each type
allTypes.forEach(type => {
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 160);
    fishList.push(createFish(type, x, y));
});

// 2. Spawn a random number of extra fish (0–30)
const extraCount = Math.floor(Math.random() * 5);

for (let i = 0; i < extraCount; i++) {
    const type = pick(allTypes); // random type
    const x = Math.random() * canvas.width;
    const y = 80 + Math.random() * (canvas.height - 160);
    fishList.push(createFish(type, x, y));
}

function adjustBrightness(hex, factor) {
    const num = parseInt(hex.slice(1), 16);
    let r = (num >> 16) + factor;
    let g = ((num >> 8) & 0xFF) + factor;
    let b = (num & 0xFF) + factor;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `rgb(${r}, ${g}, ${b})`;
}

function createStructure(x, y, type) {
    const structure = {
        x,
        y,
        type,
        size: 20 + Math.random() * 40,
        // Grass-specific properties
        blades: 7 + Math.floor(Math.random() * 4),
        height: 40 + Math.random() * 80,
        spread: 20 + Math.random() * 40,
        swayOffset: Math.random() * 1000
        // Sand-specific properties
        

    };

    if (type === "sand") {
        const sandPalette = [
            "#e5d6a7", // base sand
            "#d9c28f", // light tan
            "#e1cea8", // warm brown
            "#e6d6c5", // pale sand
            "#d3cab5"  // muted beige
        ];

        // Pick a base color
        const base = sandPalette[Math.floor(Math.random() * sandPalette.length)];

        // Random brightness shift (-20 to +20)
        const shift = Math.floor(Math.random() * 41) - 20;

        structure.color = adjustBrightness(base, shift);
    }

    if (type === "driftwood") {
        structure.height = 80 + Math.random() * 40;   // 80–120px tall
        structure.width = 20 + Math.random() * 10;    // 20–30px thick
        structure.lean = (Math.random() - 0.5) * 20;  // slight tilt
        structure.tipOffset = (Math.random() - 0.5) * 15; // sharp point variation
}

    if (type === "bigRock") {
        structure.height = 15 + Math.random() * 25;
        structure.width = 20 + Math.random() * 20;
        structure.tilt = (Math.random() - 0.5) * 10;
        structure.scale = 3 + Math.random() * 4;
    }

    if (type === "treasure") {
    structure.tilt = (Math.random() - 0.5) * 0.25;
    structure.scale = 2.5 + Math.random() * 0.5; // bigger chest
}


    // Only grass needs blade randomness
    if (type === "grass") {
        structure.bladeData = [];

        for (let i = 0; i < structure.blades; i++) {
            structure.bladeData.push({
                heightFactor: 0.7 + Math.random() * 0.6,   // random height
                curveFactor: 0.5 + Math.random() * 0.5,    // random bend
                width: 1.5 + Math.random() * 2.5,          // random thickness
                offset: (Math.random() - 0.5) * structure.spread // random X offset
            });
        }
    }

    return structure;
}

const chosenCenterpiece = centerpieceOptions[Math.floor(Math.random() * centerpieceOptions.length)];

const centerpiece = createStructure(
    canvas.width / 2 + (Math.random() * 200 - 100), // slight horizontal randomness
    canvas.height,
    chosenCenterpiece
);

// Back rocks + grass
// BACK LAYER — lots of sand, lots of grass, some rocks
for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height;

    const r = Math.random();

    if (r < 0.50) {
        backStructures.push(createStructure(x, y, "sand"));   // 50%
    } else if (r < 0.80) {
        backStructures.push(createStructure(x, y, "grass"));  // 30%
    } else {
        backStructures.push(createStructure(x, y, "rock"));   // 20%
    }
}

// FRONT LAYER — mostly grass, tiny bit of sand, tiny bit of rocks
for (let i = 0; i < 40; i++) {
    const x = Math.random() * canvas.width;
    const y = canvas.height;

    const r = Math.random();

    if (r < 0.75) {
        frontStructures.push(createStructure(x, y, "grass")); // 75%
    } else if (r < 0.90) {
        frontStructures.push(createStructure(x, y, "sand"));  // 15%
    } else {
        frontStructures.push(createStructure(x, y, "rock"));  // 10%
    }
}

function drawBackStructures() {
    backStructures.forEach(s => drawStructure(s));
}

function drawFrontStructures() {
    frontStructures.forEach(s => drawStructure(s));
}

function drawStructure(s) {
ctx.save();



if (s.type === "sand") {
    ctx.fillStyle = s.color;

    ctx.beginPath();
    ctx.ellipse(
        s.x,
        s.y,
        s.size * 2,
        s.size,
        0,
        0,
        Math.PI,
        true
    );
    ctx.fill();
}

if (s.type === "rock") {
    ctx.fillStyle = "#6e6e6e";
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, s.size, s.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
}

if (s.type === "grass") {
    ctx.strokeStyle = "#2e8b57";

    const sway = Math.sin(Date.now() * 0.0006 + s.swayOffset) * 6;

    for (let i = 0; i < s.bladeData.length; i++) {
        const b = s.bladeData[i];

        const bladeX = s.x + b.offset;
        const bladeHeight = s.height * b.heightFactor;
        const bladeCurve = sway * b.curveFactor;

        ctx.lineWidth = b.width;

        ctx.beginPath();
        ctx.moveTo(bladeX, s.y);
        ctx.quadraticCurveTo(
            bladeX + bladeCurve,
            s.y - bladeHeight * 0.5,
            bladeX,
            s.y - bladeHeight
        );
        ctx.stroke();
    }
}

if (s.type === "driftwood") {
    ctx.save();
    ctx.translate(s.x, s.y);

    ctx.fillStyle = "#5a3e2b";

    ctx.beginPath();

    // Bottom left
    ctx.moveTo(-s.width / 2, 0);

    // Left mid (70% up the trunk)
    ctx.lineTo(-s.width / 3 + s.lean, -s.height * 3);

    // Sharp tip (100% height)
    ctx.lineTo(s.tipOffset, -s.height*3.2);

    // Right mid (60% up the trunk)
    ctx.lineTo(s.width / 3 + s.lean, -s.height * 2.6);

    // Bottom right
    ctx.lineTo(s.width / 2, 0);

    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

if (s.type === "treasure") {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.tilt);
    ctx.scale(s.scale, s.scale);

    // Base box
    ctx.fillStyle = "#7a4a1e";
    ctx.fillRect(-20, -20, 40, 20);

    // Metal bands
    ctx.fillStyle = "#545454";
    ctx.fillRect(-20, -15, 40, 4);
    ctx.fillRect(-20, -5, 40, 4);

    // Curved lid
    ctx.fillStyle = "#523417";
    ctx.beginPath();
    ctx.moveTo(-20, -20);
    ctx.quadraticCurveTo(0, -45, 20, -20);
    ctx.lineTo(20, -25);
    ctx.quadraticCurveTo(0, -50, -20, -25);
    ctx.closePath();
    ctx.fill();

    // Gold spilling out
    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(0, -22, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

if (s.type === "bigRock") {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.scale(s.scale, s.scale);

    ctx.fillStyle = "#444444";
    ctx.beginPath();
    ctx.moveTo(-s.width / 2, 0);
    ctx.lineTo(s.tilt, -s.height);
    ctx.lineTo(s.width / 2, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}
ctx.restore();
}

backStructures.push(centerpiece);


// ----------------------------------------------------
// DRAW FISH
// ----------------------------------------------------
function drawFish(f) {
    ctx.save();

    // Size scaling based on personality
    let scale = 1;
    if (f.small) scale = 0.6;
    if (f.big) scale = 1.6;

    ctx.translate(f.x, f.y);
    if (f.direction === -1) ctx.scale(-1, 1);
    ctx.scale(scale, scale);

    ctx.fillStyle = f.color;

    // ----------------------------------------------------
    // BODY SHAPES (updated per your instructions)
    // ----------------------------------------------------
    ctx.beginPath();

    switch (f.type) {

        // NORMAL — same but sharper nose
        case "normal":
            ctx.moveTo(-25, 0);
            ctx.quadraticCurveTo(10, -31, 30, 0);   // sharper nose
            ctx.quadraticCurveTo(10, 25, -25, 0);
            break;

        // SHY — circle with a point at the back
        case "shy":
            ctx.moveTo(20, 0);
            ctx.arc(0, 0, 20, -10, Math.PI * 2);      // circle body
            ctx.lineTo(-30, 0);                     // point toward tail
            break;

        // BOLD — sharp front + sharp top, round bottom
        case "bold":
            ctx.moveTo(-25, 0);
            ctx.lineTo(-5, -20);
            ctx.lineTo(25, -25)
            ctx.quadraticCurveTo(20, 0, 25, 0)                    // sharp top
            ctx.quadraticCurveTo(15, 18, -25, 0);   // round bottom
            break;

        // LAZY — long, flat, rounded
        case "lazy":
            ctx.ellipse(-5, -2, 50, 8, 0, 1, Math.PI * 2);
            break;

        // HYPER — dart-like but round nose
        case "hyper":
            ctx.moveTo(-15, 0);
            ctx.quadraticCurveTo(15, -10, 20, 3);   // round nose
            ctx.quadraticCurveTo(10, 10, -15, 0);
            break;

        // PAIR — perfect as-is
        case "pair":
            ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
            break;

        // BIG — perfect as-is
        case "big":
            ctx.ellipse(0, 0, 40, 22, 0, 0, Math.PI * 2);
            break;

        default:
            ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI * 2);
            break;
    }

    ctx.fill();

    // ----------------------------------------------------
    // TAIL SHAPES (updated where needed)
    // ----------------------------------------------------
    ctx.beginPath();

    switch (f.type) {

        // NORMAL — unchanged
        case "normal":
            ctx.moveTo(-20, 0);
            ctx.lineTo(-43, -17);
            ctx.lineTo(-40, 15);
            ctx.closePath();
            break;

        // SHY — ordinary triangle tail
        case "shy":
            ctx.moveTo(-20, 0);
            ctx.lineTo(-35, -25);
            ctx.quadraticCurveTo(-33,0,-35,25)
            ctx.lineTo(-35,25);
            ctx.closePath();
            break;

        // BOLD — ordinary tail (per your request)
        case "bold":
            ctx.moveTo(-25, 0);
            ctx.quadraticCurveTo(-30, -33,-47, -16);
            ctx.lineTo(-48, 15);
            ctx.closePath();
            break;

        // LAZY — ovular tail
        case "lazy":
            ctx.moveTo(-65, -2);
            ctx.lineTo(-60, -12);
            ctx.ellipse(-60, -2, 10, 20, 0, -Math.PI / 2, Math.PI / 2);
            ctx.lineTo(-60, 8);
            ctx.closePath();
            break;

        // HYPER — tiny triangle tail
        case "hyper":
            ctx.moveTo(-25, 0);
            ctx.lineTo(-40, -8);
            ctx.lineTo(-40, 8);
            ctx.closePath();
            break;

        // PAIR — forked tail (unchanged)
        case "pair":
            ctx.moveTo(-25, 0);
            ctx.lineTo(-40, -10);
            ctx.lineTo(-35, 0);
            ctx.lineTo(-40, 10);
            ctx.closePath();
            break;

        // BIG — broad heavy tail (unchanged)
        case "big":
            ctx.moveTo(-45, 0);
            ctx.lineTo(-70, -20);
            ctx.lineTo(-70, 20);
            ctx.closePath();
            break;

        default:
            ctx.moveTo(-40, 0);
            ctx.lineTo(-60, -15);
            ctx.lineTo(-60, 15);
            ctx.closePath();
            break;
    }

    ctx.fill();

    // ----------------------------------------------------
    // EYE (same for all)
    // ----------------------------------------------------
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(10, -5, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(12, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// ----------------------------------------------------
// UPDATE FISH (PERSONALITY + MOVEMENT)
// ----------------------------------------------------
function updateFish(f) {

    // Shy fish stay low
    if (f.lowY) {
        const target = canvas.height - 100;
        f.baseY += (target - f.baseY) * 0.02;
    }

    // Shy fish pause
    if (f.pauses && Math.random() < 0.003) {
        f.vx *= 0.5;
        f.vy *= 0.5;
        return;
    }
    // Shy fish avoidance
    if (f.type === "shy") {
        let closest = null;
        let closestDist = Infinity;

        for (const other of fishList) {
            if (other == f) continue;

            const dx = f.x - other.x;
            const dy = f.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < closestDist) {
                closestDist = dist;
                closest = other;
            }
        }

        if (closest && closestDist < 100) {
            const dx = f.x - closest.x;
            const dy = f.y - closest.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const nx = dx / dist;
            const ny = dy / dist;

            const fleeStrength = (100 - closestDist) / 100 * 2;
            f.ax += nx * fleeStrength * 1.5;
            f.ay += ny * fleeStrength * 1.5;

            f.wiggleStrength += 0.5;

            if (nx > 0) {
                f.direction = 1;
            } else {
                f.direction = -1;
            }
        }
    }

    // Hyper fish erratic bursts
    if (f.erratic) {
        f.ax += (Math.random() - 0.5) * 1.2;
        f.ay += (Math.random() - 0.5) * 1.2;
    }

    // Pair fish group behavior
    if (f.group) {
        const neighbors = fishList.filter(o => o !== f && o.type === "pair");
        if (neighbors.length > 0) {
            const nearest = neighbors.reduce((a, b) =>
                Math.hypot(b.x - f.x, b.y - f.y) <
                Math.hypot(a.x - f.x, a.y - f.y)
                ? b : a
            );
            f.x += (nearest.x - f.x) * 0.02;
            f.y += (nearest.y - f.y) * 0.02;
        }
    }

    // Big fish wiggle less
    if (f.big) f.wiggleStrength *= 0.95;

    // Lazy fish wiggle more
    if (f.type === "lazy") f.wiggleStrength *= 1.02;

    // Base movement
    f.vx += f.ax;
    f.vy += f.ay;

    f.x += f.vx;
    f.y += f.vy;

    f.vx *= 0.9;
    f.vy *= 0.9;
    f.ax *= 0.8;
    f.ay *= 0.8;

    f.x += f.speed * f.direction;

    if (f.x > canvas.width - f.turnBuffer) f.direction = -1;
    if (f.x < f.turnBuffer) f.direction = 1;

    f.wiggleStrength += (20 - f.wiggleStrength) * 0.05;

    f.y = f.baseY + Math.sin(f.x * 0.01) * f.wiggleStrength;
}

// ----------------------------------------------------
// CLICK PUSH
// ----------------------------------------------------
function pushFish(f, clickX, clickY) {
    const dx = f.x - clickX;
    const dy = f.y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 120) {
        const force = (120 - dist) / 120;

        if ((clickX > f.x && f.direction === 1) ||
            (clickX < f.x && f.direction === -1)) {
            f.direction *= -1;
        }

        f.ax += (dx / dist) * force * 5;
        f.ay += (dy / dist) * force * 5;

        f.wiggleStrength = 40;
    }
}

canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    fishList.forEach(f => pushFish(f, clickX, clickY));
});

animate();