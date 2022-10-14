const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");

//middleware
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const { userStatusCheck } = require("../middlewares/user.middlewares");

//require models
const { Movie } = require("../models/Movie.module");
//api key
const moviedb = new MovieDb(process.env.KEY);

//view film details:
router.get("/film-details/:id", async (req, res) => {
  try {
    //api query
    const data = await moviedb.movieInfo({ id: req.params.id });
    //dbquery
    let dbEntry = await Movie.find({ filmId: req.params.id }, { review: 1 });

    let viewReviewBox = true;
    if (dbEntry.length > 0) {
      viewReviewBox = false;
    }
    console.log(viewReviewBox);

    //construction of backdrop image url
    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.backdrop_sizes[1];
    data.first_url_string = configString;

    res.render("film-details", { data, dbEntry, viewReviewBox });
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

//genres, cast, direct, streaming locations, similar films

//to include in details page, from movieInfo api call: original_title, overview, poster_path, genres, tagline

//info to include that is not in movieInfo api call: random image from film (?), cast, crew, details (studio, country, language, length), themes (extension of genre tag), where to watch

module.exports = router;
