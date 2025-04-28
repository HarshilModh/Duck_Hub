import express from "express";
const router = express.Router();

import {
  isValidString,
  isValidArray,
  isValidID,
} from "../utils/validation.utils.js";
import {
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

router.route("/").get(async (req, res) => {
  const academicResources = await getAllAcademicResources();
  const loggedUserId = req.session.user?.user?._id || null;
  res.render("AcademicResourceLanding", {
    academicResources,
    loggedUserId,
    layout: "dashboard",
  });
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
