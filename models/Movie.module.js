const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const movieSchema = new Schema({
  filmId: {
    type: Number,
    required: true,
  },
  toWatchListCount: {
    type: Number,
    required: true,
  },
});

movieSchema.plugin(findOrCreate);
const Movie = model("Movie", MovieSchema);
module.exports = Movie;
