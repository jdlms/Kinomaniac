const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//api key
const moviedb = new MovieDb(process.env.KEY);

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const data = await moviedb.trending({ media_type: "movie", time_window: "week" });

    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[2];
    //map img link/string into each movie object
    data.results.map((movie) => (movie.first_url_string = configString));

    console.log(data);
    res.render("index", {
      docTitle: "Film Search",
      cssSheet: "film-search",
      data: data.results,
      user: req.user,
    });
  } catch (error) {
    res.render("error");
    console.log("The error while searching artists occurred: ", error);
  }
});

module.exports = router;
