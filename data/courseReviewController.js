import mongoose from "mongoose";
import Course from "../models/courses.model.js";
import { getUserById } from "./userController.js";
import { getCourseById } from "./courseController.js";
import {
  calculateOverallRatingsForAdding,
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
  review,
  difficultyRating,
  overallRating,
  isAnonymous
) => {

  try {
    if (!userId) {
      throw new Error("UserID is required");
    }
    if (!courseId) {
      throw new Error("CourseID is required");
    }
    if (!review) {
      throw new Error("Review is required");
    }
    if (!difficultyRating) {
      throw new Error("Difficulty Rating is required");
    }
    if (!overallRating) {
      throw new Error("Overall Rating is required");
    }
    if (isAnonymous === undefined) {
      throw new Error("isAnonymous is required");
    }
    userId = isValidID(userId, "UserID");

    const user = await getUserById(userId);

    courseId = isValidID(courseId, "CourseID");

    // Need to change the structure of the code in controller function
    let course = await getCourseById(courseId);

    let userReviews = await Review.findOne({
      courseId: courseId,
      userId: userId,
    });
    //if userReviews is not null and have both courseId and userId, then throw error
    if (userReviews) {
      throw new Error("You have already reviewed this course");
    }

    let totalReviews = await Review.countDocuments({ courseId: courseId });

    if (difficultyRating === undefined || difficultyRating === null) {
      throw new Error("You must provide a valid Difficulty Rating");
    }
    const validNumberStringRegex = /^[0-9]$/;
    if (typeof difficultyRating === "string") {
      difficultyRating = difficultyRating.trim();
      if (!validNumberStringRegex.test(difficultyRating)) {
        throw new Error("Difficulty Rating must be a number");
      }
      
      difficultyRating = Number(difficultyRating);
    } else if (typeof difficultyRating === "number") {
      difficultyRating = difficultyRating;
    } 
    else {
      throw new Error("Difficulty Rating must be a number");
    }
    if (typeof difficultyRating !== "number") {
      throw new Error("Difficulty Rating must be a number");
    }
    
    difficultyRating = isValidNumber(difficultyRating, "Difficulty Rating");
    if (difficultyRating < 1 || difficultyRating > 3) {
      throw new Error("Difficulty Rating must be between 1 & 3");
    }
    if (overallRating === undefined || overallRating === null) {
      throw new Error("You must provide a valid Overall Rating");
    }
    if (typeof overallRating === "string") {
      overallRating = overallRating.trim();
      if (!validNumberStringRegex.test(overallRating)) {
        throw new Error("Overall Rating must be a number");
      }
      overallRating = Number(overallRating);
    } else if (typeof overallRating === "number") {
      overallRating = overallRating;
    } else {
      throw new Error("Overall Rating must be a number");
    }
    if (typeof overallRating !== "number") {
      throw new Error("Overall Rating must be a number");
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

    const savedReview = await Review.create(
      newReview
    );
    if (!savedReview || !savedReview._id) {
      throw new Error("Could not create a review");
    }

    const updatedRatings = await calculateOverallRatingsForAdding(
      courseId,
      overallRating,
      difficultyRating,
      totalReviews
    );
    console.log("Updated Ratings: ", updatedRatings);

    course.difficultyRating = updatedRatings.updatedDifficulty;
    course.averageRating = updatedRatings.updatedaverageRating;
    console.log("Updated Ratings: ", updatedRatings);

    console.log("averageRating: ", updatedRatings.updatedaverageRating);
    
    
    // Need to update the course with the new ratings and add the newly created reviewId in the course
    let reviews = course.reviews;
    if (!reviews) {
      reviews = [];
    }
    reviews.push(savedReview._id);
    // Need to update the course with the new ratings
    let updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        difficultyRating: updatedRatings.updatedDifficulty,
        averageRating: updatedRatings.updatedaverageRating,
        reviews: reviews,
      },
      { new: true }
    );
    if (!updatedCourse) {
      throw new Error("Could not update the course with the new ratings");
    }
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
export const updateCourseReviewById = async (reviewId, difficultyRating,overallRating, review) => {
  try {
 
    
    
    if(!reviewId) {
      throw new Error("Review ID is required");
    }
    if(!overallRating) {
      throw new Error("Overall Rating is required");
    }
    if(!difficultyRating) {
      throw new Error("Difficulty Rating is required");
    }
    if(!review) {
      throw new Error("Review is required");
    }
    if(mongoose.isValidObjectId(reviewId) === false) {
      throw new Error("Invalid Review ID");
    }
    const validNumberStringRegex = /^[0-9]$/;
    if (typeof difficultyRating === "string") {
      difficultyRating = difficultyRating.trim();
      if (!validNumberStringRegex.test(difficultyRating)) {
        throw new Error("Difficulty Rating must be a number");
      }
      difficultyRating = Number(difficultyRating);
    } else if (typeof difficultyRating === "number") {
      difficultyRating = difficultyRating;
    } else {
      throw new Error("Difficulty Rating must be a number");
    }
    if (typeof difficultyRating !== "number") {
      throw new Error("Difficulty Rating must be a number");
    }
    if (difficultyRating < 1 || difficultyRating > 3) {
      throw new Error("Difficulty Rating must be between 1 & 3");
    }
    if (typeof overallRating === "string") {
      overallRating = overallRating.trim();
      if (!validNumberStringRegex.test(overallRating)) {
        throw new Error("Overall Rating must be a number");
      }
      overallRating = Number(overallRating);  
    } else if (typeof overallRating === "number") {
      overallRating = overallRating;
    } else {
      throw new Error("Overall Rating must be a number");
    }
    if (typeof overallRating !== "number") {
      throw new Error("Overall Rating must be a number");
    }
    if (overallRating < 0 || overallRating > 5) {
      throw new Error("Overall Rating must be between 0 & 5");
    }
    if (!review) {
      throw new Error("A review must be passed");
    }
    review = isValidString(review, "Review");
    //if isEdited is true, then the review is already updated
    let reviewToUpdate = await Review.findById(reviewId);
    if (!reviewToUpdate) {
      throw new Error("Review not found");
    }
    if (reviewToUpdate.isEdited) {
      throw new Error("This review has already been edited");
    }
    if (reviewToUpdate.status === "hidden") {
      throw new Error(
        "This review has been removed by the admin since it goes against the guidelines"
      );
    }
     reviewToUpdate = await Review.findByIdAndUpdate(
      reviewId,
      {
        overallRating,
        difficultyRating,
        review,
        isEdited: true,
      },
      { new: true }
    );
    if (!reviewToUpdate) {
      throw new Error("Review not found");
    }
    const course = await Course.findById(reviewToUpdate.courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const totalReviews = await Review.countDocuments({
      courseId: reviewToUpdate.courseId,
    });
    let updatedAverageRating = 0;
    let updatedDifficultyRating = 0;
    if (totalReviews > 0) {
      updatedAverageRating =
        (course.averageRating * totalReviews - reviewToUpdate.overallRating) /
        totalReviews;
      updatedDifficultyRating =
        (course.difficultyRating * totalReviews -
          reviewToUpdate.difficultyRating) /
        totalReviews;
    }
    console.log("Updated Average Rating: ", updatedAverageRating);
    console.log("Updated Difficulty Rating: ", updatedDifficultyRating);
    // Need to update the course with the new ratings
    let updatedCourse = await Course.findByIdAndUpdate(
      reviewToUpdate.courseId,
      {
        difficultyRating: updatedDifficultyRating,
        averageRating: updatedAverageRating,
        reviews: course.reviews,
      },
      { new: true }
    );
    if (!updatedCourse) {
      throw new Error("Could not update the course with the new ratings");
    }
    return reviewToUpdate;
  } catch (error) {
    throw new Error(error.message);
  }
}
//Delete a course review by ID
export const deleteCourseReviewById = async (reviewId) => {
  try {
    if (!reviewId) {
      throw new Error("Review ID is required");
    }
    reviewId = isValidID(reviewId, "Review ID");

    let deletedReview = await Review.findByIdAndDelete(reviewId);
    console.log("Deleted Review: ", deletedReview);
    
    if (!deletedReview) {
      throw new Error("Review not found");
    }
    console.log("Deleted Review: ", deletedReview);
    //deleted review is having courseId as objectId we need to convert it to string
    let totalReviews = await Review.countDocuments({
      courseId: deletedReview.courseId,
    });
    console.log("Total Reviews: ", totalReviews);
    
    if (totalReviews === 0) {
      //set course ratings to 0 and empty reviews
      await Course.findByIdAndUpdate(deletedReview.courseId, {
        difficultyRating: 0,
        averageRating: 0,
        reviews: [],
      });
      return { message: "Review deleted successfully", deletedReview };
    }
    else{
      //Need to update the logic to calculate the overall ratings here only
      let course = await Course.findById(deletedReview.courseId);
      if (!course) {
        throw new Error("Course not found");
      }
      if (course.reviews) {
        course.reviews = course.reviews.filter(
          (review) => review.toString() !== reviewId.toString()
        );
      }
      let newTotalReviews = await Review.countDocuments({
        courseId: deletedReview.courseId,
      });
      console.log("New Total Reviews: ", newTotalReviews);
      let updatedAverageRating = 0;
      let updatedDifficultyRating = 0;
      if (newTotalReviews > 0) {
        updatedAverageRating =
          (course.averageRating * totalReviews - deletedReview.overallRating) /
          newTotalReviews;
        updatedDifficultyRating =
          (course.difficultyRating * totalReviews -
            deletedReview.difficultyRating) /
          newTotalReviews;
      }
      console.log("Updated Average Rating: ", updatedAverageRating);
      console.log("Updated Difficulty Rating: ", updatedDifficultyRating);
      // Need to update the course with the new ratings
      let updatedCourse = await Course.findByIdAndUpdate(
        deletedReview.courseId,
        {
          difficultyRating: updatedDifficultyRating,
          averageRating: updatedAverageRating,
          reviews: course.reviews,
        },
        { new: true }
      );
      if (!updatedCourse) {
        throw new Error("Could not update the course with the new ratings");
      }
      return  deletedReview ;
    }
  } catch (error) {
    throw new Error(`Error deleting the review: ${error.message}`);
  }
};
//Get course reviews by course ID and populate userId
export const getCourseReviewsByCourseId = async (courseId) => {
  try {
    courseId = isValidID(courseId, "CourseId");
    let reviews = await Review.find({ courseId: courseId })
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 });
      //if userId is not present in the reviews, then don't populate it with userId
   
    if (!reviews ) {
      throw new Error("No reviews found for the given course");
    }
    if (reviews.length === 0) {
      reviews = [];
    }
    return reviews;
  }
  catch (error) {
    throw new Error(error.message);
  }
};
//Get course reviews by user ID
export const getCourseReviewsByUserId = async (userId) => {
  try {
    userId = isValidID(userId, "UserId");
    //populate userId with firstName and lastName andf courseId with courseCode and courseName
    const reviews = await Review.find({ userId: userId })
      .populate("courseId", "courseCode courseName")
      .populate("userId", "firstName lastName")
      .sort({ createdAt: -1 }).lean();
    if (!reviews ) {
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

    const savedVote = await ReviewVotes.create(newVote);
    // Check if the vote was saved successfully
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }
    // Check if the vote was saved successfully
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

    const savedVote = await ReviewVotes.create(newVote);
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

export const getReviewById = async (reviewId) => {
  try {
    reviewId = isValidID(reviewId, "Review ID");
    const review = await Review.findById(reviewId).populate(
      "userId",
      "firstName lastName"
    ).populate("courseId", "courseCode courseName").lean();
    
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  } catch (error) {
    throw new Error(error.message);
  }
};
