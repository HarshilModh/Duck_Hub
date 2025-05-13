import CategoryForAcademicResource from "../models/categoryForAcedmicResource.model.js";
import xss from "xss";
import { isValidString } from "../utils/validation.utils.js";

// Function to create a new category
export const createCategory = async(categoryName) => {
  try {

    // Validate the category name
   try {
    categoryName = isValidString(categoryName);
   }
   catch (error) {
      throw new Error("Invalid category name");
    }

    // Check if the category already exists
    const existingCategory = await CategoryForAcademicResource.findOne({
      categoryName,
    });
    if (existingCategory) {
      throw new Error("Category already exists");
    }
    // Create a new category
    const newCategory = new CategoryForAcademicResource({
      categoryName,
    });
    await newCategory.save();
    return newCategory;
    }
    catch (error) {
        console.error("Error creating category:", error);
        throw new Error(`Failed to create category: ${error.message}`);
        }   
}
// Function to get all categories
export const getAllCategories = async () => {
  try {

    let categories = await CategoryForAcademicResource.find().lean();
    if (!categories) {
      throw new Error("No categories found");
    }
    if (categories.length === 0) {
      categories = [];
    }
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }
};