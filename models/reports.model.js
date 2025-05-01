import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema(
  {
    /*
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    */
    reportedContentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "reportedContentType",
      required: true,
      trim: true,
    },
    reportedContentType: {
      type: String,
      required: true,
      enum: ["Forum", "Review", "AcademicResource"],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    },
    resolvedAt: {
      type: Date,
      default: Date.now,
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
  },
  { timestamps: true }
);
const Reports = mongoose.model("report", reportsSchema);
export default Reports;
