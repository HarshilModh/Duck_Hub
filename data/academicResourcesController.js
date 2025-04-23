import academicResources from "../models/academicResources.model";
import { isValidID, isValidString } from "../utils/validation.utils";

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

  const newAcademicResource = new academicResources({
    userId,
    title,
    description,
    url,
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
    const allAcademicResources = await academicResources
      .find()
      .populate("userId", "firstName lastName")
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
  const academicResource = await academicResources.findById(id);
  if (!academicResource) {
    throw new Error("Academic Resource not found");
  }
  return academicResource;
};
