const router = require("express").Router();
const { MovieDb } = require("moviedb-promise");
const { UserMovieData } = require("../models/UserMovieData.module");
const moviedb = new MovieDb(process.env.KEY);

/* GET home page */
router.get("/", async (req, res, next) => {
  try {
    const data1 = await moviedb.trending({ media_type: "movie", time_window: "week" });
    const data2 = await moviedb.trending({ media_type: "movie", time_window: "week", page: 2 });

    const data = [...data1.results, ...data2.results];
    data.splice(data.length - 4, 4);

    const config = await moviedb.configuration();
    const configCall = config.images;
    const configString = configCall.base_url + configCall.poster_sizes[2];
    //map img link/string into each movie object
    data.map((movie) => (movie.first_url_string = configString));
    //get larger image for header
    const largerImg = configCall.base_url + configCall.backdrop_sizes[2];
    data.map((movie) => (movie.large_img_url_string = largerImg));

    //get random image from trending movies
    const randomMovieIndex = Math.floor(Math.random() * data.length);
    const randomMovie = data[randomMovieIndex];

    const usermoviedata = await UserMovieData.find({ userId: req.user?.googleId });
    const userMoviesById = usermoviedata.reduce((acc, val) => {
      acc[val.filmId] = val;
      return acc;
    }, {});

    res.render("index", {
      docTitle: "Kinomaniacs",
      data,
      randomMovie,
      userMoviesById,
    });
  } catch (error) {
    res.render("error");
    console.log("This error occurred: ", error);
  }
});

module.exports = router;
