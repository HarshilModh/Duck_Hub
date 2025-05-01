import AcademicResource from "../models/academicResources.model.js";
import { getUserById } from "./userController.js";
import {
  isValidID,
  isValidString,
  isValidArray,
} from "../utils/validation.utils.js";

export const createAcademicResource = async (
  userId,
  title,
  description,
  url,
  tags
) => {
  if (!userId || !title || !description || !url) {
    throw new Error("userId, title, description, and url are required.");
  }

  title = isValidString(title, "Resource Title");
  description = isValidString(description, "Resource Description");
  userId = isValidID(userId, "userId");
  url = isValidString(url, "URL");

  const user = await getUserById(userId);
  if (!user) {
    throw new Error("No User Found With Given ID");
  }

  if (tags && tags.length !== 0) {
    tags = await isValidArray(tags, "Tags");
    tags = tags.map((tag) => isValidID(tag, "TagID"));
  }

  const newAcademicResource = new AcademicResource({
    title,
    description,
    url,
    uploadedBy: userId,
    tags: tags || [],
  });

  try {
    const savedAcademicResource = await newAcademicResource.save();
    if (!savedAcademicResource || !savedAcademicResource._id) {
      throw new Error("Could not create a new Academic Resource");
    }
    return savedAcademicResource;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllAcademicResources = async () => {
  try {
    const allAcademicResources = await AcademicResource.find()
      .populate("uploadedBy", "firstName lastName")
      .populate("tags", "name")
      .select("-reportedBy")
      .lean();
    if (!allAcademicResources) {
      throw new Error(
        "Sorry, no Academic Resources available right now to be displayed"
      );
    }
    return allAcademicResources;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAcademicResourceById = async (id) => {
  id = isValidID(id, "Academic Resource ID");
  const academicResource = await AcademicResource.findById(id);
  if (!academicResource) {
    throw new Error("Academic Resource not found");
  }
  return academicResource;
};

export const updateAcademicResourceByID = async (
  academicResourceId,
  updatedAcademicResource
) => {
  try {
    academicResourceId = isValidID(academicResourceId);
    const existingResource = await AcademicResource.findById(
      academicResourceId
    );
    if (!existingResource) {
      throw new Error("Could not find the academic resource with the given ID");
    }

    if (updatedAcademicResource.title) {
      existingResource.title = isValidString(
        updatedAcademicResource.title,
        "Academic Resource Title"
      );
    }

    if (updatedAcademicResource.description) {
      existingResource.description = isValidString(
        updatedAcademicResource.description,
        "Academic Resource Description"
      );
    }

    if (updatedAcademicResource.url) {
      existingResource.url = isValidString(
        updatedAcademicResource.url,
        "Academic Resource URL"
      );
    }

    if (
      updatedAcademicResource.tags &&
      updatedAcademicResource.tags.length !== 0
    ) {
      updatedAcademicResource.tags = await isValidArray(
        updatedAcademicResource.tags,
        "Tags"
      );
      existingResource.tags = updatedAcademicResource.tags.map((tag) =>
        isValidID(tag, "TagID")
      );
    }
    const newAcademicResource = await existingResource.save();
    return newAcademicResource;
  } catch (error) {
    throw new Error("Error Updating the Academic Resource:" + error.message);
  }
};

export const deleteAcacdemicResourceById = async (id) => {
  try {
    const validId = isValidID(id, "Forum Post ID");

    const deletedAcademicResource = await AcademicResource.findByIdAndDelete(
      validId
    );
    if (!deletedAcademicResource) {
      throw new Error("Academic Resource post not found");
    }

    return {
      message: "Academic Resource deleted successfully",
      deletedAcademicResource,
    };
  } catch (error) {
    throw new Error(`Error deleting Academic Resource: ${error.message}`);
  }
};

export const filterAcademicResources = async (keyword) => {
  try {
    keyword = isValidString(keyword, "keyword");
    const academicResource = await AcademicResource.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    if (!academicResource || academicResource.length === 0) {
      throw new Error("No Academic Resources found matching the keyword.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAcademicResourceByUserId = async (userId) => {
  let academicResource;
  userId = isValidID(userId, "UserID");
  try {
    academicResource = await AcademicResource.find({ userId: userId });
  } catch (error) {
    throw new Error("Failed to fetch Academic Resources: " + error.message);
  }
  if (!academicResource || academicResource.length === 0) {
    throw new Error("Sorry, you haven't created any Academic Resources yet!!");
  }
  return academicResource;
};

export const getAcademicResourceByTagId = async (tagId) => {
  let academicResource;
  tagId = isValidID(tagId, "tagID");
  try {
    academicResource = await AcademicResource.find({ tags: tagId });
  } catch (error) {
    throw new Error("Failed to fetch Academic Resources: " + error.message);
  }
  if (!academicResource || academicResource.length === 0) {
    throw new Error(`No Academic Resources found with tag: ${tagId}`);
  }
  return academicResource;
};

export const getAcademicResourceByStatus = async (status) => {
  let academicResource;
  status = isValidString(status, "Status");
  try {
    academicResource = await AcademicResource.find({ status: status });
  } catch (error) {
    throw new Error("Failed to fetch Academic Resources: " + error.message);
  }
  if (!academicResource || academicResource.length === 0) {
    throw new Error(`No Academic Resources found with status: ${status}`);
  }
  return academicResource;
};

export const upvoteAcademicResource = async (academicResourceId, userId) => {};

export const downvoteAcademicResource = async (
  academicResourceId,
  userId
) => {};

export const reportAcademicResource = async () => {};

export const unreportAcademicResource = async () => {};

export const getReportedAcademicResources = async () => {};

export const changeAcademicResourceStatus = async () => {};
