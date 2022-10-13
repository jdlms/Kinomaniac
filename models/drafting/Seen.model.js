const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

const seenSchema = new Schema({
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

seenSchema.plugin(findOrCreate);
const Seen = model("Seen", SeenSchema);
module.exports = Seen;
