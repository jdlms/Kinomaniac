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
    // const [{ test }] = data;
    // console.log(test);
    console.log(data);
    let userReviewArray = await Movie.find({ userId: req.user.googleId, filmId: req.params.id });
    let userReview = userReviewArray[0];

    res.render("review-page", { data, userReview });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

router.post("/film/:id/edit", isLoggedIn, async (req, res) => {
  try {
    await Movie.findOneAndUpdate(
      { userId: req.user.googleId, filmId: req.params.id },
      {
        review: req.body.review,
      },
      { upsert: true }
    );
    res.redirect("/lists");
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
