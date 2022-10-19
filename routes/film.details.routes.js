const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
// const { isLoggedIn } = require("../middlewares/auth.middlewares");
const { userStatusCheck } = require("../middlewares/user.middlewares");
const { Movie } = require("../models/Movie.module");
const moviedb = new MovieDb(process.env.KEY);

//view film details:
router.get("/film-details/:id", async (req, res) => {
  try {
    //api queries
    const data = await moviedb.movieInfo({ id: req.params.id });
    const data_credits = await moviedb.movieCredits({ id: req.params.id });
    //dbqueries
    const dbEntry = await Movie.find({ filmId: req.params.id });
    const reviewEntries = await Movie.find(
      { filmId: req.params.id },
      { review: 1, reviewed: true }
    );
    //if user has reviewed movie, if so do not show review text box
    let viewReviewBox = true;
    for (let movie of dbEntry) {
      if (movie.userId === req.user.googleId && movie.reviewed === true) viewReviewBox = false;
    }

    //if there are no reviews written, do not show user review box
    let userReviewsHeader = false;
    for (let movie of reviewEntries) {
      if (movie.reviewed === true) userReviewsHeader = true;
    }

    //if the movie is already 'liked' show unlike button
    let likeButton = true;
    for (let movie of dbEntry) {
      if (movie.userId === req.user.googleId && movie.liked === true) likeButton = false;
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
      dbEntry,
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
