const { Schema, model, default: mongoose } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

//User will have: username,
const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
    },
  },
  {
    // this second object adds: `createdAt`, `updatedAt`
    timestamps: true,
  }
);

userSchema.plugin(findOrCreate);
const User = model("User", userSchema);

module.exports = User;
