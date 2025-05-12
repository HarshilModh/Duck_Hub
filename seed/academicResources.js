import AcademicResource from "../models/academicResources.model.js";
import User from "../models/user.model.js";
import AdminTags from "../models/preDefinedTags.model.js";

export default async function seedAcademicResources() {
  await AcademicResource.deleteMany({});
  console.log("Cleared academic resources collection");
  const users = await User.find().limit(2);
  const adminTags = await AdminTags.find().limit(2);

  if (users.length < 1 || adminTags.length < 1) {
    console.warn(
      "Need users & admin tags—run seedUsers & seedAdminTags first!"
    );
    return;
  }

  const sampleResources = [
    {
      title: "NODE.JS OFFICIAL DOCS",
      description: "The official Node.js documentation and API reference.",
      url: "https://nodejs.org/dist/latest-v18.x/docs/api/",
      uploadedBy: users[0]._id,
      tags: [adminTags[0]._id],
      status: "active",
    },
    {
      title: "MONGODB UNIVERSITY COURSE",
      description:
        "Free, online courses on MongoDB basics and advanced topics.",
      url: "https://university.mongodb.com/",
      uploadedBy: users[1]._id,
      tags: [adminTags[1]._id],
      status: "active",
    },
  ];

  await AcademicResource.insertMany(sampleResources);
  console.log(`Inserted ${sampleResources.length} academic resources`);
}
