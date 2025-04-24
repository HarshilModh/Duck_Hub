import express from "express";
import userRoutes from "./user.routes.js";
import forumRoutes from "./forum.routes.js";
import reviewRoutes from "./review.routes.js";
import departmentRoutes from "./department.routes.js";
import courseRoutes from "./course.routes.js";
import userSideCoursesRoutes from "./userSideCourses.routes.js";
const router = express.Router();

// Define the base route for users
// This will be the base route for all user-related routes
// For example, if the base route is '/users', then the route for creating a user will be '/users/create'
router.use("/users", userRoutes);
router.use("/forums", forumRoutes);
router.use("/reviews", reviewRoutes);
router.use("/departments", departmentRoutes);
router.use("/courses", courseRoutes);
router.use("/userSideCourses", userSideCoursesRoutes);

export default router;
