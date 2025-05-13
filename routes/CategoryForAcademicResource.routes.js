import { createCategory,getAllCategories } from "../data/CategoryForAcademicResource.controller.js";
import express from "express";
import { isLoggedIn} from "../middlewares/auth.middleware.js"
import { checkRole } from "../middlewares/roleCheck.middleware.js";
import { isValidString } from "../utils/validation.utils.js";
import xss from "xss";

const router = express.Router();
// Route to load handlebar for creating a new category
router.get("/create", isLoggedIn,checkRole("admin"), (req, res) => {
  res.render("createCategoryForAcedmicResource");
}).post("/create", isLoggedIn, checkRole("admin"), async (req, res) => {
    try{
        let catagoryName =xss(req.body.categoryName);
        // Validate the category name
        try {
            catagoryName = isValidString(catagoryName);
        } catch (error) {
            req.session.toast = {
                type: "error",
                message: "Invalid category name",
            };
            return res.redirect("/resCategory/create");
        }
        // Check if the category already exists
        const existingCategory = await getAllCategories();
        if (existingCategory.some(category => category.categoryName === catagoryName)) {
            req.session.toast = {
                type: "error",
                message: "Category already exists",
            };
            return res.redirect("/resCategory/create");
        }
        // Create a new category
        const newCategory = await createCategory(catagoryName);
        if (!newCategory) {
            req.session.toast = {
                type: "error",
                message: "Failed to create category",
            };
            return res.redirect("/resCategory/create");
        }
        req.session.toast = {
            type: "success",
            message: "Category created successfully",
        };
        return res.redirect("/academicResources");
    }catch(error){
        console.error("Error creating category:", error);
        req.session.toast = {
            type: "error",
            message: `Failed to create category: ${error.message}`,
        };
        return res.redirect("/resCategory/create");
    }
});
// Route to get all categories
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const categories = await getAllCategories();
    if (!categories) {
      req.session.toast = {
        type: "error",
        message: "No categories found",
      };
      return res.redirect("/academicResources");
    }
    res.render("resCategory/categoryList", { categories });
  } catch (error) {
    req.session.toast = {
      type: "error",
      message: `Failed to fetch categories: ${error.message}`,
    };
    return res.redirect("/academicResources");
  }
});

export default router;