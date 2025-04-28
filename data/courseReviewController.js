import mongoose from "mongoose";
import Course from "../models/courses.model.js";
import { getUserById } from "./userController.js";
import { getCourseById } from "./courseController.js";
import {
  calculateOverallRatings,
  isValidID,
  isValidNumber,
  isValidString,
} from "../utils/validation.utils.js";
import Review from "../models/courseReviews.model.js";
import ReviewVotes from "../models/reviewVotes.model.js";

//Create a new course review
export const createCourseReview = async (
  userId,
  courseId,
  difficultyRating,
  overallRating,
  review,
  isAnonymous
) => {
  try {
    userId = isValidID(userId, "UserID");

    const user = await getUserById(userId);

    courseId = isValidID(courseId, "CourseID");

    // Need to change the structure of the code in controller function
    let course = await getCourseById(courseId);

    let userReviews = await Review.exists({
      courseId: courseId,
      userId: userId,
    });

    if (userReviews) {
      throw new Error("Sorry, you can only post one review per course!");
    }

    let totalReviews = await Review.countDocuments({ courseId: courseId });

    if (difficultyRating == null) {
      throw new Error("You must provide a valid Difficulty Rating");
    }
    difficultyRating = isValidNumber(difficultyRating, "Difficulty Rating");
    if (difficultyRating < 1 || difficultyRating > 3) {
      throw new Error("Difficulty Rating must be between 1 & 3");
    }

    if (overallRating == null) {
      throw new Error("You must provide a valid Overall Rating");
    }
    overallRating = isValidNumber(overallRating, "Overall Rating");
    if (overallRating < 0 || overallRating > 5) {
      throw new Error("Overall Rating must be between 0 & 5");
    }

    if (!review) {
      throw new Error("A review must be passed");
    }
    review = isValidString(review, "Review");
    const newReview = new Review({
      userId,
      courseId,
      difficultyRating,
      overallRating,
      reports: [],
      review,
      isAnonymous: Boolean(isAnonymous),
    });

    const savedReview = await newReview.save();
    if (!savedReview || !savedReview._id) {
      throw new Error("Could not create a review");
    }

    const updatedRatings = await calculateOverallRatings(
      courseId,
      difficultyRating,
      overallRating,
      false,
      totalReviews + 1
    );

    course.difficultyRating = updatedRatings.updatedDifficulty;
    course.averageRating = updatedRatings.updatedOverall;

    await course.save();

    return savedReview;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all course reviews
export const getAllReviews = async () => {
  try {
    const reviews = await Review.find();
    if (!reviews) {
      throw new Error("No reviews found");
    }
    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Get a course review by ID
export const getCourseReviewById = async (reviewId) => {
  try {
    reviewId = isValidID(reviewId, "Review ID");
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error("Forum post not found");
    }
    if (review.status === "hidden") {
      throw new Error(
        "This review has been removed by the admin since it goes against the guidelines"
      );
    }
    return review;
  } catch (error) {
    throw new Error(error.message);
  }
};
//Update a course review by ID
export const updateCourseReviewById = async (reviewId, updatedReview) => {
  try {
    reviewId = isValidID(reviewId);
    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      throw new Error("Could not find the review with the given ID");
    }

    if (existingReview.isEdited) {
      throw new Error("You already edited this review!");
    }

    existingReview.isEdited = true;

    existingReview.isAnonymous = updatedReview.isAnonymous;

    if (updatedReview.difficultyRating != null) {
      existingReview.difficultyRating = isValidNumber(
        updatedReview.difficultyRating,
        "Difficulty Rating"
      );
    }

    if (updatedReview.overallRating != null) {
      existingReview.overallRating = isValidNumber(
        updatedReview.overallRating,
        "Overall Rating"
      );
    }

    if (updatedReview.review != null) {
      existingReview.review = await isValidString(
        updatedReview.review,
        "Review"
      );
    }
    const newReview = await existingReview.save();

    // Need to update the logic to calculate the overall ratings

    return newReview;
  } catch (error) {
    throw new Error("Error Updating the review:" + error.message);
  }
};
//Delete a course review by ID
export const deleteCourseReviewById = async (reviewId) => {
  try {
    reviewId = isValidID(reviewId, "Review ID");

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      throw new Error("Review not found");
    }

    let totalReviews = await Review.countDocuments({
      courseId: deletedReview.courseId,
    });

    const updatedRatings = await calculateOverallRatings(
      deletedReview.courseId,
      deletedReview.difficultyRating,
      deletedReview.overallRating,
      true,
      totalReviews
    );

    await Course.findByIdAndUpdate(deletedReview.courseId, {
      averageRating: updatedRatings.updatedOverall,
      difficultyRating: updatedRatings.updatedDifficulty,
    });

    return { message: "Review deleted successfully", deletedReview };
  } catch (error) {
    throw new Error(`Error deleting the review: ${error.message}`);
  }
};
//Get course reviews by course ID
export const getCourseReviewsByCourseId = async (courseId) => {
  try {
    courseId = isValidID(courseId, "CourseId");
    const reviews = await Review.find({ courseId: courseId });
    if (!reviews || reviews.length === 0) {
      throw new Error("Sorry, this course does not have any reviews");
    }
    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};
//Get course reviews by user ID
export const getCourseReviewsByUserId = async (userId) => {
  try {
    userId = isValidID(userId, "UserId");
    const reviews = await Review.find({ userId: userId });
    if (!reviews || reviews.length === 0) {
      throw new Error("Sorry, you did not post any reviews");
    }
    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get course reviews by rating
// Can be covered in filter. Also, what do you mean by rating?
// export const getCourseReviewsByRating = async (req, res) => {};

// Get course reviews by difficulty rating
// Can be covered in filter
// export const getCourseReviewsByDifficultyRating = async (req, res) => {};

// Get course reviews by average rating
// Can be covered in filter
// export const getCourseReviewsByAverageRating = async (req, res) => {};

//Get course reviews by course code
export const getCourseReviewsByCourseCode = async (courseCode) => {
  try {
    courseCode = await isValidString(courseCode, "Course-Code");
    courseCode = courseCode.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const course = await Course.findOne({
      courseCode: { $regex: `^${courseCode}$`, $options: "i" },
    });
    if (!course) {
      throw new Error("No course found with given courseCode");
    }
    const reviews = await getCourseReviewsByCourseId(course._id);
    if (!reviews || reviews.length === 0) {
      throw new Error("No reviews found for the given course");
    }
    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Get course reviews by course name
export const getCourseReviewsByCourseName = async (courseName) => {
  try {
    courseName = await isValidString(courseName, "Course Name");
    const course = await Course.findOne({
      courseName: { $regex: `^${courseName}$`, $options: "i" },
    });
    if (!course) {
      throw new Error("No course found with given name");
    }
    const reviews = await getCourseReviewsByCourseId(course._id);
    if (!reviews || reviews.length === 0) {
      throw new Error("No reviews found for the given course");
    }
    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get course reviews by course description
// Feels like this is not required.
// export const getCourseReviewsByCourseDescription = async (req, res) => {};

// Get course reviews by reviews
// Feels like this is not required.
// export const getCourseReviewsByReviews = async (req, res) => {};

//Filter course reviews
export const filterCourseReviews = async (filters = {}) => {
  try {
    const query = {};
    // UserID is mandatory
    if (filters.userId) {
      query.userId = isValidID(filters.userId, "User ID");
    } else {
      throw new Error("UserID is mandatory. Can't filter without the userID");
    }

    if (filters.courseId) {
      query.courseId = isValidID(filters.courseId, "Course ID");
    }

    // USer can check which of his/her reviews are hidden (by admin)
    if (filters.status && ["active", "hidden"].includes(filters.status)) {
      query.status = filters.status;
    }

    // Filter by difficultyRating
    if (filters.difficultyMin || filters.difficultyMax) {
      query.difficultyRating = {};
      if (filters.difficultyMin) {
        query.difficultyRating.$gte = filters.difficultyMin;
      }
      if (filters.difficultyMax) {
        query.difficultyRating.$lte = filters.difficultyMax;
      }
    }

    // Overall Rating (exact match or range)
    if (filters.overallMin || filters.overallMax) {
      query.overallRating = {};
      if (filters.overallMin) {
        query.overallRating.$gte = filters.overallMin;
      }
      if (filters.overallMax) {
        query.overallRating.$lte = filters.overallMax;
      }
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate);
      }
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      throw new Error("The filter did not yield any reviews.");
    }

    return reviews;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Get top-rated courses
export const getTopRatedCourses = async (req, res) => {};

//Get most reviewed courses
export const getMostReviewedCourses = async (req, res) => {};

//Get recent course reviews
export const getRecentCourseReviews = async (req, res) => {};

//Get course reviews by multiple tags
// export const getCourseReviewsByMultipleTags = async (req, res) => {};

export const upVoteReview = async (reviewId, userId) => {
  reviewId = isValidID(reviewId, "ReviewID");
  userId = isValidID(userId, "UserID");

  // Checking if the user voted previously
  let existingVote = await ReviewVotes.findOne({
    reviewId: reviewId,
    voterId: userId,
  });

  // If not, create a new vote and also update the upVote count by 1
  if (!existingVote) {
    let review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { upVotes: 1 } },
      { new: true }
    );
    if (!review) {
      throw new Error("Review not found.");
    }

    const newVote = new ReviewVotes({
      voterId: userId,
      reviewId: reviewId,
      voteType: "UP",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }
    return review;
  }

  // If there was a upVote, throw error
  if (existingVote && existingVote.voteType === "UP") {
    throw new Error("You can't vote for a review more than once !");
  }

  // If there was a downVote, remove it and create a new upVote
  if (existingVote && existingVote.voteType === "DOWN") {
    let review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { upVotes: 1, downVotes: -1 } },
      { new: true }
    );
    if (!review) {
      throw new Error("Review not found.");
    }

    let updatedVote = await ReviewVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "UP" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not upvote the previous downVote");
    }
    return review;
  }
};

export const downVoteReview = async (reviewId, userId) => {
  reviewId = isValidID(reviewId, "ReviewID");
  userId = isValidID(userId, "UserID");

  let existingVote = await ReviewVotes.findOne({
    reviewId: reviewId,
    voterId: userId,
  });

  if (!existingVote) {
    let review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { downVotes: 1 } },
      { new: true }
    );
    if (!review) {
      throw new Error("Review not found.");
    }

    const newVote = new ReviewVotes({
      voterId: userId,
      reviewId: reviewId,
      voteType: "DOWN",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }
    return review;
  }

  if (existingVote && existingVote.voteType === "DOWN") {
    throw new Error("You can't vote for a review more than once !");
  }

  if (existingVote && existingVote.voteType === "UP") {
    let review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { upVotes: -1, downVotes: 1 } },
      { new: true }
    );
    if (!review) {
      throw new Error("Review not found.");
    }

    let updatedVote = await ReviewVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "DOWN" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not upvote the previous downVote");
    }
    return review;
  }
};
