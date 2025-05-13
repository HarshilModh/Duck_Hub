import Forum from "../models/forums.model.js";
import User from "../models/user.model.js";
import Tags from "../models/tags.model.js";

//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: User.modelName,
//       required: true,
//       trim: true,
//       maxLength: 250,
//     },
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       uppercase: true,
//       maxLength: 50,
//     },
//     content: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     imageURLs: {
//       type: [String], // Array of Cloudinary image URLs
//       default: [],
//     },
//     upVotes: {
//       type: Number,
//       min: 0,
//       default: 0,
//     },
//     downVotes: {
//       type: Number,
//       min: 0,
//       default: 0,
//     },
//     status: {
//       type: String,
//       enum: ["active", "reported", "removed"],
//       default: "active",
//     },
//     tags: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: Tags.modelName,
//       },
//     ],
//     reportedBy: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: User.modelName,
//       },
//     ],
//   },
//   { timestamps: true }
// );
export default async function seedForums() {
  await Forum.deleteMany({});
  console.log("Cleared forums collection");

  const users = await User.find().limit(2);
  const tags = await Tags.find().limit(2);

  if (users.length < 1 || tags.length < 1) {
    console.warn("Not enough users or tags—run seedUsers & seedTags first!");
    return;
  }

  const sampleForums = [
    {
      title: "What is your favorite programming language?",
      content: "I love JavaScript! What about you?",
      userId: users[0]._id,
      tags: [tags[0]._id, tags[1]._id],
    },
    {
      title: "What is your favorite front-end framework?",
      content: "React is my go-to. What do you think?",
      userId: users[1]._id,
      tags: [tags[0]._id, tags[1]._id],
    },
  ];
  await Forum.insertMany(sampleForums);
  console.log(`Inserted ${sampleForums.length} forums`);
  const forums = await Forum.find()
    .populate("userId", "name email")
    .populate("tags", "name createdBy");
  console.log("Populated forums with users and tags", forums);
  console.log("Forums seeded successfully");
  return forums;
}