import CommentVotes from "../models/forumCommentVotes.model.js";
import Comment from "../models/forumsComments.model.js";
import User from "../models/user.model.js";

export default async function seedCommentVotes() {
  await CommentVotes.deleteMany({});
  console.log("Cleared comment votes collection");

  const comments = await Comment.find().limit(2);
  const users = await User.find().limit(2);

  if (comments.length < 1 || users.length < 1) {
    console.warn("Need comments & users—run seedComments & seedUsers first!");
    return;
  }

  const sampleVotes = [
    {
      voterId: users[1]._id,
      commentId: comments[0]._id,
      voteType: "UP",
    },
    {
      voterId: users[0]._id,
      commentId: comments[1]._id,
      voteType: "DOWN",
    },
  ];

  await CommentVotes.insertMany(sampleVotes);
  console.log(`Inserted ${sampleVotes.length} comment votes`);
}
