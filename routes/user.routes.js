const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth.middlewares");
const { MovieDb } = require("moviedb-promise");
//api key
const moviedb = new MovieDb(process.env.KEY);
//require models
const { Movie } = require("../models/Movie.module");

router.get("/lists", isLoggedIn, async (req, res) => {
  try {
    const movies = await Movie.find({ userId: req.user.googleId });
    idArray = [];
    movies.forEach((element) => idArray.push(element.filmId));
    let promises = idArray.map(async (m) => {
      return await moviedb.movieInfo({ id: m });
    });

    for (const res of await Promise.all(promises)) console.log(promises);

    //  //simply iterate those
    //  //val will be the result of the promise not the promise itself
    //  for await (let val of promises){
    //     ....
    //  }

    // const data = await moviedb.movieInfo({ id: req.params.id });

    res.render("user-lists-page");
  } catch (error) {
    res.render("error");
    console.log(error);
  }
});

module.exports = router;
