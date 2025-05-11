import express from "express";
<<<<<<< Updated upstream
import {
  createReport,
  getAllReports,
  resolveApprovedReport,
  resolveDisapprovedReport,
  getAllReportsForAdmin
} from "../data/reportsController.js";
=======
import { createReport, getAllReports, getAllReportsForAdmin} from "../data/reportsController.js";
>>>>>>> Stashed changes
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import Forum from "../models/forums.model.js";
import Reports from "../models/reports.model.js";
import Poll from "../models/polls.model.js";
import Review from "../models/courseReviews.model.js";
import AcademicResource from "../models/academicResources.model.js";
import xss from "xss";
import { isValidID } from "../utils/validation.utils.js";

const router = express.Router();

router
  .route("/")
  .get(isLoggedIn, async (req, res) => {
    try {
      const loggedUserId = req.session.user?.user?._id || null;
      let reports = await getAllReports();
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
      let decision = xss(req.body.decision);
      let reportId = xss(req.body.reportId);
      let updatedReport;
      if (decision === "approve") {
        updatedReport = resolveApprovedReport(reportId);
      } else if (decision === "disapprove") {
        updatedReport = resolveDisapprovedReport(reportId);
      }
      return res.status(201).redirect("/report");
    } catch (e) {
      req.session.toast = {
        type: "error",
        message: "Internal server error:" + e.message,
      };
      return res.status(500).redirect("/forums");
    }
  });

router.route("/:contentType").post(isLoggedIn, async (req, res) => {
  try {
    let contentId = xss(req.body.contentId);
    let userId = xss(req.body.userId);
    let reason = xss(req.body.reason);
    let forumId = null;
    let pollId = null;
    let reviewId = null;
    let academicResourceId = null;
    let reportType = null;

    try {
      userId = isValidID(userId, "userId");
      contentId = isValidID(contentId, "contentId");
    } catch (error) {
      req.session.toast = {
        type: "error",
        message: error.message,
      };
      return res.status(400).redirect("/forums");
    }

    let contentType = xss(req.params.contentType);
    const validTypes = ["Forum", "Poll", "Review", "AcademicResource"];

    if (!validTypes.includes(contentType)) {
      req.session.toast = {
        type: "error",
        message: "Invalid Content Type",
      };
      return res.status(400).redirect("/forums");
    }

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

    const existingForumReport = await Reports.findOne({
      reportedBy: userId,
      forumId: contentId,
    }).exec();

    if (existingForumReport) {
      req.session.toast = {
        type: "error",
        message: "You have already reported this Forum.",
      };
      return res.status(400).redirect("/forums");
    }

    const existingPollReport = await Reports.findOne({
      reportedBy: userId,
      pollId: contentId,
    }).exec();

    if (existingPollReport) {
      req.session.toast = {
        type: "error",
        message: "You have already reported this Poll.",
      };
      return res.status(400).redirect("/forums");
    }

    const existingReviewReport = await Reports.findOne({
      reportedBy: userId,
      reviewId: contentId,
    }).exec();

    if (existingReviewReport) {
      req.session.toast = {
        type: "error",
        message: "You have already reported this Review.",
      };
      return res.status(400).redirect("/forums");
    }

    const existingResourceReport = await Reports.findOne({
      reportedBy: userId,
      academicResourceId: contentId,
    }).exec();

    if (existingResourceReport) {
      req.session.toast = {
        type: "error",
        message: "You have already reported this Resource.",
      };
      return res.status(400).redirect("/academicResources");
    }

    reportType = contentType;
    if (contentType === "Forum") {
      forumId = contentId;
    } else if (contentType === "Poll") {
      pollId = contentId;
    } else if (contentType === "Review") {
      reviewId = contentId;
    } else if (contentType === "AcademicResource") {
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
    req.session.toast = {
      type: "error",
      message: "Internal server error:" + e.message,
    };
    return res.status(500).redirect("/forums");
  }
});

  router
  .route("/view")
  .get(async (req, res) => {
    try {
      const groupedReports = await getAllReportsForAdmin();
      return res.render("reportLandingAdmin", {
        reports: groupedReports,
        customStyles: '<link rel="stylesheet" href="/public/css/reportLandingAdmin.css">'
      });
    } catch (err) {
      console.error("Error fetching reports:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
export default router;
