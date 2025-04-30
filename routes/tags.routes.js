import express from "express";
const router = express.Router();
import {
  createTag,
  getAllTags,
  getTagsById,
  getTagsByUser,
  updateTagById,
  deleteTagById,
} from "../data/tagController.js";

router
  .route("/")
  .get(async (req, res) => {
    try {
      const allTags = await getAllTags();
      return res.status(201).json(allTags);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  })
  .post(async (req, res) => {
    const { userId, name } = req.body;
    try {
      const createdTag = await createTag(userId, name);
      return res.status(201).json(createdTag);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
router.route("/:id").get(async (req, res) => {
  const tagId = req.params.id;
  try {
    const idTag = await getTagsById(tagId);
    return res.status(201).json(idTag);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
router.route("/:userId").get(async (req, res) => {
  const userId = req.params.id;
  try {
    const userTag = await getTagsByUser(userId);
    return res.status(201).json(userTag);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
router.route("/update/:id").put(async (req, res) => {
  const tagId = req.params.id;
  const { newTag } = req.body;
  try {
    const updatedTag = await updateTagById(tagId, newTag);
    return res.status(201).json(updatedTag);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
router.route("/delete/:id").delete(async (req, res) => {
  const tagId = req.params.id;
  try {
    const deletedTag = await deleteTagById(tagId);
    return res.status(201).json(deletedTag);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

export default router;
