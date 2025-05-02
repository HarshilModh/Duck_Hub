import express from "express";
import userRoutes from "./user.routes.js";
import forumRoutes from "./forum.routes.js";
import reviewRoutes from "./review.routes.js";
import departmentRoutes from "./department.routes.js";
import courseRoutes from "./course.routes.js";
import userSideCoursesRoutes from "./userSideCourses.routes.js";
import academicResourcesRoutes from "./academicResources.routes.js";
import tagsRoutes from "./tags.routes.js";
import reportRoutes from "./report.routes.js";
const router = express.Router();

router.use("/users", userRoutes);
router.use("/forums", forumRoutes);
router.use("/reviews", reviewRoutes);
router.use("/departments", departmentRoutes);
router.use("/courses", courseRoutes);
router.use("/userSideCourses", userSideCoursesRoutes);
router.use("/academicResources", academicResourcesRoutes);
router.use("/tags", tagsRoutes);
router.use("/report", reportRoutes);


// ← Catch-all for any route not handled above
// router.all(/(.*)/, (req, res) => {
//   res.status(404).render("notFound");
// });

export default router;
