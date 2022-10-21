const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
// const { isLoggedIn } = require("../middlewres/auth.middlewares");
const { UserMovieData: UserMovieData } = require("../models/UserMovieData.module");
const moviedb = new MovieDb(process.env.KEY);

//view film details:
router.get("/film-details/:id", async (req, res) => {
  try {
    //api queries
    const data = await moviedb.movieInfo({ id: req.params.id });
    const data_credits = await moviedb.movieCredits({ id: req.params.id });
    //dbqueries
    const movieDataByUser = await UserMovieData.find({ filmId: req.params.id });

    const movieForCurrentUser =
      req.user &&
      (await UserMovieData.findOne({
        filmId: req.params.id,
        userId: req.user.googleId,
      }));

    console.log(movieDataByUser);
    //if user has reviewed movie, if so do not show review text box
    let viewReviewBox = !movieForCurrentUser?.reviewed;
    //if the movie is already 'liked' show unlike button
    let likeButton = !movieForCurrentUser?.liked;

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
      viewReviewBox,
      userReviewsHeader,
    });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
