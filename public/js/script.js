document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("m2-project JS imported successfully!");
  },
  false
);

// toggle login button and user

const hideLoginBtn = document.querySelector("#login-btn");

hideLoginBtn.addEventListener("click", () => {
  hideBtn();
  console.log("hola");
});

function hideBtn() {
  openPopup.classList.remove("active");
  overlayPopup.classList.remove("active");
  hideScores.classList.remove("hidden");
  resetGame();
}

hideLoginBtn