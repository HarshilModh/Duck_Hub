import mongoose from "mongoose";
import User from "./user.model.js";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      trim: true,
    },
    difficultyRating: {
      type: Number,
      min: 1,
      max: 3,
      required: true,
    },
    overallRating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "hidden"],
      default: "active",
    },
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "--FILL_HERE--", // TODO: Add report schema name here. // TASK FOR: Unknown
      },
    ],
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
