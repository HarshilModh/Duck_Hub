import ForumVotes from "../models/forumVotes.model.js";
import Forum from "../models/forums.model.js";
import User from "../models/user.model.js";

export default async function seedForumVotes() {
  await ForumVotes.deleteMany({});
  console.log("Cleared forum votes collection");

  const forums = await Forum.find().limit(2);
  const users = await User.find().limit(2);

  if (forums.length < 1 || users.length < 1) {
    console.warn("Need forums & users—run seedForums & seedUsers first!");
    return;
  }

  const sampleVotes = [
    {
      voterId: users[0]._id,
      forumId: forums[0]._id,
      voteType: "UP",
    },
    {
      voterId: users[1]._id,
      forumId: forums[0]._id,
      voteType: "DOWN",
    },
    {
      voterId: users[0]._id,
      forumId: forums[1]._id,
      voteType: "UP",
    },
  ];

  await ForumVotes.insertMany(sampleVotes);
  console.log(`Inserted ${sampleVotes.length} forum votes`);
}
