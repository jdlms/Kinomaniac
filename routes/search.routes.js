const router = require("express").Router();

const { MovieDb } = require("moviedb-promise");

const moviedb = new MovieDb(process.env.KEY);

router.get("/films", (req, res) => {
  res.render("film-search-page", { docTitle: "Film Search" });
});

router.get("/film-search", async (req, res) => {
  try {
    const data = await moviedb.searchMovie(req.query.name);
    res.render("film-search-page", {
      docTitle: "Film Search",
      data: data.results,
    });

    // let listTitle = data.results.forEach(function (element) {
    //   return element.original_title;
    // });
    // console.log(list);
    console.log(data);

    // console.log(data.results);
  } catch (error) {
    res.render("error");
    console.log("The error while searching artists occurred: ", error);
  }
});

// const searchMovie = async (req) => {
//   const parameters = {
//     query: req.query.name,
//     page: req.query.page,
//   };
//   try {
//     const res = await moviedb.searchMovie(parameters);
//     console.log(res.results);
//   } catch (error) {
//     return newError(error);
//   }
// };

// moviedb
//   .searchMovie({ query: "Alien" })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch(console.error);

module.exports = router;
