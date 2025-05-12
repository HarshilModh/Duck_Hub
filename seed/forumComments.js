import Comment from "../models/forumsComments.model.js";
import Forum from "../models/forums.model.js";
import Poll from "../models/polls.model.js";
import User from "../models/user.model.js";

export default async function seedComments() {
  await Comment.deleteMany({});
  console.log("Cleared comments collection");

  const forums = await Forum.find().limit(1);
  const polls = await Poll.find().limit(1);
  const users = await User.find().limit(2);

  if (!forums.length || !polls.length || users.length < 2) {
    console.warn(
      "Need at least 1 forum, 1 poll & 2 users—run seedForums, seedPolls & seedUsers first!"
    );
    return;
  }

  const sampleComments = [
    {
      forumId: forums[0]._id,
      userId: users[1]._id,
      content: "Great intro! Looking forward to more.",
      imageURLs: [],
      upVotes: 0,
      downVotes: 0,
      commentFor: "forum",
    },
    {
      forumId: polls[0]._id,
      userId: users[0]._id,
      content: "I voted Express.js—it's super lightweight.",
      imageURLs: [],
      upVotes: 0,
      downVotes: 0,
      commentFor: "poll",
    },
  ];

  await Comment.insertMany(sampleComments);
  console.log(`Inserted ${sampleComments.length} comments`);
}
