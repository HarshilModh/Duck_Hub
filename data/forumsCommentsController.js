import mongoose from "mongoose";
import forumCommentsModel from "../models/forumsComments.model.js";
import CommentVotes from "../models/forumCommentVotes.model.js";
import Reports from "../models/reports.model.js";
import { isValidString } from "../utils/validation.utils.js";
import { isValidID } from "../utils/validation.utils.js";
import Forum from "../models/forums.model.js";
import Poll from "../models/polls.model.js";
export const createForumComment = async (
  forumId,
  userId,
  content,
  imageURLs,
  commentFor
) => {
  if (!forumId || !userId || !content || !commentFor) {
    throw new Error("forumId, userId, commentFor, and content are required.");
  }
  content = isValidString(content, "Comment Content");
  forumId = isValidID(forumId, "forumId");
  userId = isValidID(userId, "userId");

  const newComment = new forumCommentsModel({
    forumId,
    userId,
    content,
    imageURLs: imageURLs || [],
    commentFor,
    upVotes: 0,
    downVotes: 0,
  });
  try {
    const savedComment = await newComment.save();
    if (!savedComment || !savedComment._id) {
      throw new Error("Could not create a new comment");
    }
    return savedComment;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get all comments for a forum post
export const getCommentsByForumId = async (forumId) => {
  if (!forumId) {
    throw new Error("forumId is required.");
  }
  forumId = isValidID(forumId, "forumId");
  try {
    const comments = await forumCommentsModel
      .find({ forumId })
      .populate("userId", "firstName lastName")
      .lean();
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get a comment by its ID
export const getCommentById = async (commentId) => {
  if (!commentId) {
    throw new Error("commentId is required.");
  }
  commentId = isValidID(commentId, "commentId");
  try {
    const comment = await forumCommentsModel
      .findById(commentId)
      .populate("userId", "firstName lastName");
    if (!comment) {
      throw new Error("Comment not found.");
    }
    return comment;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Update a comment by its ID
export const updateCommentById = async (commentId, updatedContent) => {
  if (!commentId || !updatedContent) {
    throw new Error("commentId and updatedContent are required.");
  }
  commentId = isValidID(commentId, "commentId");
  updatedContent = isValidString(updatedContent, "Updated Content");
  try {
    const updatedComment = await forumCommentsModel.findByIdAndUpdate(
      commentId,
      { content: updatedContent },
      { new: true }
    );
    if (!updatedComment) {
      throw new Error("Comment not found or could not be updated.");
    }
    return updatedComment;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Delete a comment by its ID
export const deleteCommentById = async (commentId) => {
  if (!commentId) {
    throw new Error("commentId is required.");
  }
  commentId = isValidID(commentId, "commentId");
  try {
    const deletedComment = await forumCommentsModel.findByIdAndDelete(
      commentId
    );
    if (!deletedComment) {
      throw new Error("Comment not found or could not be deleted.");
    }
    return deletedComment;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Upvote a comment
export const upvoteComment = async (commentId, userId) => {
  commentId = isValidID(commentId, "commentId");
  userId = isValidID(userId, "UserID");

  let existingVote = await CommentVotes.findOne({
    commentId: commentId,
    voterId: userId,
  });

  if (!existingVote) {
    const updatedComment = await forumCommentsModel.findByIdAndUpdate(
      commentId,
      { $inc: { upVotes: 1 } },
      { new: true }
    );
    if (!updatedComment) {
      throw new Error("Comment not found or could not be upvoted.");
    }

    const newVote = new CommentVotes({
      voterId: userId,
      commentId: commentId,
      voteType: "UP",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }

    return updatedComment;
  }

  if (existingVote && existingVote.voteType === "UP") {
    throw new Error("You can't vote for a comment more than once !");
  }

  if (existingVote && existingVote.voteType === "DOWN") {
    const updatedComment = await forumCommentsModel.findByIdAndUpdate(
      commentId,
      { $inc: { upVotes: 1, downVotes: -1 } },
      { new: true }
    );

    if (!updatedComment) {
      throw new Error("Comment not found or could not be upvoted.");
    }
    let updatedVote = await CommentVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "UP" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not upvote the previous downVote");
    }
    return updatedComment;
  }
};
// Downvote a comment
export const downvoteComment = async (commentId, userId) => {
  commentId = isValidID(commentId, "commentId");
  userId = isValidID(userId, "UserID");

  let existingVote = await CommentVotes.findOne({
    commentId: commentId,
    voterId: userId,
  });

  if (!existingVote) {
    const updatedComment = await forumCommentsModel.findByIdAndUpdate(
      commentId,
      { $inc: { downVotes: 1 } },
      { new: true }
    );
    if (!updatedComment) {
      throw new Error("Comment not found or could not be upvoted.");
    }

    const newVote = new CommentVotes({
      voterId: userId,
      commentId: commentId,
      voteType: "DOWN",
    });

    const savedVote = await newVote.save();
    if (!savedVote || !savedVote._id) {
      throw new Error("Could not create a document for new Vote");
    }

    return updatedComment;
  }

  if (existingVote && existingVote.voteType === "DOWN") {
    throw new Error("You can't vote for a comment more than once !");
  }

  if (existingVote && existingVote.voteType === "UP") {
    const updatedComment = await forumCommentsModel.findByIdAndUpdate(
      commentId,
      { $inc: { upVotes: -1, downVotes: 1 } },
      { new: true }
    );

    if (!updatedComment) {
      throw new Error("Comment not found or could not be upvoted.");
    }
    let updatedVote = await CommentVotes.findByIdAndUpdate(
      existingVote._id,
      { $set: { voteType: "DOWN" } },
      { new: true }
    );
    if (!updatedVote) {
      throw new Error("Could not upvote the previous downVote");
    }
    return updatedComment;
  }
};

// Get all comments
export const getAllComments = async () => {
  try {
    const comments = await forumCommentsModel
      .find()
      .populate("userId", "firstName lastName");
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get comments by user ID
export const getCommentsByUserId = async (userId) => {
  if (!userId) {
    throw new Error("userId is required.");
  }
  userId = isValidID(userId, "userId");
  try {
    const comments = await forumCommentsModel
      .find({ userId })
      .populate("forumId", "title");
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get trending comments
export const getTrendingComments = async () => {
  try {
    const trendingComments = await forumCommentsModel
      .find()
      .sort({ upVotes: -1 })
      .limit(10);
    return trendingComments;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get comments by keyword in content
export const getCommentsByKeyword = async (keyword) => {
  if (!keyword) {
    throw new Error("keyword is required.");
  }
  keyword = isValidString(keyword, "keyword");
  try {
    const comments = await forumCommentsModel
      .find({ content: { $regex: keyword, $options: "i" } })
      .populate("userId", "firstName lastName");
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get comments by date range
export const getCommentsByDateRange = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required.");
  }
  try {
    const comments = await forumCommentsModel
      .find({
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      })
      .populate("userId", "firstName lastName");
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get comments by upvotes
export const getCommentsByUpvotes = async (minUpvotes) => {
  if (!minUpvotes) {
    throw new Error("minUpvotes is required.");
  }
  try {
    const comments = await forumCommentsModel
      .find({ upVotes: { $gte: minUpvotes } })
      .populate("userId", "firstName lastName");
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Get comments by downvotes
export const getCommentsByDownvotes = async (minDownvotes) => {
  if (!minDownvotes) {
    throw new Error("minDownvotes is required.");
  }
  try {
    const comments = await forumCommentsModel
      .find({ downVotes: { $gte: minDownvotes } })
      .populate("userId", "firstName lastName");
    return comments;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const reportPoll = async (pollId, userId) => {
  pollId = isValidID(pollId, "PollID");
  userId = isValidID(userId, "UserID");

  try {
    let reportCount = await Reports.countDocuments({
      pollId: pollId,
    });
    console.log("Report Count: ", reportCount);

    if (reportCount > 5) {
      let poll = await Poll.findByIdAndUpdate(
        pollId,
        {
          $set: { status: "hidden" },
          $push: { reportedBy: userId },
        },
        { new: true }
      );
    } else {
      let poll = await Poll.findByIdAndUpdate(pollId, {
        $push: { reportedBy: userId },
      });
    }

    let poll = await Poll.findById(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    return poll;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const reportForum = async (forumId, userId) => {
  forumId = isValidID(forumId, "ForumID");
  userId = isValidID(userId, "UserID");

  try {
    let reportCount = await Reports.countDocuments({
      forumId: forumId,
    });
    console.log("Report Count: ", reportCount);

    if (reportCount > 5) {
      let forum = await Forum.findByIdAndUpdate(
        forumId,
        {
          $set: { status: "hidden" },
          $push: { reportedBy: userId },
        },
        { new: true }
      );
    } else {
      let forum = await Forum.findByIdAndUpdate(forumId, {
        $push: { reportedBy: userId },
      });
    }

    let forum = await Forum.findById(forumId);
    if (!forum) {
      throw new Error("Forum not found");
    }

    return forum;
  } catch (error) {
    throw new Error(error.message);
  }
};
