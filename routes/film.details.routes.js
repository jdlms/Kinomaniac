const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//api key
const moviedb = new MovieDb(process.env.KEY);

router.get("/film-details/:id", async (req, res) => {
  try {
    const data = await moviedb.movieInfo({ id: req.params.id });
    console.log(data);

    res.render("film-details");
  } catch (error) {}
});

module.exports = router;
