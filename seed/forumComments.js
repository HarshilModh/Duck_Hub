import Comment from "../models/forumsComments.model.js";
import Forum from "../models/forums.model.js";
import Poll from "../models/polls.model.js";
import User from "../models/user.model.js";

//   {
//     forumId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: Forum.modelName, // reference to the forum
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: User.modelName,
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // saw the note that this should be a string not array
//     imageURLs: {
//       type: [String],
//       default: [], // empty string as default
//     },
//     upVotes: {
//       type: Number,
//       default: 0, // starting with 0 upvotes
//       min: 0, // can't have negative upvotes
//     },
//     downVotes: {
//       type: Number,
//       default: 0, // starting with 0 downvotes
//       min: 0, // can't have negative downvotes
//     },
//     commentFor: {
//       type: String,
//       enum: ["poll", "forum"],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
export default async function seedComments() {
  await Comment.deleteMany({});
  console.log("Cleared comments collection");

  const forums = await Forum.find().limit(1);
  const polls = await Poll.find().limit(1);
  const users = await User.find().limit(2);
  if (forums.length < 1 || polls.length < 1 || users.length < 1) {
    console.warn("Need forums, polls & users—run seedForums, seedPolls & seedUsers first!");
    return;
  }
  const sampleComments = [
    {
      forumId: forums[0]._id,
      userId: users[0]._id,
      content: "This is a comment on the forum",
      upVotes: 0,
      downVotes: 0,
      commentFor: "forum",
    },
    {
      forumId: polls[0]._id,
      userId: users[1]._id,
      content: "This is a comment on the poll",
      upVotes: 0,
      downVotes: 0,
      commentFor: "poll",
    },
  ];
  await Comment.insertMany(sampleComments);
  console.log(`Inserted ${sampleComments.length} comments`);
  const comments = await Comment.find()
    .populate("userId", "name email")
    .populate("forumId", "title content");
  console.log("Populated comments with users and forums", comments);
  console.log("Comments seeded successfully");
  return comments;
}