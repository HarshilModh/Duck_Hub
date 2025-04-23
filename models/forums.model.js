import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.model.js";
// import User from "./user.model";
dotenv.config();
const forumSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
      maxLength: 50,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxLength: 50,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    imageURLs: {
      type: [String], // Array of Cloudinary image URLs
      default: [],
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
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    status: {
      type: String,
      enum: ["active", "reported", "removed"],
      default: "active",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.modelName,
      },
    ],
  },
  { timestamps: true }
);

const Forum = mongoose.model("Forum", forumSchema);

export default Forum;
