const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
const { UserMovieData } = require("../models/UserMovieData.module");
const moviedb = new MovieDb(process.env.KEY);

router.get("/upcoming-films", (req, res) => {
  try {
    res.render("upcoming-page");
  } catch (error) {
    res.render("error");
    console.log("This error occurred: ", error);
  }
});

router.get("/upcoming/", async (req, res) => {
  try {
    const upcoming1 = await moviedb.upcomingMovies(req.query.region);
    const upcoming2 = await moviedb.upcomingMovies({ page: 2, region: req.query.region });
    const upcoming = [...upcoming1.results, ...upcoming2.results];

    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[0];
    //map img link/string into each movie object
    upcoming.map((movie) => (movie.first_url_string = configString));

    res.render("upcoming-page", { upcoming });
  } catch (error) {
    res.render("error");
    console.log("This error occurred: ", error);
  }
});

module.exports = router;
