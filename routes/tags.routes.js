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
import xss from "xss";
import { isValidID, isValidString } from "../utils/validation.utils.js";

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
    let userId = xss(req.body.userId);
    let name = xss(req.body.name);
    if (!userId || !name) {
      req.session.toast = {
        type: "error",
        message: "User ID and name are required",
      };
      return res.status(400).json({ error: "User ID and name are required" });
    }
    try {
      userId = isValidID(userId, "userId");
      name = isValidString(name, "name");
    } catch (e) {
      req.session.toast = {
        type: "error",
        message: e.message,
      };
      return res.status(400).json({ error: e.message });
    }

    try {
      const createdTag = await createTag(userId, name);
      req.session.toast = {
        type: "success",
        message: "Tag created successfully",
      };
      return res.status(201).json(createdTag);
    } catch (e) {
      req.session.toast = {
        type: "error",
        message: e.message,
      };
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
    req.session.toast = {
      type: "success",
      message: "Tag updated successfully",
    };
    return res.status(201).json(updatedTag);
  } catch (e) {
    req.session.toast = {
      type: "error",
      message: e.message,
    };
    return res.status(500).json({ error: e });
  }
});
router.route("/delete/:id").delete(async (req, res) => {
  const tagId = req.params.id;
  try {
    const deletedTag = await deleteTagById(tagId);
    req.session.toast = {
      type: "success",
      message: "Tag deleted successfully",
    };
    return res.status(201).json(deletedTag);
  } catch (e) {
    req.session.toast = {
      type: "error",
      message: e.message,
    };  
    return res.status(500).json({ error: e });
  }
});

export default router;
