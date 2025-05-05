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
import CampusResourceRoutes from "./campusResource.routes.js"; // Assuming you have a campusResource.routes.js file
import userSideCampusResourcesRoutes from "./userSideCampusResources.routes.js"; // Assuming you have a userSideCampusResources.routes.js file
import pollRoutes from "./poll.routes.js";
const app = express();
const router = express.Router();
const constructorMethods = (app) => {
    app.use("/users", userRoutes);
    app.use("/forums", forumRoutes);
    app.use("/reviews", reviewRoutes);
    app.use("/departments", departmentRoutes);
    app.use("/courses", courseRoutes);
    app.use("/userSideCourses", userSideCoursesRoutes);
    app.use("/academicResources", academicResourcesRoutes);
    app.use("/tags", tagsRoutes);
    app.use("/report", reportRoutes);
    app.use("/polls", pollRoutes);
    app.use("/campusresources",CampusResourceRoutes); // Assuming you have a campusResource.routes.js file
    app.use("/userSideCampusResources", userSideCampusResourcesRoutes); // Assuming you have a userSideCampusResources.routes.js file
    app.use(/(.*)/, (req, res) => {
        res.status(404).render("notFound");
    });
};


export default constructorMethods;