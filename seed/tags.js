import Tags from "../models/tags.model.js";
import User from "../models/user.model.js";

export default async function seedTags() {
  await Tags.deleteMany({});
  console.log("Cleared tags collection");

  const users = await User.find().limit(3);
  if (users.length === 0) {
    console.warn("No users found—run seedUsers first!");
    return;
  }
  const sampleTags = [
    { name: "NODEJS", createdBy: users[0]._id },
    { name: "MONGODB", createdBy: users[1 % users.length]._id },
    { name: "EXPRESS", createdBy: users[2 % users.length]._id },
    { name: "JAVASCRIPT", createdBy: users[0]._id },
  ];

  await Tags.insertMany(sampleTags);
  console.log(`Inserted ${sampleTags.length} tags`);
}
