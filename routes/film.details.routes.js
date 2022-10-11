const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
const { isLoggedIn } = require("../middlewares/auth.middlewares");

//require models
const { Movie } = require("../models/Movie.module");
//api key
const moviedb = new MovieDb(process.env.KEY);

router.get("/film-details/:id", async (req, res) => {
  try {
    const data = await moviedb.movieInfo({ id: req.params.id });

    Movie.countDocuments({ filmId: req.params.id }, function (err, count) {
      return count;
    });

    // if (count === 1) {
    //   console.log("hi");
    // }

    //construction of backdrop image url
    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.backdrop_sizes[1];
    data.first_url_string = configString;

    res.render("film-details", { data });
  } catch (error) {}
});

router.post("/film/:id/review", async (req, res) => {
  try {
    //need middleware to check if movie exists in db
    console.log(req.params.id);
    //if it doesn't already exist in db:
    const addMovieAndReveiw = new Movie({
      // userId: req.user.googleId,
      filmId: req.params.id,
      review: req.body.review,
    });
    await addMovieAndReveiw.save();
    res.redirect("back");
  } catch (error) {}
});

//to include in details page, from movieInfo api call: original_title, overview, poster_path, genres, tagline

//info to include that is not in movieInfo api call: random image from film (?), cast, crew, details (studio, country, language, length), themes (extension of genre tag), where to watch

module.exports = router;
// review: req.body.name,
