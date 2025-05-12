// seeds/reviews.js
import Review from "../models/courseReviews.model.js";
import User from "../models/user.model.js";
import Course from "../models/courses.model.js";

export default async function seedReviews() {
  // 1. Clear existing reviews
  await Review.deleteMany({});
  console.log("Cleared reviews collection");

  // 2. Fetch users and courses to reference
  const users = await User.find().limit(3);
  const courses = await Course.find().limit(3);
  if (users.length === 0 || courses.length === 0) {
    console.warn("Need users & courses—run seedUsers & seedCourses first!");
    return;
  }

  // 3. Prepare sample reviews
  const sampleReviews = [
    {
      userId: users[0]._id,
      courseId: courses[0]._id,
      difficultyRating: 1,
      overallRating: 5,
      review: "Great intro course—very clear and engaging.",
      status: "active",
      isEdited: false,
      isAnonymous: false,
      upVotes: 2,
      downVotes: 0,
      reports: [], // will be populated by seedReports
    },
    {
      userId: users[1]._id,
      courseId: courses[1]._id,
      difficultyRating: 2,
      overallRating: 4,
      review: "Good content but could use more examples.",
      status: "active",
      isEdited: false,
      isAnonymous: true,
      upVotes: 1,
      downVotes: 0,
      reports: [],
    },
    {
      userId: users[2]._id,
      courseId: courses[2]._id,
      difficultyRating: 3,
      overallRating: 3,
      review: "Challenging material but rewarding.",
      status: "active",
      isEdited: false,
      isAnonymous: false,
      upVotes: 0,
      downVotes: 1,
      reports: [],
    },
  ];

  await Review.insertMany(sampleReviews);
  console.log(`Inserted ${sampleReviews.length} reviews`);
}
