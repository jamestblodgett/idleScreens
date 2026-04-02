// Ordered list of all idle screens
const idlePages = [
  "idle-squares.html",
  "idle-bubbles.html",
  "idle-fireworks.html"
];

// Helper: get current page index
function getCurrentPageIndex() {
  const current = window.location.pathname.split("/").pop();
  return idlePages.indexOf(current);
}

// Navigate to previous page
function goPrev() {
  const i = getCurrentPageIndex();
  const prev = (i - 1 + idlePages.length) % idlePages.length;
  window.location.href = idlePages[prev];
}

// Navigate to next page
function goNext() {
  const i = getCurrentPageIndex();
  const next = (i + 1) % idlePages.length;
  window.location.href = idlePages[next];
}




