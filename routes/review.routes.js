const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//middleware
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const { userStatusCheck } = require("../middlewares/user.middlewares");

//require models
const { Movie } = require("../models/Movie.module");
const { route } = require("./user.routes");
//api key
const moviedb = new MovieDb(process.env.KEY);

//view single review:
router.get("/film/:id/review", async (req, res) => {
  const data = await moviedb.movieInfo({ id: req.params.id });
  res.render("review-page", data);
});

module.exports = router;
