import mongoose from "mongoose";
import User from "./user.model.js";
import Tags from "./tags.model.js";

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: [
      {
        answer: { type: String, required: true, trim: true },
        votes: {
          type: Number,
          min: 0,
          default: 0,
        },
        voterId: [
          { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
        ],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
    },
    imageURLs: {
      type: [String],
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
    status: {
      type: String,
      enum: ["active", "reported", "removed"],
      default: "active",
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Tags.modelName,
      },
    ],
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.modelName,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
