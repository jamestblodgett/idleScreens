// Build and inject the navigation bar
function loadNavigation() {
  const current = window.location.pathname.split("/").pop();
  const index = idlePages.indexOf(current);

  const prev = idlePages[(index - 1 + idlePages.length) % idlePages.length];
  const next = idlePages[(index + 1) % idlePages.length];

  // Build center buttons
  let centerButtons = "";
idlePages.forEach(page => {
  const label = pageNames[page] || page; // fallback just in case

  centerButtons += `
    <button 
      class="nav-center-btn ${page === current ? "active" : ""}"
      onclick="location.href='${page}'"
    >
      ${label}
    </button>
  `;
});

  // Build full nav bar
  const navHTML = `
    <nav class="navbar">
      <button class="nav-arrow" onclick="location.href='${prev}'">&lt;</button>

      <div class="nav-center">
        ${centerButtons}
      </div>

      <button class="nav-arrow" onclick="location.href='${next}'">&gt;</button>
    </nav>
  `;

  // Insert at top of body
  document.body.insertAdjacentHTML("afterbegin", navHTML);
}

// Ordered list of all idle screens
const idlePages = [
  "index.html",
  "idleSquares.html",
  "idleBubbles.html",
  "idleFireworks.html",
  "idleFish.html"
];

// Human-friendly names for each page
const pageNames = {
  "index.html": "Home",
  "idleSquares.html": "Squares",
  "idleBubbles.html": "Bubbles",
  "idleFireworks.html": "Fireworks",
  "idleFish.html": "Fish"
};



// Game list
// List of all idle screens with metadata
const idleScreens = [
  {
    file: "idleSquares.html",
    name: "Squares",
    image: "images/squares.png"
  },
  {
    file: "idleBubbles.html",
    name: "Bubbles",
    image: "images/bubbles.png"
  },
  {
    file: "idleFireworks.html",
    name: "Fireworks",
    image: "images/fireworks.png"
  },
  {
    file: "idleFish.html",
    name: "Fish",
    image: "images/fish.png"
  }
];


function loadHomeButtons() {
  const container = document.getElementById("homeButtons");
  if (!container) return;

  let html = "";

  idleScreens.forEach(screen => {
    html += `
      <div class="home-button" onclick="location.href='${screen.file}'">
        <img src="${screen.image}" alt="${screen.name}">
        <p>${screen.name}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}