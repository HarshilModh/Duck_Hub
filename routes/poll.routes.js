import express from "express";
import multer from "multer";
import fs from "fs";
import Poll from "../models/polls.model.js";
import { createPoll, voteOnPoll } from "../data/pollController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { userImage, uploadImagesGuard } from "../middlewares/cloudinary.js";
import xss from "xss";
import Comment from "../models/forumsComments.model.js";
import { isValidArray, isValidString } from "../utils/validation.utils.js";

const router = express.Router();

// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for temp file storage
// const upload = multer({ dest: "uploads/" });

router.route("/").post(isLoggedIn, uploadImagesGuard, async (req, res) => {
  let { question, options, tags, createdBy } = req.body;
  question = xss(question);
  for (let i = 0; i < options.length; i++) {
    options[i] = xss(options[i]);
  }
  createdBy = xss(createdBy);
  if (tags) {
    for (let i = 0; i < tags.length; i++) {
      tags[i] = xss(tags[i]);
    }
  }
  try {
    question = isValidString(question, "question");
    options = isValidArray(options, "options");
    createdBy = isValidString(createdBy, "createdBy");
    if (tags && tags.length > 0) {
      tags = isValidArray(tags, "tags");
    }
  } catch (err) {
    req.session.toast = {
      type: "error",
      message: err.message,
    };
    return res.status(400).redirect("/forums/create");
  }

  let imageURLs = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const cloudinaryUrl = await userImage(file.path);
      imageURLs.push(cloudinaryUrl);
      fs.unlinkSync(file.path);
    }
  }

  const newPoll = await createPoll({
    question,
    options,
    createdBy,
    imageURLs: imageURLs || [],
    tags: tags || [],
  });

  req.session.toast = {
    type: "success",
    message: "Poll created successfully.",
  };
  return res.status(201).json(newPoll);
});

router.post("/:pollId/vote", isLoggedIn, async (req, res) => {
  const { pollId } = req.params;
  const { optionId } = req.body;
  const { user } = req.session;
  const userId = req.session.user.user._id;

  if (!optionId) {
    req.session.toast = {
      type: "error",
      message: "Please select an option to vote.",
    };
    return res.status(400).redirect("/forums");
  }

  const poll = await Poll.findById(pollId);
  if (!poll) {
    req.session.toast = {
      type: "error",
      message: "Poll not found.",
    };
    return res.status(404).redirect("/forums");
  }

  const prevOpt = poll.options.find((opt) =>
    opt.voterId.some((id) => id.equals(userId))
  );
  const newOpt = poll.options.id(optionId);
  if (!newOpt) {
    req.session.toast = {
      type: "error",
      message: "Option not found.",
    };
    return res.status(404).redirect("/forums");
  }

  if (prevOpt && prevOpt._id.equals(newOpt._id)) {
    req.session.toast = {
      type: "error",
      message: "You have already voted for this option.",
    };
    return res.status(400).redirect("/forums");
  }

  try {
    const updatedPoll = await voteOnPoll(pollId, userId, optionId);
    req.session.toast = {
      type: "success",
      message: "Your vote has been recorded successfully.",
    };
    return res.status(200).redirect("/forums");
  } catch (err) {
    req.session.toast = {
      type: "error",
      message: "Please try again:" + err.message,
    };
    return res.status(400).redirect("/forums");
  }
});

router.route("/user/comments/view/:id").get(isLoggedIn, async (req, res) => {
  try {
    const pollId = req.params.id;
    const poll = await Poll.findById(pollId)
      .populate("createdBy", "firstName lastName")
      .lean();
    const comments = await Comment.find({ forumId: pollId, commentFor: "poll" })
      .populate("userId", "firstName lastName")
      .lean();
    const loggedUserId = req.session.user?.user?._id || null;

    res.render("commentDelete", {
      poll,
      comments,
      isForum: false,
      loggedUserId,
      customStyles:
        '<link rel="stylesheet" href="/public/css/forumComments.css">',
    });
  } catch (err) {
    return res.status(500).send("Error loading comments page.");
  }
});

export default router;
