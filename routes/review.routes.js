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

    res.render("review-page", { data, userReview });
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

//post review:
router.post("/film/:id/review", isLoggedIn, async (req, res) => {
  // if (req.userStatus === "user") {
  try {
    await Movie.findOneAndUpdate(
      { userId: req.user.googleId, filmId: req.params.id },
      {
        userId: req.user.googleid,
        filmId: req.params.id,
        watchList: false,
        review: req.body.review,
        reviewed: true,
      },
      { upsert: true }
    );

    res.redirect("back");
  } catch (error) {
    res.render("error");
  }
  // } else {
  //   try {
  //     res.redirect("back");
  //   } catch (error) {}
  //   res.render("error");
  // }
});

//edit review
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
