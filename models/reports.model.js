import mongoose from "mongoose";
import Forum from "./forums.model.js";
import Review from "./courseReviews.model.js";
import AcademicResource from "./academicResources.model.js";
import Poll from "./polls.model.js";
import User from "./user.model.js";

const reportsSchema = new mongoose.Schema(
  {
    forumId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Forum",
      default: null,
    },
    pollId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Poll",
      default: null,
    },
    reviewId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Review",
      default: null,
    },
    academicResourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "AcademicResource",
      default: null,
    },
    reportedContentType: {
      type: String,
      required: true,
      enum: ["Forum", "Poll", "Review", "AcademicResource"],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["under review", "resolved"],
      default: "under review",
    },
    resolvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const Reports = mongoose.model("report", reportsSchema);
export default Reports;
