import Tags from "../models/tags.model.js";
import {
  createAcademicResource,
  deleteAcacdemicResourceById,
  downvoteAcademicResource,
  filterAcademicResources,
  getAcademicResourceByStatus,
  getAcademicResourceByTagId,
  getAcademicResourceByUserId,
  getAllAcademicResources,
  getReportedAcademicResources,
  upvoteAcademicResource,
} from "../data/academicResourcesController.js";

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  isValidString,
  isValidArray,
  isValidID,
} from "../utils/validation.utils.js";

import express from "express";
import { getAllTags } from "../data/tagController.js";
const router = express.Router();

router.route("/").get(async (req, res) => {
  const academicResources = await getAllAcademicResources();
  const loggedUserId = req.session.user?.user?._id || null;
  res.render("AcademicResourceLanding", {
    academicResources,
    loggedUserId,
    layout: "dashboard",
    customStyles:
      '<link rel="stylesheet" href="/public/css/academicResourceLanding.css">',
  });
});

router
  .route("/create")
  .get(isLoggedIn, async (req, res) => {
    try {
      const tags = await getAllTags();
      const loggedUserId = req.session.user?.user?._id || null;
      res.render("createAcademicResource", {
        tags,
        loggedUserId,
        layout: "dashboard",
        customStyles:
          '<link rel="stylesheet" href="/public/css/createAcademicResource.css">',
      });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error loading create academic resource page");
    }
  })
  .post(async (req, res) => {
    try {
      const { userId, title, description, url, tags } = req.body;

      const tagsArray = tags ? tags.map((t) => t.trim()) : [];
      const academicResource = await createAcademicResource(
        userId,
        title,
        description,
        url,
        tagsArray
      );
      if (academicResource) {
        return res.status(201).redirect("/academicResources");
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

router.route("/:id").get(async (req, res) => {
  const academicResourceId = req.params.id;
  const academicResource = await getAllAcademicResources(academicResourceId);
  return res.status(200).json(academicResource);
});

router.route("/user/:userId").get(async (req, res) => {
  const userId = req.params.userId;
  const academicResources = await getAcademicResourceByUserId(userId);
  return res.status(200).json(academicResources);
});

router.route("/tag/:tagId").get(async (req, res) => {
  const tagId = req.params.tagId;
  const academicResources = await getAcademicResourceByTagId(tagId);
  return res.json(academicResources);
});

router.route("/status/:status").get(async (req, res) => {
  const status = req.params.status;
  const academicResources = await getAcademicResourceByStatus(status);
  return res.json(academicResources);
});

router.route("/upvote/:id").put(async (req, res) => {
  const academicResourceId = req.params.id;
  const userId = req.body.userId;
  const upvotedResource = await upvoteAcademicResource(
    academicResourceId,
    userId
  );
  return res.json(upvotedResource);
});

router.route("/downvote/:id").put(async (req, res) => {
  const academicResourceId = req.params.id;
  const userId = req.body.userId;
  const downvotedResource = await downvoteAcademicResource(
    academicResourceId,
    userId
  );
  return res.json(downvotedResource);
});

router.route("/:id").delete(async (req, res) => {
  const academicResourceId = req.params.id;
  const deletedResource = await deleteAcacdemicResourceById(academicResourceId);
  return res.json(deletedResource);
});

router.route("/search").get(async (req, res) => {
  const { keyword } = req.query;
  try {
    const filteredAcademicResources = await filterAcademicResources(keyword);
    return res.status(200).json(filteredAcademicResources);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.route("/reported").get(async (req, res) => {
  try {
    const reportedAcademicResources = await getReportedAcademicResources();
    return res.status(200).json(reportedAcademicResources);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
