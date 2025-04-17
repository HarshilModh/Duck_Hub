import mongoose from "mongoose";
import Department from "./department.model";
import Review from "./courseReviews.model";

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },
    courseName: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    courseDescription: {
      type: String,
      required: true,
      trim: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Department.modelName,
      required: true,
    },
    difficultyRating: {
      type: Number,
      min: 1,
      max: 3,
      required: true,
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Review.modelName,
      },
    ],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
