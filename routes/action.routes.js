const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//api key
const moviedb = new MovieDb(process.env.KEY);

//require models
const { movieAction } = require("../models/Movie.module");
//drafting:
// const { Like } = require("../models/Like.model");
// const { Review } = require("../models/Review.model");
// const { Seen } = require("../models/Seen.model");

//add to watch list
router.post("/film-details/:id", isLoggedIn, async (req, res) => {
  try {
 
    req.user;
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
