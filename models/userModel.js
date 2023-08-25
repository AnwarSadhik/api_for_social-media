import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be required"],
      trim: true,
      unique: [true, "Name must be unique"]
    },
    email: {
      type: String,
      required: [true, "Email must be provided"],
      unique: [true, "Email must be unique"],
    },
    phone: {
      type: String,
      // unique: [true, "Phone must be uniue"],
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    password: {
      type: String,
    },
    dob: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    locaion: String,
    geo: {
      lat: String,
      lng: String,
    },
    public_id: String,
    followers: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
      }
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],
    savedReels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reels"
      }
    ]
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
