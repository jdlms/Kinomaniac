document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("m2-project JS imported successfully!");
  },
  false
);

// toggle login button and user

const UserInfoBar = document.querySelector("#user-info");
const loginBtn = document.querySelector("#login-btn");

loginBtn.addEventListener("click", () => {
  hideUserInfoBar();
  console.log("hola");
});

function hideUserInfoBar() {
  if(user === !isLoggedIn) {
    UserInfoBar.classList.toggle("hidden");
    loginBtn.classList.toggle("active");
  } else {
    UserInfoBar.classList.remove("hidden");
    loginBtn.classList.toggle("hidden");
  }
}
