const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
const { UserMovieData } = require("../models/UserMovieData.module");
const moviedb = new MovieDb(process.env.KEY);

//render film  page
router.get("/films", async (req, res) => {
  try {
    const data = await moviedb.trending({ media_type: "movie", time_window: "week" });
    data.results.splice(data.length - 2, 2);

    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[1];
    //map img link/string into each movie object
    data.results.map((movie) => (movie.first_url_string = configString));

    const usermoviedata = await UserMovieData.find({ userId: req.user?.googleId });
    const userMoviesById = usermoviedata.reduce((acc, val) => {
      acc[val.filmId] = val;
      return acc;
    }, {});

    res.render("film-search-page", {
      docTitle: "Kinomaniac - Films",
      data: data.results,
      userMoviesById,
    });
  } catch (error) {
    res.render("error");
    console.log("This error occurred: ", error);
  }
});

//film search
router.get("/film-search", async (req, res) => {
  try {
    //call movie data by title
    const data = await moviedb.searchMovie(req.query.name);
    //call config for img link/string construction
    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[2];
    //map img link/string into each movie object
    data.results.map((movie) => (movie.first_url_string = configString));
    //render results
    res.render("film-search-page", {
      docTitle: "Film Search",
      data: data.results,
    });
  } catch (error) {
    res.render("error");
    console.log("The error while searching artists occurred: ", error);
  }
});

module.exports = router;
