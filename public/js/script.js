document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("m2-project JS imported successfully!");
  },
  false
);

// toggle login button and user

const UserInfoBar = document.querySelector("#user-info");

hideLoginBtn.addEventListener("click", () => {
  hideBtn();
  console.log("hola");
});

function hideBtn() {
  UserInfoBar.remove("active");
  overlayPopup.classList.remove("active");
  hideScores.classList.remove("hidden");
}

hideLoginBtn