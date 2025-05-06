import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./user.model.js";
import AcademicResource from "./academicResources.model.js";
dotenv.config;
const academicResourceVoteSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
      maxLength: 50,
    },
    academicResourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: AcademicResource.modelName,
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

const AcademicResourceVotes = mongoose.model(
  "AcademicResourceVotes",
  academicResourceVoteSchema
);

export default AcademicResourceVotes;
