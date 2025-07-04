import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const announcementsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxLength: 50,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Announcement = mongoose.model("Announcement", announcementsSchema);

export default Announcement;
