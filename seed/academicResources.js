import AcademicResource from "../models/academicResources.model.js";
import User from "../models/user.model.js";
import AdminTags from "../models/preDefinedTags.model.js";
import CategoryForAcademicResource from "../models/categoryForAcedmicResource.model.js";


export default async function seedAcademicResources() {
  let users = await User.find().limit(2);
  let tags = await AdminTags.find().limit(5);
  let categories = await CategoryForAcademicResource.find().limit(5);
  let academicResources = [
    {
      title: "Introduction to Algorithms",
      description: "A comprehensive guide to algorithms.",
      url: "https://example.com/algorithms",
      uploadedBy: users[0]._id,
      tags: [tags[0]._id, tags[1]._id],
      upVotes: 0,
      downVotes: 0,
      reportedBy: [],
      category: categories[0]._id,
    },
    {
      title: "Data Structures in Java",
      description: "Learn data structures using Java.",
      url: "https://example.com/data-structures-java",
      uploadedBy: users[1]._id,
      tags: [tags[2]._id, tags[3]._id],
      upVotes: 0,
      downVotes:0,
      reportedBy: [],
      category: categories[1]._id,
    },
  ];
  try {
    await AcademicResource.deleteMany({});
    await AcademicResource.insertMany(academicResources);
    console.log("Academic resources seeded successfully.");
  } catch (error) {
    console.error("Error seeding academic resources:", error);
  }
}