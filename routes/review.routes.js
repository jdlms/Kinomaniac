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
router.get("/film/:id/review", isLoggedIn, async (req, res) => {
  try {
    const data = await moviedb.movieInfo({ id: req.params.id });
    let userReviewArray = await Movie.find({ userId: req.user.googleId, filmId: req.params.id });
    let userReview = userReviewArray[0];
    console.log(userReview);
    console.log(data);
    res.render("review-page", { data, userReview });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
