import Forum from "../models/forums.model.js";
import User from "../models/user.model.js";
import Tags from "../models/tags.model.js";

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
      userId: users[0]._id,
      title: "WELCOME TO DUCK_HUB",
      content:
        "This is the first forum post. Ask your questions and share knowledge!",
      imageURLs: [],
      status: "active",
      tags: [tags[0]._id, tags[1]._id],
      reportedBy: [],
    },
    {
      userId: users[1]._id,
      title: "MONGODB BEST PRACTICES",
      content:
        "Share schemas, indexing tips, and performance tricks for MongoDB.",
      imageURLs: [],
      status: "active",
      tags: [tags[1]._id],
      reportedBy: [],
    },
  ];

  await Forum.insertMany(sampleForums);
  console.log(`Inserted ${sampleForums.length} forum posts`);
}
