const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const { MovieDb } = require("moviedb-promise");
const moviedb = new MovieDb(process.env.KEY);
const { UserMovieData } = require("../models/UserMovieData.module");

//add title to watch list
router.post("/film-details/:id", isLoggedIn, async (req, res) => {
  try {
    await UserMovieData.findOneAndUpdate(
      { userId: req.user.googleId, filmId: req.params.id },
      { watchList: true },
      { upsert: true }
    );
    res.redirect("/films");
  } catch (error) {
    //if film already exists, redirect same as if it was sucessfully added
    if (error.code === 11000) {
      res.redirect("/films");
    } else {
      res.render("error");
      console.log(error);
    }
  }
});

//delete film from watchlist:
router.post("/films/watchlist/:id/delete", async (req, res) => {
  try {
    await UserMovieData.findOneAndDelete({ filmId: req.params.id });
    res.redirect("/lists");
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

//add film to like list
router.post("/film-details/:id/like", isLoggedIn, async (req, res) => {
  try {
    await UserMovieData.findOneAndUpdate(
      { userId: req.user.googleId, filmId: req.params.id },
      { liked: true },
      { upsert: true }
    );
    res.redirect("/films");
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

//unlike film
router.post("/film-details/:id/unlike", isLoggedIn, async (req, res) => {
  try {
    await UserMovieData.findOneAndUpdate(
      { userId: req.user.googleId, filmId: req.params.id },
      { liked: false },
      { upsert: true }
    );
    res.redirect("/films");
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
