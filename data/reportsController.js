import Reports from "../models/reports.model.js";
import {
  isValidID,
  isValidString,
  reportTypeValidation,
} from "../utils/validation.utils.js";
import { reportAcademicResource } from "./academicResourcesController.js";
import { reportReview } from "./courseReviewController.js";
import { reportForumPost } from "./forumsController.js";
import { reportPoll } from "./pollController.js";
import mongoose from "mongoose";

export const createReport = async (
  forumId,
  pollId,
  reviewId,
  academicResourceId,
  type,
  userId,
  reason
) => {
  if (!type || !userId || !reason) {
    throw new Error("userId, type, reason are required");
  }
  type = reportTypeValidation(type);
  userId = isValidID(userId);
  reason = isValidString(reason);
  console.log("reportTypeValidation", type);
  console.log("userId", userId);
  console.log("reason", reason);
  
  try {
    let forumUpdate;
    let academicResourceUpdate;

    if (forumUpdate && academicResourceUpdate) {
      throw new Error("Could not update content!");
    }
    if (type === "Forum") { 

    let existingReport = await Reports.findOne({
      forumId: forumId,
      reportedBy: userId,
    });

    if (existingReport) {
      throw new Error("You can't report a forum more than once !");
    }
  }
    if (type === "Poll") {
      let existingReport = await Reports.findOne({
        pollId: pollId,
        reportedBy: userId,
      });
      if (existingReport) {
        throw new Error("You can't report a poll more than once !");
      }
    }
    if (type === "Review") {
      let existingReport = await Reports.findOne({
        reviewId: reviewId,
        reportedBy: userId,
      });
      if (existingReport) {
        throw new Error("You can't report a review more than once !");
      }
    }
    if (type === "AcademicResource") {
      let existingReport = await Reports.findOne({
        academicResourceId: academicResourceId,
        reportedBy: userId,
      });
      if (existingReport) {
        throw new Error("You can't report a resource more than once !");
      }
    }
    const newReport = new Reports({
      forumId,
      pollId,
      reviewId,
      academicResourceId,
      reportedContentType: type,
      reportedBy: userId,
      reason,
    });

    const savedReport = await newReport.save();
    if (!savedReport || !savedReport._id) {
      throw new Error("Could not create a new Report");
    }
    return savedReport;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllReports = async () => {
  try {
    const allReports = await Reports.find()
      .populate("reportedBy", "firstName lastName email")
      .populate("forumId", "title")
      .populate("pollId", "title content")
      .populate("reviewId", "review overallRating difficultyRating") 
      .populate("academicResourceId", "title content")

      .lean();
    if (!allReports) {
      throw new Error("Sorry, no Reports available right now to be displayed");
    }
    return allReports;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const deleteReportById = async (reportId) => {
  try {
    const validId = isValidID(reportId, "Report ID");

    const deletedReport = await Reports.findByIdAndDelete(validId);
    if (!deletedReport) {
      throw new Error("Report not found");
    }

    return { message: "Report deleted successfully", deletedReport };
  } catch (error) {
    throw new Error(`Error deleting report: ${error.message}`);
  }
};

export const getReportById = async (reportId) => {
  reportId = isValidID(reportId, "Report ID");
  reports = await Reports.findbyId(reportId)
    .populate("reportedBy", "firstName lastName")
    .lean();
  if (!reports) {
    throw new Error("Reports not found");
  }
  return reports;
};

export const resolveApprovedReport = async (reportId) => {
  try {
    const report = await Reports.findByIdAndUpdate(reportId, {
      $set: { status: "resolved" },
    });
    if (!report) {
      throw new Error("Report with that ID does not exist");
    }
    if (report.reportedContentType === "Forum") {
      const forumUpdate = await reportForumPost(
        report.forumId.toString(),
        report.reportedBy.toString()
      );
      if (!forumUpdate) {
        throw new Error("Forum report could not be updated");
      }
    } else if (report.reportedContentType === "AcademicResource") {
      const academicResourceUpdate = await reportAcademicResource(
        report.academicResourceId.toString(),
        report.reportedBy.toString()
      );
      if (!academicResourceUpdate) {
        throw new Error("Academic Resource report could not be updated");
      }
    } else if (report.reportedContentType === "Review") {
      const reviewUpdate = await reportReview(
        report.reviewId.toString(),
        report.reportedBy.toString()
      );
      if (!reviewUpdate) {
        throw new Error("Review report could not be updated");
      }
    } else if (report.reportedContentType === "Poll") {
      const pollUpdate = await reportPoll(
        report.pollId.toString(),
        report.reportedBy.toString()
      );
      if (!pollUpdate) {
        throw new Error("Poll report could not be updated");
      }
    }
    return report;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resolveDisapprovedReport = async (reportId) => {
  try {
    const report = await Reports.findByIdAndUpdate(reportId, {
      $set: { status: "resolved" },
    });

    if (!report) {
      throw new Error("Report with that ID does not exist");
    }

    return report;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateReportStatus = async (reportId, status) => {
  reportId = isValidID(reportId, "Report ID");
  updatedReports = await Reports.findByIdAndUpdate(reportId, {
    $set: { status: status },
  });

  if (!updatedReports) {
    throw new Error("Reports not found");
  }
  return updatedReports;
};

export const getAllReportsForAdmin = async () => {
  const reports = await Reports.find()
  .populate("forumId", "title content ")           
  // .populate("pollId")                
  // .populate("reviewId")
  // .populate("academicResourceId")
  // .populate("reportedBy", "firstName lastName email")
  .lean();

const grouped = {
  Forums: [],
  Polls: [],
  Reviews: [],
  Resources: []
};

for (const r of reports) {

  const entry = {
    reportId: r._id,
    reason: r.reason,
    status: r.status,
    reportedBy: r.reportedBy,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    content: null       
  };

  switch (r.reportedContentType) {
    case "Forum":
      entry.content = r.forumId;
      grouped.Forums.push(entry);
      break;
    case "Poll":
      entry.content = r.pollId;
      grouped.Polls.push(entry);
      break;
    case "Review":
      entry.content = r.reviewId;
      grouped.Reviews.push(entry);
      break;
    case "AcademicResource":
      entry.content = r.academicResourceId;
      grouped.Resources.push(entry);
      break;
  }
}

  return grouped;
};
//get reports by reviewId
export const getReportsByReviewId = async (reviewId) => {
  reviewId = isValidID(reviewId, "Review ID");
  const review = await Reports.find({ reviewId })
    .populate("reviewId", "review overallRating difficultyRating downVotes upVotes createdAt updatedAt courseId")
    .populate("reportedBy", "firstName lastName email")
    .lean();
    
    console.log("review", review);
    
    
  if (!review) {
    throw new Error("Reports not found");
  }
  return review;
};