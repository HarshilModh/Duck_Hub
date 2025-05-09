import express from "express";
import multer from "multer";
import fs from "fs";
import Poll from "../models/polls.model.js";
import { createPoll, voteOnPoll } from "../data/pollController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { userImage, uploadImagesGuard } from "../middlewares/cloudinary.js";
import Comment from "../models/forumsComments.model.js";

const router = express.Router();

// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Setup multer for temp file storage
// const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .post(isLoggedIn, uploadImagesGuard, async (req, res) => {
    try {
      const { question, options, tags, createdBy } = req.body;

      let imageURLs = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const cloudinaryUrl = await userImage(file.path);
          imageURLs.push(cloudinaryUrl);
          fs.unlinkSync(file.path);
        }
      }

      // if (req.files && req.files.length > 5) {
      //   req.session.toast = {
      //     type: "error",
      //     message: "You can upload a maximum of 5 images.",
      //   };
      //   return res.status(400).redirect("/polls");
      // }

      if (!createdBy) {
        return res.status(401).json({ error: "Authentication required." });
      }

      const newPoll = await createPoll({
        question,
        options,
        createdBy,
        imageURLs,
        tags,
      });

      return res.status(201).json(newPoll);
    } catch (err) {
      console.error("Error in POST /polls:", err);

      if (err.name === "ValidationError") {
        const msgs = Object.values(err.errors)
          .map((e) => e.message)
          .join(" ");
        return res.status(400).json({ error: msgs });
      }

      if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
      }

      return res.status(500).json({ error: "Internal server error." });
    }
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
    const poll = await Poll.findById(pollId).populate("createdBy", "firstName lastName").lean();
    const comments = await Comment.find({ forumId: pollId, commentFor: "poll" }).populate("userId", "firstName lastName")
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
