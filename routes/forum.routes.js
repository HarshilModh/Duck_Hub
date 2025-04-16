import express from "express";
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
} from "../data/forumsController.js";
getForumPostById;

//TODO: Implement Router Checks
router.route("/").post(async (req, res) => {
  const { userId, title, content, imageURLs, tags } = req.body;
  const post = await createForumPost(userId, title, content, imageURLs, tags);
  return res.status(201).json(post);
});

router.route("/").get(async (req, res) => {
  const posts = await getAllForumPosts(req, res);
  return res.status(200).json(posts);
});

// GET /forums/:id — Get a forum post by ID
router.route("/:id").get(async (req, res) => {
  const post = await getForumPostById(req, res);
  return res.status(200).json(post);
});

router.route("/user/:userId").get(async (req, res) => {
  const posts = await getForumPostsByUserId(req.params.userId);
  return res.status(200).json(posts);
});

router.route("/tag/:tagId").get(async (req, res) => {
  const posts = await getForumPostsByTagId(req.params.tagId);
  return res.json(posts);
});

router.route("/status/:status").get(async (req, res) => {
  const posts = await getForumPostsByStatus(req.params.status);
  return res.json(posts);
});

router.route("/upvote/:id").patch(async (req, res) => {
  const updatedPost = await upvoteForumPost(req.params.id);
  return res.json(updatedPost);
});

router.route("/downvote/:id").patch(async (req, res) => {
  const updatedPost = await downvoteForumPost(req.params.id);
  return res.json(updatedPost);
});

// DELETE /forums/:id
router.route("/:id").delete(async (req, res) => {
  const result = await deleteForumPostById(req.params.id);
  return res.json(result);
});

export default router;
