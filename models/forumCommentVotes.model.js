import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.model.js";
import Comment from "./forumsComments.model.js";
dotenv.config();
const commentVotesSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
      maxLength: 50,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Comment.modelName,
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

const CommentVotes = mongoose.model("CommentVotes", commentVotesSchema);

export default CommentVotes;
