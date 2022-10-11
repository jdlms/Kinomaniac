const mongoose = require("mongoose");

const movie_schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  filmId: {
    type: Number,
    required: true,
  },
  watchList: {
    type: Boolean,
    required: true,
  },
  review: {
    type: String,
  },
});

const Movie = mongoose.model("movie", movie_schema);

module.exports = { Movie };
