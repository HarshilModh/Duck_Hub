import express from "express";
import { createReport, getAllReports } from "../data/reportsController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import Forum from "../models/forums.model.js";
import Reports from "../models/reports.model.js";
import Poll from "../models/polls.model.js";
import Review from "../models/courseReviews.model.js";
import AcademicResource from "../models/academicResources.model.js";

const router = express.Router();

router
  .route("/")
  .get(isLoggedIn, async (req, res) => {
    try {
      const reports = await getAllReports();
      const loggedUserId = req.session.user?.user?._id || null;
      res.render("reportLanding", {
        reports,
        loggedUserId,
        layout: "dashboard",
        customStyles:
          '<link rel="stylesheet" href="/public/css/reportLanding.css">',
      });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error loading report page");
    }
  })
  .post(isLoggedIn, async (req, res) => {
    try {
      const { contentId, userId, reason } = req.body;
      let forumId,
        pollId,
        reviewId,
        academicResourceId = null;
      let reportType = null;

      if (!reason || typeof reason !== "string" || reason.trim() === "") {
        req.session.toast = {
          type: "error",
          message: "Reason is required and must be a non-empty string.",
        };
        return res.status(400).redirect("/forums");
      }

      const existingReport = await Reports.findOne({
        reportedBy: userId,
        $or: [
          { forumId: contentId },
          { pollId: contentId },
          { reviewId: contentId },
          { academicResourceId: contentId },
        ],
      }).exec();

      if (existingReport) {
        req.session.toast = {
          type: "error",
          message: "You have already reported this content.",
        };
        return res.status(400).redirect("/forums");
      }

      const isForum = await Forum.exists({ _id: contentId });
      const isPoll = await Poll.exists({ _id: contentId });
      const isReview = await Review.exists({ _id: contentId });
      const isResource = await AcademicResource.exists({ _id: contentId });
      if (isForum) {
        reportType = "Forum";
        forumId = contentId;
      }
      if (isPoll) {
        reportType = "Poll";
        pollId = contentId;
      }
      if (isReview) {
        reportType = "Review";
        reviewId = contentId;
      }
      if (isResource) {
        reportType = "AcademicResource";
        academicResourceId = contentId;
      }

      try {
        const report = createReport(
          forumId,
          pollId,
          reviewId,
          academicResourceId,
          reportType,
          userId,
          reason
        );
        if (!report) {
          req.session.toast = {
            type: "error",
            message: "Create Report Failed",
          };
          return res.status(500).redirect("/forums");
        }
        req.session.toast = {
          type: "success",
          message: "Report created: Administrator will review it shortly.",
        };
        return res.status(200).redirect("/forums");
      } catch (error) {
        req.session.toast = {
          type: "error",
          message:
            error.message || "An error occurred while creating the report.",
        };
        return res.status(500).redirect("/forums");
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

export default router;
