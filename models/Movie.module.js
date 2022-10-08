const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const movieActionSchema = new Schema({
  filmId: {
    type: Number,
    required: true,
  },
  watchList: {
    type: Boolean,
    required: true,
  },
});

movieActionSchema.plugin(findOrCreate);
const MovieAction = model("MovieAction", movieActionSchema);
module.exports = MovieAction;
