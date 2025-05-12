import AdminTags from "../models/preDefinedTags.model.js";
import User from "../models/user.model.js";

export default async function seedAdminTags() {
  await AdminTags.deleteMany({});
  console.log("Cleared admin tags collection");

  const [owner] = await User.find().limit(1);
  if (!owner) {
    console.warn("No users found—run seedUsers first!");
    return;
  }

  const sampleAdminTags = [
    { name: "ALGORITHM", createdBy: owner._id },
    { name: "DATA STRUCTURE", createdBy: owner._id },
    { name: "DEVOPS", createdBy: owner._id },
    { name: "FRONTEND", createdBy: owner._id },
    { name: "BACKEND", createdBy: owner._id },
  ];

  await AdminTags.insertMany(sampleAdminTags);
  console.log(`Inserted ${sampleAdminTags.length} admin tags`);
}
