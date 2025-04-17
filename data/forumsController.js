import mongoose from "mongoose";
import Forum from "../models/forums.model.js";
import { getUserById } from "./userController.js";
import {
  isValidID,
  isValidArray,
  isValidString,
} from "../utils/validation.utils.js";

// Create a new forum post
export const createForumPost = async (
  userId,
  title,
  content,
  imageURLs,
  tags
) => {
  // Check if the required fields are passed
  if (!userId || !title || !content) {
    throw new Error("userId, title, and content are required.");
  }
  // Validate Title
  title = isValidString(title, "Post Title");
  // Validate Content
  content = isValidString(content, "Post Content");
  // Validate userID
  userId = isValidID(userId, "userId");
  //TODO: Discuss with harshil to change the code structure. Giving errors.
  // Check if user exists with that ID.
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("No User Found With Given ID");
  }
  if (imageURLs) {
    imageURLs = await isValidArray(imageURLs);
    imageURLs = imageURLs.map((url) => isValidString(url, "Image URL"));
  }
  if (tags && tags.length !== 0) {
    tags = await isValidArray(tags, "Tags");
    tags = tags.map((tag) => isValidID(tag, "TagID"));
  }
  //TODO: Implement code to check if a tag actually exists with the given ID. If not, simply remove the ID and proceed.
  const newPost = new Forum({
    userId,
    title,
    content,
    imageURLs: imageURLs || [],
    tags: tags || [],
  });
  try {
    const savedPost = await newPost.save();
    if (!savedPost || !savedPost._id) {
      throw new Error("Could not create a new forum post");
    }
    return savedPost;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all forum posts
export const getAllForumPosts = async () => {
  try {
    //TODO: Populate the tag names after tags collection is created.
    const allPosts = await Forum.find().select("-reportedBy"); //.populate("tags", "name -_id");
    if (!allPosts) {
      throw new Error(
        "Sorry, no discussion forums available right now to be displayed"
      );
    }
    return allPosts;
  } catch (e) {
    return e.message;
  }
};

// Get a forum post by ID
export const getForumPostById = async (id) => {
  id = isValidID(id, "Forum ID");
  const forumPost = await Forum.findById(id);
  if (!forumPost) {
    throw new Error("Forum post not found");
  }
  return forumPost;
};

// Update a forum post by ID
export const updateForumPostById = async (forumId, updatedPost) => {
  try {
    forumId = isValidID(forumId);
    const existingForum = await Forum.findById(forumId);
    if (!existingForum) {
      throw new Error("Could not find the post with the given ID");
    }

    if (updatedPost.title) {
      existingForum.title = isValidString(updatedPost.title, "Post Title");
    }

    if (updatedPost.content) {
      existingForum.content = isValidString(
        updatedPost.content,
        "Post Content"
      );
    }

    if (updatedPost.imageURLs && updatedPost.imageURLs.length !== 0) {
      existingForum.imageURLs = await isValidArray(
        updatedPost.imageURLs,
        "Image URLs"
      );
    }

    if (updatedPost.tags && updatedPost.tags.length !== 0) {
      updatedPost.tags = await isValidArray(updatedPost.tags, "Tags");
      existingForum.tags = updatedPost.tags.map((tag) =>
        isValidID(tag, "TagID")
      );
    }
    const newPost = await existingForum.save();
    return newPost;
  } catch (error) {
    throw new Error("Error Updating the post:" + error.message);
  }
};

// Delete a forum post by ID
export const deleteForumPostById = async (id) => {
  try {
    const validId = isValidID(id, "Forum Post ID");

    const deletedPost = await Forum.findByIdAndDelete(validId);
    if (!deletedPost) {
      throw new Error("Forum post not found");
    }

    return { message: "Forum post deleted successfully", deletedPost };
  } catch (error) {
    throw new Error(`Error deleting forum post: ${error.message}`);
  }
};

// Filter forum posts by keyword in title or content
export const filterForumPosts = async (req, res) => {};

// Get forum posts by user ID
export const getForumPostsByUserId = async (userId) => {
  let posts;
  userId = isValidID(userId, "UserID");
  try {
    posts = await Forum.find({ userId: userId });
  } catch (error) {
    throw new Error("Failed to fetch forum posts: " + error.message);
  }
  if (!posts || posts.length === 0) {
    throw new Error("Sorry, you haven't created any forums yet!!");
  }
  return posts;
};

// Get forum posts by tag ID
export const getForumPostsByTagId = async (tagId) => {
  let posts;
  tagId = isValidID(tagId, "tagID");
  try {
    posts = await Forum.find({ tags: tagId });
  } catch (error) {
    throw new Error("Failed to fetch forum posts: " + error.message);
  }
  if (!posts || posts.length === 0) {
    throw new Error(`No forum posts found with tag: ${tagId}`);
  }
  return posts;
};

// Get forum posts by status
export const getForumPostsByStatus = async (status) => {
  let posts;
  status = isValidString(status, "Status");
  try {
    posts = await Forum.find({ status: status });
  } catch (error) {
    throw new Error("Failed to fetch forum posts: " + error.message);
  }
  if (!posts || posts.length === 0) {
    throw new Error(`No forum posts found with status: ${status}`);
  }
  return posts;
};

// Get trending forum posts
export const getTrendingForumPosts = async (req, res) => {};

// Upvote a forum post
export const upvoteForumPost = async (forumId) => {
  forumId = isValidID(forumId, "ForumID");
  try {
    let forum = await Forum.findByIdAndUpdate(
      forumId,
      { $inc: { upVotes: 1 } },
      { new: true }
    );
    if (!forum) {
      throw new Error("Forum post not found.");
    }
    return forum;
  } catch (error) {
    throw new Error("Error While UpVoting the Post" + error.message);
  }
};

// Downvote a forum post
export const downvoteForumPost = async (forumId) => {
  forumId = isValidID(forumId, "ForumID");
  try {
    let forum = await Forum.findByIdAndUpdate(
      forumId,
      { $inc: { downVotes: 1 } },
      { new: true }
    );
    if (!forum) {
      throw new Error("Forum post not found.");
    }
    return forum;
  } catch (error) {
    throw new Error("Error While DownVoting the Post" + error.message);
  }
};

// Report a forum post
export const reportForumPost = async (req, res) => {};

// Unreport a forum post
export const unreportForumPost = async (req, res) => {};

// Get reported forum posts
export const getReportedForumPosts = async (req, res) => {};

// Change forum post status
export const changeForumPostStatus = async (req, res) => {};

// Get forum posts by multiple tags
// Can use the getForumPostsByTagId API
// export const getForumPostsByMultipleTags = async (req, res) => {};

// Delete a forum post image
export const deleteForumPostImage = async (req, res) => {};
