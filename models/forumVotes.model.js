import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.model.js";
import Forum from "./forums.model.js";
dotenv.config();
const forumVoteSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
      maxLength: 50,
    },
    forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Forum.modelName,
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

const ForumVotes = mongoose.model("ForumVotes", forumVoteSchema);

export default ForumVotes;
