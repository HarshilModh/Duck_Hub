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
      course.averageRating = 0;
      course.difficultyRating = 0;
    console.log("Updated course",course);
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
    //round to 2 decimal places
    course.averageRating =  Math.round(averageOverallRating * 100) / 100;
    course.difficultyRating = Math.round(averageDifficultyRating * 100) / 100;
    course.reviews = reviews.map((review) => review._id);
    console.log("Updated course",course);

    await course.save();
    return {
      newOverallRating: averageOverallRating,
      newDifficultyRating: averageDifficultyRating,
    };
  }
  catch (error) {
    console.error("Error calculating ratings:", error);
    throw error;
  }
}

export const calculateRatingsEdit = async (courseId) => {
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const reviews = await Review.find({ courseId });
    if (!reviews || reviews.length === 0) {
      course.averageRating = null;
      course.difficultyRating = null;
      course.reviews = [];
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
    //round to 2 decimal places
    course.averageRating = Math.round(averageOverallRating * 100) / 100;
    course.difficultyRating = Math.round(averageDifficultyRating * 100) / 100;
    
    await course.save();
    return {
      newOverallRating: averageOverallRating,
      newDifficultyRating: averageDifficultyRating,
    };
  }
  catch (error) {
    console.error("Error calculating ratings:", error);
    throw error;
  }
}
export const calculateRatingsDelete = async (courseId) => {
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    const reviews = await Review.find({ courseId });
    if (!reviews || reviews.length === 0) {
      course.averageRating = null;
      course.difficultyRating = null;
      course.reviews = [];
      await course.save();
      return {newOverallRating: 0, newDifficultyRating: 0};
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
    //round to 2 decimal places
    course.averageRating = Math.round(averageOverallRating * 100) / 100;
    course.difficultyRating = Math.round(averageDifficultyRating * 100) / 100;
    course.reviews = reviews.filter((review) => review.courseId.toString() !== courseId).map((review) => review._id);
    await course.save();
    return {
      newOverallRating: averageOverallRating,
      newDifficultyRating: averageDifficultyRating,
    };
  }
  catch (error) {
    console.error("Error calculating ratings:", error);
    throw error;
  }
}