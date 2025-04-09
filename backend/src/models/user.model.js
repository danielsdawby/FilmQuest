import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
      minglenght: 6,
    },
    hoursWatched : {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
