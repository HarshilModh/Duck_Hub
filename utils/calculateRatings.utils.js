import Course from "../models/courses.model.js";
import Review from "../models/courseReviews.model.js";

export const calculateRatings = async (courseId) => {
    console.log("Calculating ratings for course:", courseId);
    
  try {
    const course = await Course.findById(courseId);
    console.log("Course found:", course);
    
    if (!course) {
      throw new Error("Course not found");
    }
    const reviews = await Review.find({ courseId })
    console.log("Reviews found:", reviews);
    
    if (!reviews || reviews.length === 0) {
      course.overallRating = 0;
      course.difficultyRating = 0;
      await course.save();
      return;
    }
    const totalReviews = reviews.length;
    const totalOverallRating = reviews.reduce(
      (acc, review) => acc + review.overallRating,
      0
    );
    const totalDifficultyRating = reviews.reduce(
      (acc, review) => acc + review.difficultyRating,
      0
    );
    const averageOverallRating = totalOverallRating / totalReviews;
    const averageDifficultyRating = totalDifficultyRating / totalReviews;
    course.overallRating = averageOverallRating;
    course.difficultyRating = averageDifficultyRating;
    course.reviews = reviews.map((review) => review._id);
    await course.save();
    return {
      overallRating: averageOverallRating,
      difficultyRating: averageDifficultyRating,
    };
  }
  catch (error) {
    console.error("Error calculating ratings:", error);
    throw error;
  }
}
