import express from "express";
import {
  createReport,
  getAllReports,
  resolveApprovedReport,
  resolveDisapprovedReport,
  getAllReportsForAdmin,
  getReportsByReviewId,
  getReportsByForumId,
  getReportsByAcademicResourceId,
  getReportsByPollId,
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
import { reportForum, reportPoll } from "../data/forumsCommentsController.js";
import { reportResource } from "../data/academicResourcesController.js";
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
      } else if (contentType === "Forum") {
        await reportForum(forumId, userId);
      } else if (contentType === "Poll") {
        await reportPoll(pollId, userId);
      } else if (contentType === "AcademicResource") {
        await reportResource(academicResourceId, userId);
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

router.route("/view").get(async (req, res) => {
  try {
    const groupedReports = await getAllReportsForAdmin();
    return res.render("reportLandingAdmin", {
      reports: groupedReports,
      customStyles:
        '<link rel="stylesheet" href="/public/css/reportLandingAdmin.css">',
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//load views/reportDashboard.handlebars
router
  .route("/dashboard")
  .get(isLoggedIn, checkRole("admin"), async (req, res) => {
    try {
      const loggedUserId = req.session.user?.user?._id || null;
      let reports = await getAllReports();
      // reports=reports.filter((report) => report.status === "under review");
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
router
  .route("/reviews/:id")
  .get(isLoggedIn, checkRole("admin"), async (req, res) => {
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
          message: "Internal server error:" + e.message,
        };
        return res.status(400).redirect("/report/dashboard");
      }
      let review = await getReportsByReviewId(reviewId);
      let courseDetails = await Course.findById(review[0].reviewId.courseId)
        .populate("departmentId", "departmentName")
        .lean();
      console.log("courseDetails", courseDetails);
      let reportCount = await Reports.countDocuments({
        reviewId: review[0].reviewId._id,
      });
      console.log("review", review);

      if (!review) {
        req.session.toast = {
          type: "error",
          message: "Review not found",
        };
        return res.status(404).redirect("/report/dashboard");
      }
      const loggedUserId = req.session.user?.user?._id || null;
      res.render("reviewReportDetails", { review, courseDetails, reportCount });
    } catch (e) {
      console.error(e);
      req.session.toast = {
        type: "error",
        message: "Internal server error:" + e.message      };  
      return res.status(500).redirect("/report/dashboard");
    }
  });
router
  .route("/resolve/:id")
  .put(isLoggedIn, checkRole("admin"), async (req, res) => {
    let reportId = req.params.id;
    //here we approve the report
    //and update the status of the report
    //and update the status of the report
    try {
      if (!reportId || typeof reportId !== "string" || reportId.trim() === "") {
        req.session.toast = {
          type: "error",
          message: "Report ID is required and must be a non-empty string.",
        };
        return res.status(400).redirect("/report/dashboard");
      }
      try {
        reportId = isValidID(reportId, "reportId");
      } catch (error) {
        req.session.toast = {
          type: "error",
          message: "Internal server error:" + e.message,
        };
        return res.status(400).redirect("/report/dashboard");
      }

      await resolveApprovedReport(reportId);
      req.session.toast = {
        type: "success",
        message: "Report resolved successfully",
      };
      return res.status(200).redirect("/report/dashboard");
    } catch (e) {
      console.error(e);
      req.session.toast = {
        type: "error",
        message: "Internal server error:" + e.message      };
      return res.status(500).redirect("/report/dashboard");
    }
  });

router
  .route("/reject/:id")
  .put(isLoggedIn, checkRole("admin"), async (req, res) => {
    let reportId = req.params.id;
    //here we approve the report
    //and update the status of the report
    //and update the status of the report
    try {
      if (!reportId || typeof reportId !== "string" || reportId.trim() === "") {
        req.session.toast = {
          type: "error",
          message: "Report ID is required and must be a non-empty string.",
        };
        return res.status(400).redirect("/report/dashboard");
      }
      try {
        reportId = isValidID(reportId, "reportId");
      } catch (error) {
        req.session.toast = {
          type: "error",
          message: "Report ID is not valid",
        };
        return res.status(400).redirect("/report/dashboard");
      }

      await resolveDisapprovedReport(reportId);
      req.session.toast = {
        type: "success",
        message: "Report rejected successfully",
      };
      return res.status(200).redirect("/report/dashboard");
    } catch (e) {
      console.error(e);
      req.session.toast = {
        type: "error",
        message: "Internal server error:" + e.message,
      };
      return res.status(500).redirect("/report/dashboard");
    }
  });

//load views/forumReportDetails.handlebars
router
  .route("/forums/:id")
  .get(isLoggedIn, checkRole("admin"), async (req, res) => {
    let forumId = req.params.id;
    try {
      if (!forumId || typeof forumId !== "string" || forumId.trim() === "") {
        req.session.toast = {
          type: "error",
          message: "Forum ID is required and must be a non-empty string.",
        };
        return res.status(400).redirect("/report/dashboard");
      }
      try {
        forumId = isValidID(forumId, "forumId");
      } catch (error) {
        req.session.toast = {
          type: "error",
          message: "Forum ID is not valid",
        };
        return res.status(400).redirect("/report/dashboard");
      }
      let forum = await Forum.findById(forumId)
        .populate("userId", "firstName lastName")
        .lean();
      let reportCount = await Reports.countDocuments({ forumId: forum._id });
      let report = await getReportsByForumId(forumId);
      if (!forum) {
        req.session.toast = {
          type: "error",
          message: "Forum not found",
        };
        return res.status(404).redirect("/report/dashboard");
      }
      const loggedUserId = req.session.user?.user?._id || null;
      console.log("forum", forum);
      console.log("reportCount", reportCount);
      console.log("report", report);

      res.render("forumReportDetails", { forum, reportCount, report });
    } catch (e) {
      console.error(e);
      req.session.toast = {
        type: "error",
        message:"Internal server error:" + e.message,
      };
      return res.status(500).redirect("/report/dashboard");
    }
  });

//load myreports.handlebars
router.route("/myreports").get(isLoggedIn, async (req, res) => {
  try {
    const loggedUserId = req.session.user?.user?._id || null;
    console.log("loggedUserId", loggedUserId);
    
    let reports = await Reports.find({
      reportedBy: loggedUserId,
    }).populate("reportedBy", "firstName lastName email")
      .populate("forumId", "title")
      .populate("pollId", "title content")
      .populate("reviewId", "review overallRating difficultyRating")
      .populate("academicResourceId", "title content")
      .lean();
    reports = reports.filter(
      (report) => report.reportedBy._id.toString() === loggedUserId
    );
    console.log("Reports:", reports);

    res.render("myReports", {
      reports,
      loggedUserId,
    });
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Internal server error:" + e.message,
    };
    return res.status(500).redirect("/report/dashboard");
  }
});
//academicResources
router
  .route("/academicResources/:id")
  .get(isLoggedIn, checkRole("admin"), async (req, res) => {
    let academicResourceId = req.params.id;
    try {
      if (
        !academicResourceId ||
        typeof academicResourceId !== "string" ||
        academicResourceId.trim() === ""
      ) {
        req.session.toast = {
          type: "error",
          message:
            "Academic Resource ID is required and must be a non-empty string.",
        };
        return res.status(400).redirect("/report/dashboard");
      }
      try {
        academicResourceId = isValidID(
          academicResourceId,
          "academicResourceId"
        );
      } catch (error) {
        req.session.toast = {
          type: "error",
          message: error.message,
        };
        return res.status(400).redirect("/report/dashboard");
      }
      let academicResource = await getReportsByAcademicResourceId(
        academicResourceId
      );
      let reportCount = await Reports.countDocuments({
        academicResourceId: academicResource[0].academicResourceId._id,
      });
      let report = await Reports.find({
        academicResourceId: academicResource[0].academicResourceId._id,
      })
        .populate("reportedBy", "firstName lastName")
        .lean();
      academicResource = academicResource[0];
      if (!academicResource) {
        req.session.toast = {
          type: "error",
          message: "Academic Resource not found",
        };
        return res.status(404).redirect("/report/dashboard");
      }
      const loggedUserId = req.session.user?.user?._id || null;
      console.log("academicResource", academicResource);
      console.log("reportCount", reportCount);
      console.log("report", report);
      res.render("resourceReportsDetails", {
        academicResource,
        reportCount,
        report,
      });
    } catch (e) {
      console.error(e);
      req.session.toast = {
        type: "error",
        message: "Internal server error:" + e.message,
      };
      return res.status(500).redirect("/report/dashboard");
    }
  });
//load pollReportDetails.handlebars
router
  .route("/polls/:id")
  .get(isLoggedIn, checkRole("admin"), async (req, res) => {
    let pollId = req.params.id;
    try {
      if (!pollId || typeof pollId !== "string" || pollId.trim() === "") {
        req.session.toast = {
          type: "error",
          message: "Poll ID is required and must be a non-empty string.",
        };
        return res.status(400).redirect("/report/dashboard");
      }
      try {
        pollId = isValidID(pollId, "pollId");
      } catch (error) {
        req.session.toast = {
          type: "error",
          message: "Poll ID is not valid",
        };
        return res.status(400).redirect("/report/dashboard");
      }
     
      let poll = await Poll.findById(pollId)
        .populate("createdBy", "firstName lastName")
        .lean();
      let reportCount = await Reports.countDocuments({ pollId: poll._id });
      let report = await getReportsByPollId(pollId);
      if (!poll) {
        req.session.toast = {
          type: "error",
          message: "Poll not found",
        };
        return res.status(404).redirect("/report/dashboard");
      }
      const loggedUserId = req.session.user?.user?._id || null;
      console.log("poll", poll);
      console.log("reportCount", reportCount);
      console.log("report", report);
      res.render("pollReportDetails", { poll, reportCount, report });
    } catch (e) {
      console.error(e);
     req.session.toast = {
        type: "error",
        message: "Internal server error:" + e.message,
      };
      res.status(500).redirect("/report/dashboard");
    }
  });
export default router;
