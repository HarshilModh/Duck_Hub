import mongoose from "mongoose";
import Forum from "../models/forums.model.js";
import Poll from "../models/polls.model.js";
import Tag from "../models/tags.model.js";
import ForumVotes from "../models/forumVotes.model.js";
import { getUserById } from "./userController.js";
import {
  isValidID,
  isValidArray,
  isValidString,
} from "../utils/validation.utils.js";
import Reports from "../models/reports.model.js";

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
    const allPosts = await Forum.find()
      .populate("userId tags", "firstName lastName name")
      .select("-reportedBy")
      .lean();
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
  const forumPost = await Forum.findById(id)
    .populate("userId", "firstName lastName")
    .lean();
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
export const filterForumPosts = async (keyword) => {
  try {
    keyword = isValidString(keyword, "keyword");
    const posts = await Forum.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { content: { $regex: keyword, $options: "i" } },
      ],
    });
    if (!posts || posts.length === 0) {
      throw new Error("No posts found matching the keyword.");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get forum posts by user ID
export const getForumPostsByUserId = async (userId) => {
  let posts;
  userId = isValidID(userId, "UserID");
  try {
    posts = await Forum.find({ userId: userId })
      .populate("userId", "firstName lastName")
      .lean();
  } catch (error) {
    throw new Error("Failed to fetch forum posts: " + error.message);
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
export const upvoteForumPost = async (forumId, userId) => {
  forumId = isValidID(forumId, "ForumID");
  userId = isValidID(userId, "UserID");

  // Checking if the user voted previously
  let existingVote = await ForumVotes.findOne({
    forumId: forumId,
    voterId: userId,
  });

  // If not, create a new vote and also update the upVote count by 1
  if (!existingVote) {
    let forum = await Forum.findByIdAndUpdate(
      forumId,
      { $inc: { upVotes: 1 } },
      { new: true }
    );
    if (!forum) {
      throw new Error("Forum post not found.");
    }

    const newVote = new ForumVotes({
      voterId: userId,
      forumId: forumId,
      voteType: "UP",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }
    return forum;
  }

  // If there was a upVote, throw error
  if (existingVote && existingVote.voteType === "UP") {
    throw new Error("You can't vote for a forum more than once !");
  }

  // If there was a downVote, remove it and create a new upVote
  if (existingVote && existingVote.voteType === "DOWN") {
    let forum = await Forum.findByIdAndUpdate(
      forumId,
      { $inc: { upVotes: 1, downVotes: -1 } },
      { new: true }
    );
    if (!forum) {
      throw new Error("Forum post not found.");
    }

    let updatedVote = await ForumVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "UP" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not upvote the previous downVote");
    }
    return forum;
  }
};

// Downvote a forum post
export const downvoteForumPost = async (forumId, userId) => {
  forumId = isValidID(forumId, "ForumID");
  userId = isValidID(userId, "UserID");

  // Checking if the user voted previously
  let existingVote = await ForumVotes.findOne({
    forumId: forumId,
    voterId: userId,
  });

  // If not, create a new vote and also update the downVote count by 1
  if (!existingVote) {
    let forum = await Forum.findByIdAndUpdate(
      forumId,
      { $inc: { downVotes: 1 } },
      { new: true }
    );
    if (!forum) {
      throw new Error("Forum post not found.");
    }

    const newVote = new ForumVotes({
      voterId: userId,
      forumId: forumId,
      voteType: "DOWN",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }
    return forum;
  }

  // If there was a downVote, throw error
  if (existingVote && existingVote.voteType === "DOWN") {
    throw new Error("You can't vote for a forum more than once !");
  }

  // If there was a upVote, remove it and create a new downVote
  if (existingVote && existingVote.voteType === "UP") {
    let forum = await Forum.findByIdAndUpdate(
      forumId,
      { $inc: { upVotes: -1, downVotes: 1 } },
      { new: true }
    );
    if (!forum) {
      throw new Error("Forum post not found.");
    }

    let updatedVote = await ForumVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "DOWN" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not downVote the previous upVote");
    }
    return forum;
  }
};

// Report a forum post
export const reportForumPost = async (forumId, userId) => {
  forumId = isValidID(forumId, "ForumID");
  userId = isValidID(userId, "UserID");

  try {
    let forum = Forum.findByIdAndUpdate(forumId, {
      $set: { status: "reported" },
      $push: { reportedBy: userId },
    });

    if (!forumId) {
      throw new Error("Forum not found");
    }
    return forum;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Unreport a forum post
export const unreportForumPost = async (forumId, userId) => {
  forumId = isValidID(forumId, "Forum ID");
  userId = isValidID(userId, "UserID");
  try {
    let forum = Forum.findByIdAndUpdate(forumId, {
      $set: { reportedBy: null, status: "active" },
    });
    if (!forum) {
      throw new Error("Forum not found");
    }
    return forum;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get reported forum posts
export const getReportedForumPosts = async () => {
  try {
    const reportedPosts = await Forum.find({
      reportedBy: { $exists: true, $not: { $size: 0 } },
    });
    if (!reportedPosts || reportedPosts.length === 0) {
      throw new Error("No Forum Posts were Reported");
    }
    return reportedPosts;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Change forum post status
export const changeForumPostStatus = async (req, res) => {};

// Get forum posts by multiple tags
// Can use the getForumPostsByTagId API
// export const getForumPostsByMultipleTags = async (req, res) => {};

// Probably not necessary
// Delete a forum post image
// export const deleteForumPostImage = async (req, res) => {};

export async function searchFilterSort({
  text = "",
  postType,
  sort = "createdAt",
  order = "desc",
}) {
  const sortOption = { [sort]: order === "asc" ? 1 : -1 };
  const trimmed = text.trim();
  const regex = trimmed ? new RegExp(trimmed, "i") : null;

  const forumFilter = {};
  const pollFilter = {};

  let tagIds = [];
  if (regex) {
    const matchingTags = await Tag.find({ name: regex }).select("_id").lean();
    tagIds = matchingTags.map((t) => t._id);

    forumFilter.$or = [
      { title: regex },
      { content: regex },
      ...(tagIds.length ? [{ tags: { $in: tagIds } }] : []),
    ];

    pollFilter.$or = [
      { question: regex },
      ...(tagIds.length ? [{ tags: { $in: tagIds } }] : []),
    ];
  }

  let [forumPosts, pollPosts] = [[], []];

  if (!postType || postType === "forums") {
    forumPosts = await Forum.find(forumFilter)
      .sort(sortOption)
      .populate("userId tags", "firstName lastName name -_id")
      .lean();
  }

  if (!postType || postType === "polls") {
    pollPosts = await Poll.find(pollFilter)
      .sort(sortOption)
      .populate("createdBy tags", "firstName lastName name -_id")
      .lean();
  }

  return { forumPosts, pollPosts };
}
