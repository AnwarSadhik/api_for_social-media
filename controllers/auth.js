import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createJwtToken } from "../utils/token.js";
import dotenv from "dotenv"
import otpModel from "../models/otp.js"
import { sendSMS,generateOTP } from "../helper/otp.js"

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { password, phone,name,email } = req.body;
    const nameExists = await User.findOne({ name: name})
    const emailExists = await User.findOne({ email: email})

    if (nameExists) return res.status(400).json({ message: "Username already taken." });
    if (emailExists) return res.status(400).json({ message: "Email is already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;

    // const otp = generateOTP(6);

    const newUser = await User.create({ ...req.body });

    res.status(200).json({
      type: "success",
      message: "Account created Successfully",
      data: {
        userId: newUser._id,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ type: "error", message: "This Email is not registered" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid password" });
    }

    const token = createJwtToken({ userId: user._id });
    res.status(200).json({ token: token, message: "Succesfull Login", data: { userId: user._id }});
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const loginWithPhone = async (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) {
        return res.status(400).json({ message: "enter a number"})
      }

      let user = await User.findOne({ phone: phone},{ isDeleted: false });
      if (!user) {
        return res.status(400).json({ message: "Phone number not registered" })
      }

      const otp = generateOTP(6);
      await sendSMS(user.phone,otp)
      let optDetails = new otpModel({
        userId: user._id,
        phone: phone,
        otp: otp
      })

      await optDetails.save().then(() => {
        user.verifyOtp = otp;
      })
      await user.save();
      return res.status(200).json({ message: "otp sent successfully", userId: user._id })

    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, userId } = req.body;
    const user = await User.findById(userId);
    if (user.verifyOtp !== otp) {
      return res.status(400).json({ type: "error", message: "Invalid OTP" });
    }
    const token = createJwtToken({ userId: user._id });
    res.status(200).json({ token: token, message: "Succesfull Login" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
