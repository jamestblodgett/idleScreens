function enableFullscreen(canvas, uiElements = []) {
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const nav = document.querySelector(".navbar");

  if (!fullscreenBtn) return;

  let isFullscreen = false;

  function resizeCanvasToFullscreen() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function restoreCanvasSize() {
    canvas.width = 1000;
    canvas.height = 500;
  }

  function enterFullscreen() {
    isFullscreen = true;
    if (nav) nav.style.display = "none";

    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }

  function exitFullscreen() {
    isFullscreen = false;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  // The important fix is here:
  document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement !== null) {
      // ENTERED fullscreen
      if (nav) nav.style.display = "none";

      canvas.classList.add("fullscreen-canvas");
      resizeCanvasToFullscreen();

      uiElements.forEach(el => el.classList.add("fullscreen-ui"));
    } else {
      // EXITED fullscreen
      if (nav) nav.style.display = "flex";

      canvas.classList.remove("fullscreen-canvas");
      restoreCanvasSize();

      uiElements.forEach(el => el.classList.remove("fullscreen-ui"));
    }
  });

  fullscreenBtn.addEventListener("click", () => {
    if (!isFullscreen) enterFullscreen();
    else exitFullscreen();
  });
}