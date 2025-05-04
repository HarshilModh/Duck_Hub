import express from "express";
import multer from "multer";
import fs from "fs";
import { createPoll } from "../data/pollController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { userImage } from "../middlewares/cloudinary.js";

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Setup multer for temp file storage
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .post(isLoggedIn, upload.array("images", 5), async (req, res) => {
    try {
      const { question, options, tags, createdBy } = req.body;

      let imageURLs = [];

      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const cloudinaryUrl = await userImage(file.path);
          imageURLs.push(cloudinaryUrl);
          fs.unlinkSync(file.path); // deletes the reference from the uploads folder
        }
      }

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

export default router;
