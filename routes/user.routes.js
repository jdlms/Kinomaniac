const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
//middleware
const { isLoggedIn } = require("../middlewares/auth.middlewares");
//api key
const moviedb = new MovieDb(process.env.KEY);
//require models
const { Movie } = require("../models/Movie.module");

//view user lists:
router.get("/lists", isLoggedIn, async (req, res) => {
  try {
    const watchlistMovies = await Movie.find({ userId: req.user.googleId, watchList: "true" });
    const reviewedMovies = await Movie.find({ userId: req.user.googleId, reviewed: "true" });
    console.log(reviewedMovies);
    // watchlist async map with Promise.all
    let watchlistIdArray = [];
    watchlistMovies.forEach((element) => watchlistIdArray.push(element.filmId));
    let watchlistIdRequests = watchlistIdArray.map(
      async (movieId) => await moviedb.movieInfo({ id: movieId })
    );
    const watchlistData = await Promise.all(watchlistIdRequests);

    //reviewed async map with Promise.all
    reviewedIdArray = [];
    reviewedMovies.forEach((element) => reviewedIdArray.push(element.filmId));
    let reviewedIdRequests = reviewedIdArray.map(
      async (movieId) => await moviedb.movieInfo({ id: movieId })
    );
    const reviewsData = await Promise.all(reviewedIdRequests);

    //image config:
    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[1];
    //add img url to data:
    watchlistData.map((movie) => (movie.first_url_string = configString));
    reviewsData.map((movie) => (movie.first_url_string = configString));

    res.render("user-lists-page", { docTitle: "Kinomaniac - Lists", watchlistData, reviewsData });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});


module.exports = router;
