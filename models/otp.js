import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },

    otp: String,

    phone: String,

    createdAt: { type: Date, expires: '20m', default: Date.now }

  },
);

export default mongoose.model("otpModel", commentSchema);
