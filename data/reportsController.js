import Reports from "../models/reports.model.js";
import {
  isValidID,
  isValidString,
  reportTypeValidation,
} from "../utils/validation.utils.js";
import { reportAcademicResource } from "./academicResourcesController.js";
import { reportForumPost } from "./forumsController.js";
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

  try {
    let forumUpdate;
    let academicResourceUpdate;
    if (type === "Forum") {
      forumUpdate = await reportForumPost(forumId, userId);
    } else if (type === "Academic Resource") {
      academicResourceUpdate = await reportAcademicResource(
        academicResourceId,
        userId
      );
    }

    if (forumUpdate && academicResourceUpdate) {
      throw new Error("Could not update content!");
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
      .populate("reportedBy", "firstName lastName")
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
