import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.model.js";
import Review from "./courseReviews.model.js";
dotenv.config();
const reviewVotesSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
      maxLength: 50,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Review.modelName,
      required: true,
      trim: true,
      maxLength: 50,
    },
    voteType: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true,
    },
  },
  { timestamps: true }
);

const ReviewVotes = mongoose.model("ReviewVotes", reviewVotesSchema);

export default ReviewVotes;
