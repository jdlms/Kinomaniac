const mongoose = require("mongoose");

const user_movie_data_schema = new mongoose.Schema({
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
  },
  review: {
    type: String,
  },
  reviewed: {
    type: Boolean,
  },
  liked: {
    type: Boolean,
  },
});

user_movie_data_schema.index({ userId: 1, filmId: 1 }, { unique: true });

const UserMovieData = mongoose.model("usermoviedata", user_movie_data_schema);

module.exports = { UserMovieData: UserMovieData };
