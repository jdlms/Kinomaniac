const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//api key
const moviedb = new MovieDb(process.env.KEY);

//render film search page
router.get("/films", async (req, res) => {
  try {
    const data = await moviedb.trending({ media_type: "movie", time_window: "week" });

    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[1];
    //map img link/string into each movie object
    data.results.map((movie) => (movie.first_url_string = configString));

    console.log(data);
    res.render("film-search-page", {
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
      user: req.user,
    });
    console.log(data);
  } catch (error) {
    res.render("error");
    console.log("The error while searching artists occurred: ", error);
  }
});

// const searchMovie = async (req) => {
//   const parameters = {
//     query: req.query.name,
//     page: req.query.page,
//   };
//   try {
//     const res = await moviedb.searchMovie(parameters);
//     console.log(res.results);
//   } catch (error) {
//     return newError(error);
//   }
// };

// moviedb
//   .searchMovie({ query: "Alien" })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch(console.error);

module.exports = router;
