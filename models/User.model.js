const { Schema, model } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

//User will have: username, 
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
