const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//api key
const moviedb = new MovieDb(process.env.KEY);

router.get("/film-details/:id", async (req, res) => {
  try {
    const data = await moviedb.movieInfo({ id: req.params.id });
    console.log(data.original_language);
    res.render("film-details", { data });
  } catch (error) {}
});

//to include in details page, from movieInfo api call: original_title, overview, poster_path, genres, tagline

//info to include that is not in movieInfo api call: random image from film (?), cast, crew, details (studio, country, language, length), themes (extension of genre tag), where to watch

module.exports = router;
