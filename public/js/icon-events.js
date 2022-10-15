document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("m2-project JS imported successfully!");

    const icons = [...document.getElementsByClassName("action-icon-films")];
    icons.forEach((iconContainer) => {
      const [saveIcon, starIcon] = iconContainer.children;
      saveIcon.addEventListener("click", () => {
        console.log("saveIcon", iconContainer.dataset.movieId);
      });
      starIcon.addEventListener("click", () => {
        console.log("starIcon", iconContainer.dataset.movieId);
      });
    });
  },
  false
);
