import express from "express";
import {
  createReport,
  getAllReports,
  resolveApprovedReport,
  resolveDisapprovedReport,
  getAllReportsForAdmin,
  getReportsByReviewId
} from "../data/reportsController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import Forum from "../models/forums.model.js";
import Reports from "../models/reports.model.js";
import Poll from "../models/polls.model.js";
import Review from "../models/courseReviews.model.js";
import AcademicResource from "../models/academicResources.model.js";
import xss from "xss";
import { isValidID } from "../utils/validation.utils.js";
import { reportReview } from "../data/courseReviewController.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";
import Course from "../models/courses.model.js";
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
   
       if (contentType === "Review") {
        await reportReview(reviewId, userId);
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
  //load views/reportDashboard.handlebars
 router.route("/dashboard").get(isLoggedIn,checkRole("admin"),async (req, res) => {
  try {
    const loggedUserId = req.session.user?.user?._id || null;
    let reports = await getAllReports();
    console.log("Reports:", reports);
    
    const forumReports = reports.filter(
      (report) => report.reportedContentType === "Forum"
    );
    const pollReports = reports.filter(
      (report) => report.reportedContentType === "Poll"
    );
    const reviewReports = reports.filter(
      (report) => report.reportedContentType === "Review"
    );
    const academicResourceReports = reports.filter(
      (report) => report.reportedContentType === "AcademicResource"
    );
    res.render("reportDashboard", {
      forumReports,
      pollReports,
      reviewReports,
      academicResourceReports,
      loggedUserId,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error loading report page");
  }
 });
 //load views/reviewReport.handlebars
 router.route("/reviews/:id").get(isLoggedIn,checkRole("admin"),async (req, res) => {
  let reviewId = req.params.id;
  try {
  
    if (!reviewId || typeof reviewId !== "string" || reviewId.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Review ID is required and must be a non-empty string.",
      };
      return res.status(400).redirect("/report/dashboard");
    }
    try {
      reviewId = isValidID(reviewId, "reviewId");
    } catch (error) {
      req.session.toast = {
        type: "error",
        message: error.message,
      };
      return res.status(400).redirect("/report/dashboard");
    }
    let review=await getReportsByReviewId(reviewId);
    let courseDetails=await Course.findById(review[0].reviewId.courseId).populate("departmentId","departmentName").lean();
    console.log("courseDetails", courseDetails);
    
    console.log("review", review);
    
    if (!review) {
      req.session.toast = {
        type: "error",
        message: "Review not found",
      };
      return res.status(404).redirect("/report/dashboard");
    }
    const loggedUserId = req.session.user?.user?._id || null;
    res.render("reviewReport",{review,courseDetails});
  } catch (e) {
    console.error(e);
    res.status(500).send("Error loading report page");
  }
 });

export default router;
