import mongoose from "mongoose";
import User from "./user.model.js";
import Reports from "./reports.model.js";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
      unique: false,
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
      min: 1,
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
    isEdited: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
      required: true,
    },
    upVotes: {
      type: Number,
      min: 0,
      default: 0,
    },
    downVotes: {
      type: Number,
      min: 0,
      default: 0,
    },
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Reports.modelName,
      },
    ],
  },
  { timestamps: true }
);
// reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
