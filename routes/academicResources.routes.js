import {
  createAcademicResource,
  deleteAcacdemicResourceById,
  downvoteAcademicResource,
  filterAcademicResources,
  getAcademicResourceById,
  getAcademicResourceByStatus,
  getAcademicResourceByTagId,
  getAcademicResourceByUserId,
  getAllAcademicResources,
  getReportedAcademicResources,
  searchAcademicResourceFilterSort,
  upvoteAcademicResource,
} from "../data/academicResourcesController.js";
import AdminTags from "../models/preDefinedTags.model.js";

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  isValidString,
  isValidArray,
  isValidID,
} from "../utils/validation.utils.js";

import xss from "xss";

import { getAllTags } from "../data/tagController.js";
import express from "express";
import AcademicResourceVotes from "../models/academicResourceVotes.model.js";
const router = express.Router();

router.route("/").get(isLoggedIn, async (req, res) => {
  const academicResources = await getAllAcademicResources();
  const loggedUserId = req.session.user?.user?._id || null;
  res.render("AcademicResourceLanding", {
    academicResources,
    loggedUserId,
    customStyles:
      '<link rel="stylesheet" href="/public/css/academicResourceLanding.css">',
  });
});

router
  .route("/create")
  .get(isLoggedIn, async (req, res) => {
    try {
      const tags = await AdminTags.find({}).lean();
      const loggedUserId = req.session.user?.user?._id || null;
      const loggedUserType = req.session.user?.user?.role || null;
      const isAdmin = loggedUserType === "admin";
      res.render("createAcademicResource", {
        tags,
        loggedUserId,
        isAdmin,
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
      let userId = xss(req.body.userId);
      let title = xss(req.body.title);
      let description = xss(req.body.description); 
      let url = xss(req.body.url);
      let tags = xss(req.body.tags); 
      let tagsArray;
      if (!tags) {
        tagsArray = [];
      } else if (!Array.isArray(tags)) {
        tagsArray = [tags.trim()];
      } else {
        tagsArray = tags.map((t) => t.trim());
      }
      const academicResource = await createAcademicResource(
        userId,
        title,
        description,
        url,
        tagsArray
      );
      if (academicResource) {
        req.session.toast = {
          type: "success",
          message: "Academic resource created successfully!",
        };
        return res.status(201).redirect("/academicResources");
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
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
  return res.json(academicResources)
});

router.route("/upvote/:id").put(async (req, res) => {
  const academicResourceId = req.params.id;
  const userId = req.body.userId;

  let existingVote = await AcademicResourceVotes.findOne({
    academicResourceId: academicResourceId,
    voterId: userId,
  });
  if (existingVote?.voteType === "UP") {
    req.session.toast = {
      type: "error",
      message: "You can't upvote a resource twice.",
    };
    return res.status(400).json({ error: "Duplicate upvote" });
  }
  try {
    const upvotedResource = await upvoteAcademicResource(
      academicResourceId,
      userId
    );
    req.session.toast = {
      type: "success",
      message: "Upvoted successfully!",
    };
    return res.json(upvotedResource);
  } catch (error) {
    console.error("Upvote error:", error);
    req.session.toast = {
      type: "error",
      message: "Failed to upvote the academic resource. Please try again.",
    };
    return res.status(500).json({ error: "Upvote failed" });
  }
});

router.route("/downvote/:id").put(async (req, res) => {
  const academicResourceId = req.params.id;
  const userId = xss(req.body.userId);
  let existingVote = await AcademicResourceVotes.findOne({
    academicResourceId: academicResourceId,
    voterId: userId,
  });
  if (existingVote?.voteType === "DOWN") {
    req.session.toast = {
      type: "error",
      message: "You can't down vote a resource twice.",
    };
    return res.status(400).json({ error: "Duplicate down vote" });
  }
  try {
    const downvotedResource = await downvoteAcademicResource(
      academicResourceId,
      userId
    );
    req.session.toast = {
      type: "success",
      message: "Downvoted successfully!",
    };
    return res.json(downvotedResource);
  } catch (error) {
    console.error("Downvote error:", error);
    req.session.toast = {
      type: "error",
      message: "Failed to downvote the academic resource. Please try again.",
    };
    return res.status(500).json({ error: "Downvote failed" });
  }
});

router.route("/:id").delete(async (req, res) => {
  const academicResourceId = req.params.id;
  const deletedResource = await deleteAcacdemicResourceById(academicResourceId);
  return res.json(deletedResource);
});

router.route("/search").get(isLoggedIn, async (req, res) => {
  try {
    let { text = "", sort = "createdAt", order = "desc" } = req.query;
    text = xss(text);
    const ALLOWED_SORTS = ["createdAt", "title", "url"];
    const ALLOWED_ORDERS = ["asc", "desc"];

    if (!ALLOWED_SORTS.includes(sort)) {
      sort = "createdAt";
    }
    if (!ALLOWED_ORDERS.includes(order.toLowerCase())) {
      order = "desc";
    }
    const academicResources = await searchAcademicResourceFilterSort(
      text,
      sort,
      order
    );

    if (academicResources.length === 0) {
      req.session.toast = {
        type: "error",
        message:
          "The given search did not return any results. Please try again with a different keyword.",
      };
      return res.redirect("/academicResources");
    }
    return res.render("academicResourceLanding", {
      academicResources,
      text,
      sort,
      order,
      loggedInUserId: req.session.user?.user?._id ?? null,
      customStyles:
        '<link rel="stylesheet" href="/public/css/academicResourceLanding.css">',
    });
  } catch (error) {
    req.session.toast = {
      type: "error",
      message: "Failed to search Academic Resources. Please try again.",
    };
    return res.redirect("/academicResources");
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

router.route("/:id").get(async (req, res) => {
  const academicResourceId = req.params.id;
  const academicResource = await getAcademicResourceById(academicResourceId);
  return res.status(200).json(academicResource);
});

export default router;
