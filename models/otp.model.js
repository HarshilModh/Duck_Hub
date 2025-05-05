import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.model.js";
dotenv.config();

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
      maxLength: 50,
    },

    code: {
      type: String,
      required: true,
      length: 6,
    },

    attempts: {
      type: Number,
      default: 3,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: "10m", // auto-delete after 10 minutes
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
