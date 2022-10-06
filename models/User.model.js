const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
    },
    movies: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

userSchema.plugin(findOrCreate);

const User = model("User", userSchema);

module.exports = User;
