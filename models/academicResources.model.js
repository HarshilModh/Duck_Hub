import mongoose from "mongoose";

const academicResourcesSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxLength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    /*
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    */
    tags: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tags",
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
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "reported", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);
const academicResources = mongoose.model("Resources", academicResourcesSchema);
export default academicResources;
