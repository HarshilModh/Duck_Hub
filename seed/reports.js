import Reports from "../models/reports.model.js";
import Forum from "../models/forums.model.js";
import Poll from "../models/polls.model.js";
import Review from "../models/courseReviews.model.js";
import AcademicResource from "../models/academicResources.model.js";
import User from "../models/user.model.js";

export default async function seedReports() {
  await Reports.deleteMany({});
  console.log("Cleared reports collection");

  const [forum] = await Forum.find().limit(1);
  const [poll] = await Poll.find().limit(1);
  const [review] = await Review.find().limit(1);
  const [resource] = await AcademicResource.find().limit(1);
  const [user] = await User.find().limit(1);

  if (!forum || !poll || !review || !resource || !user) {
    console.warn(
      "Need at least one Forum, Poll, Review, AcademicResource & User seeded first!"
    );
    return;
  }

  const sampleReports = [
    {
      forumId: forum._id,
      reportedContentType: "Forum",
      reportedBy: user._id,
      reason: "Inappropriate language in forum post",
    },
    {
      pollId: poll._id,
      reportedContentType: "Poll",
      reportedBy: user._id,
      reason: "Poll contains misleading options",
    },
    {
      reviewId: review._id,
      reportedContentType: "Review",
      reportedBy: user._id,
      reason: "Review appears to be spam",
    },
    {
      academicResourceId: resource._id,
      reportedContentType: "AcademicResource",
      reportedBy: user._id,
      reason: "Resource link is broken",
    },
  ];

  await Reports.insertMany(sampleReports);
  console.log(`Inserted ${sampleReports.length} reports`);
}
