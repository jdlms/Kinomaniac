const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const likeSchema = new Schema({
  filmId: {
    type: Number,
    required: true,
  },
  likeCount: {
    type: Number,
    required: true,
  },
});

likeSchema.plugin(findOrCreate);
const Like = model("Like", likeSchema);
module.exports = Like;
