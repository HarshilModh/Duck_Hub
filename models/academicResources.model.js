import mongoose from "mongoose";
import User from "./user.model.js";
import AdminTags from "./preDefinedTags.model.js";
import CategoryForAcademicResource from "./categoryForAcedmicResource.model.js";
const academicResourcesSchema = new mongoose.Schema(
  {
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
      ref: User.modelName,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: AdminTags.modelName,
      },
    ],
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
  reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User.modelName,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: CategoryForAcademicResource.modelName,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "reported", "removed"],
      default: "active",
    },
  },
  { timestamps: true }
);
const AcademicResource = mongoose.model(
  "AcademicResource",
  academicResourcesSchema
);
export default AcademicResource;
