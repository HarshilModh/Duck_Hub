import CategoryForAcademicResource from "../models/categoryForAcedmicResource.model.js";
// const categoryForAcademicResourceSchema = new mongoose.Schema(
//   {
//     categoryName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
import mongoose from "mongoose";

export default async function seedCategoryForAcademicResource() {
  try {
    // 1. Define categories
    const categories = [
      { categoryName: "Programming" },
        { categoryName: "Data Science" },
        { categoryName: "Web Development" },
        { categoryName: "Machine Learning" },
        { categoryName: "Mobile Development" },
        { categoryName: "Game Development" },
        { categoryName: "Cloud Computing" },
        { categoryName: "Cybersecurity" },
        { categoryName: "DevOps" },
        { categoryName: "Software Engineering" },
    ];
    // 2. Check if categories already exist
    const existingCategories = await CategoryForAcademicResource.find({
      categoryName: { $in: categories.map((cat) => cat.categoryName) },
    });
    if (existingCategories.length > 0) {
      console.log("Categories already exist. Skipping seeding.");
      return;
    }
    // 3. Insert categories into the database
    const insertedCategories = await CategoryForAcademicResource.insertMany(
      categories
    );
    console.log("Categories seeded successfully:", insertedCategories);
  }
  catch (error) {
    console.error("Error seeding categories:", error);
  } 
}