import mongoose from "mongoose";

// making schema for campus resources
const campusResourceSchema = new mongoose.Schema(
  {
    resourceName: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: [String], // array of strings
      default: [],
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    contactDetails: {
      email: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
      },
    },
    operatingHours: {
      type: [String], // will store like "Mon-Fri: 8am - 10pm"
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active", // assuming resources are active by default
    },
  },
  { timestamps: true } // adds createdAt and updatedAt fields automatically
);

// console.log("Creating campus resources model")

// this part creates the model from our schema
const CampusResource = mongoose.model("CampusResource", campusResourceSchema);

// exporting the model to use in other files
export default CampusResource;