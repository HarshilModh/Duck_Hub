import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    /*
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    */
  },
  { timestamps: true }
);
const Tags = mongoose.model("Tags", tagsSchema);
export default Tags;
