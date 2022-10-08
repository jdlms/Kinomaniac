const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const reviewSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  filmId: {
    type: Number,
    required: true,
  },
  starsCount: {
    type: Number,
    required: true,
  },
  review: {
    type: string,
    required: true,
  },
});

reviewSchema.plugin(findOrCreate);
const Review = model("Review", likesSchema);
module.exports = Review;
