const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//middleware
const { isLoggedIn } = require("../middlewares/auth.middlewares");

//require models
const { UserMovieData } = require("../models/UserMovieData.module");
const { route } = require("./user.routes");
//api key
const moviedb = new MovieDb(process.env.KEY);

//view single review:
router.get("/film/:id/review", isLoggedIn, async (req, res) => {
  try {
    const data = await moviedb.movieInfo({ id: req.params.id });
    let userReviewArray = await UserMovieData.find({
      userId: req.user.googleId,
      filmId: req.params.id,
    });
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

    await UserMovieData.findOneAndUpdate(
      { userId: req.user.googleId, filmId: req.params.id },
      {
        userId: req.user.googleid,
        filmId: req.params.id,
        watchList: false,
        review: req.body.review,
        userName: req.user.displayName.split(" ")[0],
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
    await UserMovieData.findOneAndUpdate(
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
