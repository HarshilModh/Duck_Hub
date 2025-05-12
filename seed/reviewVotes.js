// seeds/reviewVotes.js
import ReviewVotes from "../models/reviewVotes.model.js";
import Review from "../models/courseReviews.model.js";
import User from "../models/user.model.js";

export default async function seedReviewVotes() {
  await ReviewVotes.deleteMany({});
  console.log("Cleared review votes collection");

  const reviews = await Review.find().limit(2);
  const users = await User.find().limit(2);

  if (reviews.length < 1 || users.length < 1) {
    console.warn("Need reviews & users—run seedReviews & seedUsers first!");
    return;
  }

  const sampleVotes = [
    {
      voterId: users[0]._id,
      reviewId: reviews[0]._id,
      voteType: "UP",
    },
    {
      voterId: users[1]._id,
      reviewId: reviews[1]._id,
      voteType: "DOWN",
    },
  ];

  await ReviewVotes.insertMany(sampleVotes);
  console.log(`Inserted ${sampleVotes.length} review votes`);
}
