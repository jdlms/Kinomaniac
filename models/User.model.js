const { Schema, model, default: mongoose } = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");

//User will have: username,
const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
    },
    toWatchList: {
      type: Array,
    },
    //drafting:
    //   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    //   review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    //   seen: [{ type: mongoose.Schema.Types.ObjectId, ref: "seen" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

userSchema.plugin(findOrCreate);
const User = model("User", userSchema);

module.exports = User;
