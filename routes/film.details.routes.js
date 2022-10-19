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
    //dbquery
    let dbEntry = await Movie.find({ filmId: req.params.id });
    let reviewEntries = await Movie.find({ filmId: req.params.id }, { review: 1, reviewed: true });
    //if user has reviewed movie, if so do not show review text box
    let viewReviewBox = true;
    for (let movie of dbEntry) {
      if (movie.userId === req.user.googleId && movie.reviewed === true) viewReviewBox = false;
    }
    console.log(reviewEntries);
    let userReviewsHeader = false;
    for (let movie of reviewEntries) {
      if (movie.reviewed === true) userReviewsHeader = true;
    }

    console.log(reviewEntries);
    console.log(userReviewsHeader);

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

    res.render("film-details", { data, dbEntry, cast, director, viewReviewBox, userReviewsHeader });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

//genres, cast, direct, streaming locations, similar films

//to include in details page, from movieInfo api call: original_title, overview, poster_path, genres, tagline

//info to include that is not in movieInfo api call: random image from film (?), cast, crew, details (studio, country, language, length), themes (extension of genre tag), where to watch

module.exports = router;
