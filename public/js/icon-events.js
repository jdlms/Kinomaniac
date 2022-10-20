document.addEventListener(
  "DOMContentLoaded",
  () => {
    const icons = [...document.getElementsByClassName("action-icon-films")];
    icons.forEach((iconContainer) => {
      const [watchListIcon, starIcon] = iconContainer.children;
      if (!watchListIcon.contains("watched")) {
        watchListIcon.addEventListener("click", () => {
          fetch(`/film-details/${iconContainer.dataset.movieId}`, {
            method: "POST",
          }).then(function (response) {
            console.log(response);
          });
        });
      }
      if (!watchListIcon.contains("starred"))
        starIcon.addEventListener("click", () => {
          fetch(`/film-details/${iconContainer.dataset.movieId}/like`, {
            method: "POST",
          }).then(function (response) {
            console.log(response);
          });
        });
    });
  },
  false
);
