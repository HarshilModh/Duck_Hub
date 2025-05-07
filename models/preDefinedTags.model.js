import mongoose from "mongoose";
import User from "./user.model.js"; // Assuming you have a User model

const tagsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User.modelName,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
const AdminTags = mongoose.model("AdminTags", tagsSchema);
export default AdminTags;
