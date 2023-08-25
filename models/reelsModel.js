
import mongoose from "mongoose";

const reelsModel = mongoose.Schema(
  {
    video: { type: String, requried: true },
    caption: { type: String, default: "" },
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Array,
        default: [],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timeStamps: true,
  }
);

export default mongoose.model("Reels", reelsModel);