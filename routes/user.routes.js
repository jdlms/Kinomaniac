const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const { MovieDb } = require("moviedb-promise");
//api key
const moviedb = new MovieDb(process.env.KEY);
//require models
const { Movie } = require("../models/Movie.module");

router.get("/lists", isLoggedIn, async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.user.googleId });

    // async map with Promise.all:
    idArray = [];
    movies.forEach((element) => idArray.push(element.filmId));
    let movieIdRequests = idArray.map(async (movieId) => await moviedb.movieInfo({ id: movieId }));
    const data = await Promise.all(movieIdRequests);

    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[1];

    data.map((movie) => (movie.first_url_string = configString));
    console.log(data);
    res.render("user-lists-page", { docTitle: "Lists", data });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
