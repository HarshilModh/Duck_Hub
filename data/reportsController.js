import Reports from "../models/reports.model.js";
import {
  isValidID,
  isValidString,
  reportTypeValidation,
} from "../utils/validation.utils.js";
export const createReport = async (type, userId, reason, contentId) => {
  if (!type || !userId || !reason) {
    throw new Error("userId, type, reason are required");
  }
  type = reportTypeValidation(type);
  userId = isValidID(userId);
  reason = isValidString(reason);
  contentId = isValidID(contentId);

  const newReport = new Reports({
    reportedContentId: contentId,
    reportedContentType: type,
    reportedBy: userId,
    reason: reason,
    status: "under review",
  });

  try {
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
export const getReportById = async () => {};
export const updateReport = async () => {};
