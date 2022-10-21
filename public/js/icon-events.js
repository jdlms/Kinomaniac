document.addEventListener(
  "DOMContentLoaded",
  () => {
    const icons = [...document.getElementsByClassName("action-icon-films")];
    icons.forEach((iconContainer) => {
      const [watchListIcon, starIcon] = iconContainer.children;
      //these if statements broke the clickListener, I could not get it working before presentation
      // if (!watchListIcon.contains("watched")) {
      watchListIcon.addEventListener("click", () => {
        console.log("hi!");
        fetch(`/film-details/${iconContainer.dataset.movieId}`, {
          method: "POST",
        }).then(function (response) {
          console.log(response);
        });
      });
      // }
      // if (!watchListIcon.contains("starred")) {
      starIcon.addEventListener("click", () => {
        fetch(`/film-details/${iconContainer.dataset.movieId}/like`, {
          method: "POST",
        }).then(function (response) {
          console.log(response);
        });
      });
      // }
    });
  },
  false
);
