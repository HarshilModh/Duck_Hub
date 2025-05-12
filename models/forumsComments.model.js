import mongoose from "mongoose";
import User from "./user.model.js";
import Forum from "./forums.model.js";
// importing dotenv just in case we need it
import dotenv from "dotenv";
dotenv.config();

// schema for comments on the forums
const commentsSchema = new mongoose.Schema(
  {
    forumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Forum.modelName, // reference to the forum
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    // saw the note that this should be a string not array
    imageURLs: {
      type: [String],
      default: [], // empty string as default
    },
    upVotes: {
      type: Number,
      default: 0, // starting with 0 upvotes
      min: 0, // can't have negative upvotes
    },
    downVotes: {
      type: Number,
      default: 0, // starting with 0 downvotes
      min: 0, // can't have negative downvotes
    },
    commentFor: {
      type: String,
      enum: ["poll", "forum"],
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentsSchema);

export default Comment;
