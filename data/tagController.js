import Tag from "../models/tags.model.js";
import { getUserById } from "./userController.js";
import { isValidID, isValidString } from "../utils/validation.utils.js";

export const createTag = async (userId, name) => {
  name = name.trim();
  // Check if the required fields are passed
  if (!userId || !name) {
    throw new Error("userId, and name are required.");
  }
  // Validate Tag Name
  name = isValidString(name, "Tag Name");
  // Validate userID
  userId = isValidID(userId, "userId");
  // Check for User
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("No User Found With Given ID");
  }
  // Check if Tag already exists
  name = name.toLowerCase();
  const isTagAlreadyExists = await Tag.findOne({ name });
  if (isTagAlreadyExists) {
    throw new Error("Tag already exists");
  }
  // Create new Tag
  const newTag = new Tag({
    userId,
    name,
  });
  // Try Saving
  try {
    const savedTag = await newTag.save();
    if (!savedTag || !savedTag._id) {
      throw new Error("Could not create a new tag");
    }
    return savedTag;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllTags = async () => {
  try {
    const allTags = await Tag.find();
    if (!allTags) {
      throw new Error("No Tags yet");
    }
    return allTags;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTagsById = async (id) => {
  id = isValidID(id, "Tag ID");
  const tag = await Tag.findById(id);
  if (!tag) {
    throw new Error("Tag not found");
  }
  return tag;
};

export const getTagsByUser = async (userId) => {
  let tags;
  userId = isValidID(userId, "User ID");
  try {
    tags = await Tag.find({ userId: userId });
  } catch (error) {
    throw new Error("Failed to fetch Tags: " + error.message);
  }
  if (!tags || tags.length === 0) {
    throw new Error("Sorry, you haven't created any Tags yet!!");
  }
  return tags;
};

export const updateTagById = async (tagId, updatedTag) => {
  try {
    tagId = isValidID(tagId, "Tag ID");
    const existingTag = await Tag.findById(tagId);
    if (!existingTag) {
      throw new Error("Could not find the tag with the given ID");
    }
    if (updatedTag.name) {
      existingTag.name = isValidString(updatedTag.name, "tag Name");
    }
    const newTag = await existingTag.save();
    return newTag;
  } catch (error) {
    throw new Error("Error Updating the tag:" + error.message);
  }
};

export const deleteTagById = async (tagId) => {
  try {
    tagId = isValidID(tagId, "Tag ID");
    const deletedTag = await Tag.findByIdAndDelete(tagId);
    if (!deletedTag) {
      throw new Error("Tag not found");
    }
    return { message: "Tag deleted successfully", deletedTag };
  } catch (error) {
    throw new Error("Error deleting the tag:" + error.message);
  }
};
