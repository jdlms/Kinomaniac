const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//api key
const moviedb = new MovieDb(process.env.KEY);

//render film search page
router.get("/films", (req, res) => {
  res.render("film-search-page", { docTitle: "Film Search" });
});

//film search
router.get("/film-search", async (req, res) => {
  try {
    //call movie data by title
    const data = await moviedb.searchMovie(req.query.name);
    //call config for img link/string construction
    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[3];
    //map img link/string into each movie object
    data.results.map((movie) => (movie.first_url_string = configString));

    res.render("film-search-page", {
      docTitle: "Film Search",
      data: data.results,
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
