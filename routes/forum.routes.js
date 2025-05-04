import express from "express";
import multer from "multer";
import fs from "fs";
import Forum from "../models/forums.model.js";
import ForumVotes from "../models/forumVotes.model.js";
import { userImage } from "../middlewares/cloudinary.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import Tags from "../models/tags.model.js";
import Poll from "../models/polls.model.js";
const router = express.Router();
import {
  getForumPostById,
  getAllForumPosts,
  createForumPost,
  getForumPostsByStatus,
  getForumPostsByTagId,
  getForumPostsByUserId,
  downvoteForumPost,
  upvoteForumPost,
  deleteForumPostById,
  updateForumPostById,
  filterForumPosts,
  searchFilterSort,
  getReportedForumPosts,
} from "../data/forumsController.js";

import {
  isValidString,
  isValidArray,
  isValidID,
} from "../utils/validation.utils.js";

import {
  createForumComment,
  getCommentsByForumId,
  upvoteComment,
  downvoteComment,
  deleteCommentById,
} from "../data/forumsCommentsController.js";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Setup multer for temp file storage
const upload = multer({ dest: "uploads/" });

//TODO: Implement Router Checks
router
  .route("/")
  .post(isLoggedIn, upload.array("images", 5), async (req, res) => {
    try {
      const { userId, title, content, tags } = req.body;
      let imageURLs = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const cloudinaryUrl = await userImage(file.path);
          imageURLs.push(cloudinaryUrl);
          fs.unlinkSync(file.path); // deletes the reference from the uploads folder
        }
      }

      let tagsArray;
      if (!tags) {
        tagsArray = [];
      } else if (!Array.isArray(tags)) {
        tagsArray = [tags.trim()];
      } else {
        tagsArray = tags.map((t) => t.trim());
      }

      const post = await createForumPost(
        userId,
        title,
        content,
        imageURLs,
        tagsArray
      );
      return res.status(201).json(post);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

router.get("/create", isLoggedIn, async (req, res) => {
  try {
    const tags = await Tags.find({}).lean();
    const loggedUserId = req.session.user?.user?._id || null;
    res.render("createPost", {
      tags,
      loggedUserId,
      customStyles: '<link rel="stylesheet" href="/public/css/createPost.css">',
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error loading create post page");
  }
});

router.route("/").get(isLoggedIn, async (req, res) => {
  const forumPosts = await getAllForumPosts();
  const polls = await Poll.find()
    .populate("createdBy", "firstName lastName")
    .lean();
  const loggedUserId = req.session.user?.user?._id || null;
  res.render("forumLanding", {
    forumPosts,
    pollPosts: polls,
    loggedUserId,
    customStyles: '<link rel="stylesheet" href="/public/css/forumLanding.css">',
  });
});

router.get("/search", isLoggedIn, async (req, res, next) => {
  try {
    const {
      text = "",
      postType,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    if (!postType || (postType !== "forums" && postType !== "polls")) {
      req.session.toast = {
        type: "error",
        message: "Please select a valid post type.",
      };
      return res.redirect("/forums");
    }

    const { forumPosts, pollPosts } = await searchFilterSort({
      text,
      postType,
      sort,
      order,
    });

    return res.render("forumLanding", {
      forumPosts,
      pollPosts,
      text,
      postType,
      sort,
      order,
      loggedInUserId: req.session.user?.user?._id ?? null,
      customStyles:
        '<link rel="stylesheet" href="/public/css/forumLanding.css">',
    });
  } catch (err) {
    req.session.toast = {
      type: "error",
      message: "Failed to search posts. Please try again.",
    };
    return res.redirect("/forums");
  }
});

// GET /forums/:id — Get a forum post by ID
router.route("/:id").get(async (req, res) => {
  const post = await getForumPostById(req, res);
  return res.status(200).json(post);
});

router.route("/user/:userId").get(isLoggedIn, async (req, res) => {
  const posts = await getForumPostsByUserId(req.params.userId);
  res.render("userForums", {
    forumPosts: posts,
    customStyles: '<link rel="stylesheet" href="/public/css/userForums.css">',
  });
});

router.route("/tag/:tagId").get(async (req, res) => {
  const posts = await getForumPostsByTagId(req.params.tagId);
  return res.json(posts);
});

router.route("/status/:status").get(async (req, res) => {
  const posts = await getForumPostsByStatus(req.params.status);
  return res.json(posts);
});

// routes/forum.routes.js

router.put("/upvote/:id", async (req, res) => {
  const userId = req.body.userId;

  // check duplicate
  const existing = await ForumVotes.findOne({
    forumId: req.params.id,
    voterId: userId,
  });

  if (existing?.voteType === "UP") {
    req.session.toast = {
      type: "error",
      message: "You can't upvote a post twice.",
    };
    return res.status(400).json({ error: "Duplicate upvote" });
  }

  try {
    const updated = await upvoteForumPost(req.params.id, userId);
    req.session.toast = {
      type: "success",
      message: "Upvoted successfully!",
    };
    return res.json({ upVotes: updated.upVotes });
  } catch (error) {
    console.error("Upvote error:", error);
    req.session.toast = {
      type: "error",
      message: "Failed to upvote the post. Please try again.",
    };
    return res.status(500).json({ error: "Upvote failed" });
  }
});

router.put("/downvote/:id", async (req, res) => {
  const userId = req.body.userId;

  const existing = await ForumVotes.findOne({
    forumId: req.params.id,
    voterId: userId,
  });
  if (existing?.voteType === "DOWN") {
    req.session.toast = {
      type: "error",
      message: "You can't downvote a post twice.",
    };
    return res.status(400).json({ error: "Duplicate downvote" });
  }

  try {
    const updatedPost = await downvoteForumPost(req.params.id, userId);
    req.session.toast = {
      type: "success",
      message: "Downvoted successfully!",
    };
    return res.json({ downVotes: updatedPost.downVotes });
  } catch (error) {
    console.error("Downvote error:", error);
    req.session.toast = {
      type: "error",
      message: "Failed to downvote the post. Please try again.",
    };
    return res.status(500).json({ error: "Downvote failed" });
  }
});

// DELETE /forums/:id
router.route("/:id").delete(async (req, res) => {
  const result = await deleteForumPostById(req.params.id);
  return res.json(result);
});

router.route("/:id").put(upload.array("images", 5), async (req, res) => {
  let forumId;
  try {
    forumId = isValidID(req.params.id, "Forum Post ID");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    const previousForum = await Forum.findById(forumId);
    if (!previousForum) {
      return res.status(404).json({ error: "Forum post not found" });
    }
    let { title, content, tags } = req.body;
    let imageURLs = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryUrl = await userImage(file.path);
        imageURLs.push(cloudinaryUrl);
        fs.unlinkSync(file.path); // deletes the reference from the uploads folder
      }
    }

    title = isValidString(title, "Title");
    content = isValidString(content, "Content");
    if (tags && !Array.isArray(tags)) {
      tags = [tags];
    }
    tags = await isValidArray(tags, "Tags");
    const updatedPost = await updateForumPostById(forumId, {
      title,
      content,
      imageURLs,
      tags,
    });
    return res.status(200).json(updatedPost);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to update forum post: " + err.message });
  }
});

// router.route("/search").get(async (req, res) => {
//   const { keyword } = req.query;
//   try {
//     const filteredPosts = await filterForumPosts(keyword);
//     return res.status(200).json(filteredPosts);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// });

router.route("/reported").get(async (req, res) => {
  try {
    const reportedPosts = await getReportedForumPosts();
    return res.status(200).json(reportedPosts);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/// FORUM COMMENT RELATED ROUTES

router.route("/comments/:forumId").get(async (req, res) => {
  try {
    const forumId = req.params.forumId;
    const comments = await getCommentsByForumId(forumId);
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.route("/comments/view/:forumId").get(isLoggedIn, async (req, res) => {
  try {
    const forumId = req.params.forumId;
    let forum;
    let isPoll = false;
    const exists = await Forum.exists({ _id: forumId });
    if (!exists) {
      forum = await Poll.findById(forumId)
        .populate("createdBy", "firstName lastName")
        .lean();
      isPoll = true;
    } else {
      forum = await getForumPostById(forumId);
    }

    const comments = await getCommentsByForumId(forumId);
    const loggedUserId = req.session.user?.user?._id || null;

    res.render("forumComments", {
      forum,
      comments,
      loggedUserId,
      isPoll,
      customStyles:
        '<link rel="stylesheet" href="/public/css/forumComments.css">',
    });
  } catch (err) {
    return res.status(500).send("Error loading comments page.");
  }
});

router.route("/user/comments/view/:id").get(isLoggedIn, async (req, res) => {
  try {
    const forumId = req.params.id;
    const forum = await getForumPostById(forumId);
    const comments = await getCommentsByForumId(forumId);
    const loggedUserId = req.session.user?.user?._id || null;

    res.render("commentDelete", {
      forum,
      comments,
      loggedUserId,
      customStyles:
        '<link rel="stylesheet" href="/public/css/forumComments.css">',
    });
  } catch (err) {
    return res.status(500).send("Error loading comments page.");
  }
});

router.route("/comments").post(upload.array("images", 5), async (req, res) => {
  try {
    const { forumId, userId, content } = req.body;
    let imageURLs = [];

    let commentFor = "forum";

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const cloudinaryUrl = await userImage(file.path);
        imageURLs.push(cloudinaryUrl);
        fs.unlinkSync(file.path); // deletes the reference from the uploads folder
      }
    }

    const exists = await Forum.exists({ _id: forumId });
    if (!exists) {
      commentFor = "poll";
    }

    const newComment = await createForumComment(
      forumId,
      userId,
      content,
      imageURLs,
      commentFor
    );

    return res.redirect(`/forums/comments/view/${forumId}`);
  } catch (error) {
    return res.status(400).send("Error adding comment: " + error.message);
  }
});

router.route("/comments/add/:forumId").get(isLoggedIn, (req, res) => {
  const userId = req.session.user?.user?._id;
  const forumId = req.params.forumId;

  if (!userId) {
    req.session.toast = {
      type: "error",
      message: "Please login to add a comment.",
    };
  }

  res.render("addComment", {
    forumId,
    userId,
    customStyles: '<link rel="stylesheet" href="/public/css/addComment.css">',
  });
});

router.route("/comments/upvote/:commentId").put(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedComment = await upvoteComment(commentId, userId);
    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.route("/comments/downvote/:commentId").put(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedComment = await downvoteComment(commentId, userId);
    return res.status(200).json(updatedComment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router
  .route("/comments/:commentId")
  .delete(isLoggedIn, async (req, res, next) => {
    try {
      const commentId = req.params.commentId;
      await deleteCommentById(commentId);
      return res.json({ success: true, message: "Comment deleted." });
    } catch (err) {
      console.error("Error deleting comment:", err);
      return res.status(500).json({ error: "Failed to delete comment." });
    }
  });

export default router;
