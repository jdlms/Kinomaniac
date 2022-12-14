const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
//middleware
const { isLoggedIn } = require("../middlewares/auth.middlewares");
//api key
const moviedb = new MovieDb(process.env.KEY);
//require models
const { UserMovieData } = require("../models/UserMovieData.module");

//view user lists:
router.get("/lists", isLoggedIn, async (req, res) => {
  try {
    const watchlistMovies = await UserMovieData.find({
      userId: req.user.googleId,
      watchList: "true",
    });
    const reviewedMovies = await UserMovieData.find({
      userId: req.user.googleId,
      reviewed: "true",
    });
    const likedMovies = await UserMovieData.find({ userId: req.user.googleId, liked: "true" });

    // watchlist async map with Promise.all
    let watchlistIdArray = [];
    watchlistMovies.forEach((element) => watchlistIdArray.push(element.filmId));
    let watchlistIdRequests = watchlistIdArray.map(
      async (movieId) => await moviedb.movieInfo({ id: movieId })
    );
    const watchlistData = await Promise.all(watchlistIdRequests);

    //reviewed async map with Promise.all
    let reviewedIdArray = [];
    reviewedMovies.forEach((element) => reviewedIdArray.push(element.filmId));
    let reviewedIdRequests = reviewedIdArray.map(
      async (movieId) => await moviedb.movieInfo({ id: movieId })
    );
    const reviewsData = await Promise.all(reviewedIdRequests);

    //assemble liked movies
    let likedIdArray = [];
    likedMovies.forEach((element) => likedIdArray.push(element.filmId));
    let likedIdRequests = likedIdArray.map(
      async (movieId) => await moviedb.movieInfo({ id: movieId })
    );
    const likedMoviesData = await Promise.all(likedIdRequests);

    //image config:
    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[1];
    //add img url to data:
    watchlistData.map((movie) => (movie.first_url_string = configString));
    reviewsData.map((movie) => (movie.first_url_string = configString));
    likedMoviesData.map((movie) => (movie.first_url_string = configString));

    res.render("user-lists-page", {
      docTitle: "Kinomaniac - Lists",
      watchlistData,
      reviewsData,
      likedMoviesData,
    });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
