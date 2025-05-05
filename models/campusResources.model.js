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
      type: String, 
      enum: [
        "library",
        "gym",
        'Dining Hall',
        'Academic Building',
        'Student Center',
        'Health Center',
        'Recreational Facility',
        'Parking Lot',
        'Dorms',
        'Event Space',
        'Study Room',
        'Computer Lab',
        'Auditorium',
        'Classroom',
        'Laboratory',
        'Office Space',
        'Sports Field',
        'Theater',
        'Art Studio',
        'Music Room',
        'Conference Room',
        'Workshop',
        'Outdoor Space',
        'Playground',
        'Fitness Center',
        'Swimming Pool',
        'Cafeteria',
        'Bookstore',
        'Counseling Center',
        'Career Services',
        'International Student Office',
        'Student Union',
        'Campus Security',
        "other",
      ],
      required: true,
      default: "other",
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],      // [ longitude, latitude ]
      }
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
      type: [String], 
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