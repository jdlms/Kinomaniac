const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const { MovieDb } = require("moviedb-promise");
//api key
const moviedb = new MovieDb(process.env.KEY);
//require models
const { Movie } = require("../models/Movie.module");

//add title  to watch list
router.post("/film-details/:id", isLoggedIn, async (req, res) => {
  try {
    const newMovieAction = new Movie({
      userId: req.user.googleId,
      filmId: req.params.id,
      watchList: true,
    });
    await newMovieAction.save();
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
// let attempt =  await Movie.find({ filmId: req.params.id })

module.exports = router;
