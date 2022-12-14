const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
// const { isLoggedIn } = require("../middlewres/auth.middlewares");
const { UserMovieData } = require("../models/UserMovieData.module");
const moviedb = new MovieDb(process.env.KEY);

//view film details:
router.get("/film-details/:id", async (req, res) => {
  try {
    //api queries
    const promises = [
      moviedb.movieInfo({ id: req.params.id }),
      moviedb.movieCredits({ id: req.params.id }),
      UserMovieData.find({ filmId: req.params.id }),
      UserMovieData.find({
        filmId: req.params.id,
        reviewed: { $eq: true },
      }),
    ];
    const [data, data_credits, movieDataByUser, allUserReviewsForMovie] = await Promise.all(
      promises
    );

    //movie release date
    let date = new Date(data.release_date);
    let month = date.toLocaleString("default", { month: "long" });
    let year = date.toLocaleString("default", { year: "numeric" });
    data.monthAndYearOfRelease = `${month} ${year}`;

    const movieForCurrentUser =
      req.user &&
      (await UserMovieData.findOne({
        filmId: req.params.id,
        userId: req.user.googleId,
      }));

    //if user has reviewed movie, if so do not show review text box
    let viewReviewBox = !movieForCurrentUser?.reviewed;
    //if the movie is already 'liked' show unlike button
    let likeButton = !movieForCurrentUser?.liked;

    let watchlistButton = !movieForCurrentUser?.watchList;

    //if there are no reviews written, do not show user review box
    let userReviewsHeader = false;
    for (let movie of movieDataByUser) {
      if (movie.reviewed === true) userReviewsHeader = true;
    }

    //release year
    let releaseYear = data.release_date.slice(0, 4);
    data.releaseYear = releaseYear;

    //cast and director
    const cast = data_credits.cast.slice(0, 6);
    const [director] = data_credits.crew.filter((movie) => movie.job === "Director");

    //construction of backdrop image url
    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.backdrop_sizes[1];
    data.first_url_string = configString;

    res.render("film-details", {
      data,
      dbEntry: movieDataByUser,
      cast,
      director,
      likeButton,
      watchlistButton,
      viewReviewBox,
      userReviewsHeader,
      allUserReviewsForMovie,
    });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
