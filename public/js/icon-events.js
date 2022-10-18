document.addEventListener(
  "DOMContentLoaded",
  () => {
    const icons = [...document.getElementsByClassName("action-icon-films")];
    icons.forEach((iconContainer) => {
      const [watchilstIcon, starIcon] = iconContainer.children;

      watchilstIcon.addEventListener("click", () => {
        fetch(`/film-details/${iconContainer.dataset.movieId}`, {
          method: "POST",
        }).then(function (response) {
          console.log(response);
        });

        console.log("watchlistIcon", iconContainer.dataset.movieId);
      });
      starIcon.addEventListener("click", () => {
        fetch(`/film-details/${iconContainer.dataset.movieId}/like`, {
          method: "POST",
        }).then(function (response) {
          console.log(response);
        });
        console.log("starIcon", iconContainer.dataset.movieId);
      });
    });
  },
  false
);
