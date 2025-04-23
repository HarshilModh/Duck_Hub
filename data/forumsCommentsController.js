import mongoose from "mongoose";
import forumCommentsModel from "../models/forumsComments.model.js";
import { isValidString } from "../utils/validation.utils.js";
import { isValidID } from "../utils/validation.utils.js";

export const createForumComment = async (forumId,userId,content,imageURLs)=> {

    // Check if the required fields are passed
    if (!forumId || !userId || !content) {
        throw new Error("forumId, userId, and content are required.");
    }
    // Validate Content
    content = isValidString(content, "Comment Content");
    // Validate forumID
    forumId = isValidID(forumId, "forumId");
    // Validate userID
    userId = isValidID(userId, "userId");
    
    const newComment = new forumCommentsModel({
        forumId,
        userId,
        content,
        imageURLs: imageURLs || [],
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
}
// Get all comments for a forum post
export const getCommentsByForumId = async (forumId) => {
    if (!forumId) {
        throw new Error("forumId is required.");
    }
    forumId = isValidID(forumId, "forumId");
    try {
        const comments = await forumCommentsModel.find({ forumId }).populate('userId', 'firstName lastName');
        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Get a comment by its ID
export const getCommentById = async (commentId) => {
    if (!commentId) {
        throw new Error("commentId is required.");
    }
    commentId = isValidID(commentId, "commentId");
    try {
        const comment = await forumCommentsModel.findById(commentId).populate('userId', 'firstName lastName');
        if (!comment) {
            throw new Error("Comment not found.");
        }
        return comment;
    } catch (error) {
        throw new Error(error.message);
    }
}
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
}
// Delete a comment by its ID
export const deleteCommentById = async (commentId) => {
    if (!commentId) {
        throw new Error("commentId is required.");
    }
    commentId = isValidID(commentId, "commentId");
    try {
        const deletedComment = await forumCommentsModel.findByIdAndDelete(commentId);
        if (!deletedComment) {
            throw new Error("Comment not found or could not be deleted.");
        }
        return deletedComment;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Upvote a comment
export const upvoteComment = async (commentId) => {
    if (!commentId) {
        throw new Error("commentId is required.");
    }
    commentId = isValidID(commentId, "commentId");
    try {
        const updatedComment = await forumCommentsModel.findByIdAndUpdate(
            commentId,
            { $inc: { upVotes: 1 } },
            { new: true }
        );
        if (!updatedComment) {
            throw new Error("Comment not found or could not be upvoted.");
        }
        return updatedComment;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Downvote a comment
export const downvoteComment = async (commentId) => {
    if (!commentId) {
        throw new Error("commentId is required.");
    }
    commentId = isValidID(commentId, "commentId");
    try {
        const updatedComment = await forumCommentsModel.findByIdAndUpdate(
            commentId,
            { $inc: { downVotes: 1 } },
            { new: true }
        );
        if (!updatedComment) {
            throw new Error("Comment not found or could not be downvoted.");
        }
        return updatedComment;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get all comments
export const getAllComments = async () => {
    try {
        const comments = await forumCommentsModel.find().populate('userId', 'firstName lastName');
        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Get comments by user ID
export const getCommentsByUserId = async (userId) => {
    if (!userId) {
        throw new Error("userId is required.");
    }
    userId = isValidID(userId, "userId");
    try {
        const comments = await forumCommentsModel.find({ userId }).populate('forumId', 'title');
        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get trending comments
export const getTrendingComments = async () => {
    try {
        const trendingComments = await forumCommentsModel.find().sort({ upVotes: -1 }).limit(10);
        return trendingComments;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Get comments by keyword in content
export const getCommentsByKeyword = async (keyword) => {
    if (!keyword) {
        throw new Error("keyword is required.");
    }
    keyword = isValidString(keyword, "keyword");
    try {
        const comments = await forumCommentsModel.find({ content: { $regex: keyword, $options: "i" } }).populate('userId', 'firstName lastName');
        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Get comments by date range
export const getCommentsByDateRange = async (startDate, endDate) => {
    if (!startDate || !endDate) {
        throw new Error("startDate and endDate are required.");
    }
    try {
        const comments = await forumCommentsModel.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        }).populate('userId', 'firstName lastName');
        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Get comments by upvotes
export const getCommentsByUpvotes = async (minUpvotes) => {
    if (!minUpvotes) {
        throw new Error("minUpvotes is required.");
    }
    try {
        const comments = await forumCommentsModel.find({ upVotes: { $gte: minUpvotes } }).populate('userId', 'firstName lastName');
        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
}
// Get comments by downvotes
export const getCommentsByDownvotes = async (minDownvotes) => {
    if (!minDownvotes) {
        throw new Error("minDownvotes is required.");
    }
    try {
        const comments = await forumCommentsModel.find({ downVotes: { $gte: minDownvotes } }).populate('userId', 'firstName lastName');
        return comments;
    } catch (error) {
        throw new Error(error.message);
    }
}

