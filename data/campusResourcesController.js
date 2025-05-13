import mongoose from "mongoose";
import CampusResource from "../models/campusResources.model.js";
import {
  isValidID,
  isValidString,
  isValidArray,
  isValidEmail
} from "../utils/validation.utils.js";
// {
//   resourceName: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   resourceType: {
//     type: String, 
//     enum: [
//       "library",
//       "gym",
//       'Dining Hall',
//       'Academic Building',
//       'Student Center',
//       'Health Center',
//       'Recreational Facility',
//       'Parking Lot',
//       'Dorms',
//       'Event Space',
//       'Study Room',
//       'Computer Lab',
//       'Auditorium',
//       'Classroom',
//       'Laboratory',
//       'Office Space',
//       'Sports Field',
//       'Theater',
//       'Art Studio',
//       'Music Room',
//       'Conference Room',
//       'Workshop',
//       'Outdoor Space',
//       'Playground',
//       'Fitness Center',
//       'Swimming Pool',
//       'Cafeteria',
//       'Bookstore',
//       'Counseling Center',
//       'Career Services',
//       'International Student Office',
//       'Student Union',
//       'Campus Security',
//       "other",
//     ],
//     required: true,
//     default: "other",
//     trim: true,
//   },
//   location: {
//     type: {
//       type: String,
//       enum: ["Point"],
//       default: "Point"
//     },
//     coordinates: {
//       type: [Number],      // [ longitude, latitude ]
//     }
//   },
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   contactDetails: {
//     email: {
//       type: String,
//       required: true,
//     },
//     contactNumber: {
//       type: String,
//     },
//   },
//   operatingHours: {
//     type: [String], // will store like "Mon-Fri: 8am - 10pm"
//     default: [],
//   },
//   status: {
//     type: String,
//     enum: ["active", "inactive"],
//     default: "active", // assuming resources are active by default
//   },
// },
// { timestamps: true } // adds createdAt and updatedAt fields automatically
// );
// Create a new campus resource
export const createCampusResource = async (
  resourceName,
  resourceType,
  location,
  description,
  contactDetails,
  operatingHours,

) => {
  console.log("Creating campus resource");
  // validate resource name
  
  console.log("Resource Name: ", resourceName);
  console.log("Resource Type: ", resourceType);
  console.log("Location: ", location);
  console.log("Description: ", description);
  console.log("Contact Details: ", contactDetails);
  console.log("Operating Hours: ", operatingHours);

  
  
  
  // checking if required fields are provided
  if (!resourceName || !resourceType || !location || !description || !contactDetails) {
    throw new Error("All fields are required");
  }
  try {
    resourceName = isValidString(resourceName, "Resource Name");
    resourceType = isValidString(resourceType, "Resource Type");
    description = isValidString(description, "Description");
    operatingHours = isValidArray(operatingHours, "Operating Hours");
  } catch (error) {
    throw new Error("Invalid input: " + error.message);
  }
  // validate location
  if (!location || !location.type || !location.coordinates) {
    throw new Error("Location must have type and coordinates");
  }
  if (location.type !== "Point") {
    throw new Error("Location type must be 'Point'");
  }
  if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    throw new Error("Coordinates must be an array of [longitude, latitude]");
  }
  if (typeof location.coordinates[0] !== "string" || typeof location.coordinates[1] !== "string") {
    throw new Error("Coordinates must be numbers");
  }
  // validate contact details
  if (!contactDetails.email || !contactDetails.contactNumber) {
    throw new Error("Contact details must have email and contact number");
  }
  if (typeof contactDetails.email !== "string" || typeof contactDetails.contactNumber !== "string") {
    throw new Error("Contact details must be strings");
  }
  // validate operating hours
  if (!operatingHours ) {
    throw new Error("Operating hours must be provided");
  }
  //exa
  let regexforhours = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun):\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/;
  // Check if each operating hours string matches the regex
  for (let i = 0; i < operatingHours.length; i++) {
    console.log("Array Operating Hours: ", operatingHours[i]);
    
    if (typeof operatingHours[i] !== "string") {
      throw new Error("Operating hours must be a string");
    }
    // Check if the string is empty
    if (operatingHours[i].trim() === "") {
      throw new Error("Operating hours must not be empty");
    }
    //type check
    if (typeof operatingHours[i] !== "string") {
      throw new Error("Operating hours must be a string");
    }
    // Check if the string is empty
    if (operatingHours[i].trim() === "") {
      throw new Error("Operating hours must not be empty");
    }
    // Check if the string is too long
    if (operatingHours[i].length > 50) {
      throw new Error("Operating hours must not be more than 50 characters");
    }
    // Check if the string is too short
    if (operatingHours[i].length < 5) {
      throw new Error("Operating hours must be at least 5 characters");
    }
    // Check if the string matches the regex
    if (!regexforhours.test(operatingHours[i])) {
      throw new Error(`Invalid operating hours format: ${operatingHours[i]}`);
    }
  }
  // check if resource already exists
  const existingResource = await CampusResource.findOne({ resourceName });
  if (existingResource) {
    throw new Error("Campus resource with this name already exists");
  }
  const newResource = new CampusResource({
    resourceName,
    resourceType,
    location,
    description,
    contactDetails,
    operatingHours: operatingHours || [],

  });

  try {
    // save to database
    const savedResource = await newResource.save();
    if (!savedResource || !savedResource._id) {
      throw new Error("Could not create a new campus resource");
    }
    return savedResource;
  } catch (error) {
    console.log(error);
    
    throw new Error("Error saving campus resource: " + error.message);
  }
};

// Get all campus resources
export const getAllCampusResources = async () => {
  try {
    const allResources = await CampusResource.find().lean();

    // check if there are any resources
    if (!allResources) {
      throw new Error("No campus resources found");
    }

    return allResources;
  } catch (error) {
    throw new Error("Error fetching campus resources: " + error.message);
  }
};

// Get a campus resource by ID
export const getCampusResourceById = async (id) => {
  // make sure id is valid
  if (!id) {
    throw new Error("Resource ID is required");
  }

  try {
    id = isValidID(id, "Resource ID");
  }
  catch (error) {
    throw new Error("Invalid resource ID: " + error.message);
  }
  try {
    const resource = await CampusResource.findById(id).lean();

    // check if resource exists
    if (!resource) {
      throw new Error("Campus resource not found");
    }

    return resource;
  } catch (error) {
    throw new Error("Error fetching campus resource: " + error.message);
  }
};

// Update a campus resource by ID
export const updateCampusResourceById = async (
  id,
  resourceName,
  resourceType,
  location,
  description,
  contactDetails,
  operatingHours
) => {
  // validatation same as create
  if (!id|| !resourceName || !resourceType || !location || !description || !contactDetails|| !operatingHours) {
    throw new Error("All fields are required");
  }
  //doing the same validation as create
  try {
    id = isValidID(id, "Resource ID");
    resourceName = isValidString(resourceName, "Resource Name");
    resourceType = isValidString(resourceType, "Resource Type");
    description = isValidString(description, "Description");
    operatingHours = isValidArray(operatingHours, "Operating Hours");
  } catch (error) {
    throw new Error("Invalid input: " + error.message);
  }
  // validate location
  if (!location || !location.type || !location.coordinates) {
    throw new Error("Location must have type and coordinates");
  }
  if (location.type !== "Point") {
    throw new Error("Location type must be 'Point'");
  }
  if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    throw new Error("Coordinates must be an array of [longitude, latitude]");
  }
  if (typeof location.coordinates[0] !== "string" || typeof location.coordinates[1] !== "string") {
    throw new Error("Coordinates must be numbers");
  }
  // validate contact details
  if (!contactDetails.email || !contactDetails.contactNumber) {
    throw new Error("Contact details must have email and contact number");
  }
  if (typeof contactDetails.email !== "string" || typeof contactDetails.contactNumber !== "string") {
    throw new Error("Contact details must be strings");
  }
  //valid email
  if(!isValidEmail(contactDetails.email)){
    throw new Error("Invalid email format");
  }
  //valid contact number
  if(!contactDetails.contactNumber.match(/^\d{10}$/)){
    throw new Error("Contact number must be 10 digits");
  }
  // validate operating hours
  if (!operatingHours ) {
    throw new Error("Operating hours must be provided");
  }
  //exa
  let regexforhours = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun):\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/;
  // Check if each operating hours string matches the regex 
  for (let i = 0; i < operatingHours.length; i++) {
    console.log("Array Operating Hours: ", operatingHours[i]);
    
    if (typeof operatingHours[i] !== "string") {
      throw new Error("Operating hours must be a string");
    }
    // Check if the string is empty
    if (operatingHours[i].trim() === "") {
      throw new Error("Operating hours must not be empty");
    }
    // Check if the string is too long
    if (operatingHours[i].length > 50) {
      throw new Error("Operating hours must not be more than 50 characters");
    }
    // Check if the string is too short
    if (operatingHours[i].length < 5) {
      throw new Error("Operating hours must be at least 5 characters");
    }
    // Check if the string matches the regex
    if (!regexforhours.test(operatingHours[i])) {
      throw new Error(`Invalid operating hours format: ${operatingHours[i]}`);
    }
  }
  // check if resource exists
  try {
    const resource = await CampusResource.findById(id);

    if (!resource) {
      throw new Error("Campus resource not found");
    }
  } catch (error) {
    throw new Error("Error fetching campus resource: " + error.message);
  }
 
  try {
    // update the resource
    const updatedResource = await CampusResource.findByIdAndUpdate(
      id,
      { $set: { resourceName, resourceType, location, description, contactDetails, operatingHours } },
      { new: true, runValidators: true }
    );

    // check if resource exists
    if (!updatedResource) {
      throw new Error("Campus resource not found");
    }

    return updatedResource;
  } catch (error) {
    throw new Error("Error updating campus resource: " + error.message);
  }
};

// Delete a campus resource by ID
export const deleteCampusResourceById = async (id) => {
  // validate id
  id = isValidID(id, "Resource ID");

  try {
    const deletedResource = await CampusResource.findByIdAndDelete(id);

    // check if resource exists
    if (!deletedResource) {
      throw new Error("Campus resource not found");
    }

    return { message: "Campus resource deleted successfully", deletedResource };
  } catch (error) {
    throw new Error("Error deleting campus resource: " + error.message);
  }
};

// Get campus resources by status
export const getCampusResourcesByStatus = async (status) => {
  // validate status
  status = isValidString(status, "Status");

  // Make sure status is valid
  if (status !== "active" && status !== "inactive") {
    throw new Error("Status must be either 'active' or 'inactive'");
  }

  try {
    const resources = await CampusResource.find({ status: status });

    // check if there are resources with this status
    if (!resources || resources.length === 0) {
      throw new Error(`No campus resources found with status: ${status}`);
    }

    return resources;
  } catch (error) {
    throw new Error("Error fetching campus resources: " + error.message);
  }
};

// Get campus resources by type
export const getCampusResourcesByType = async (type) => {
  // validate type
  type = isValidString(type, "Resource Type");

  try {
    // this will find resources that have the specified type in their resourceType array
    const resources = await CampusResource.find({ resourceType: type });

    // count the resources found
    let count = 0;
    for (let i = 0; i < resources.length; i++) {
      count = count + 1;
    }

    // check if there are resources with this type
    if (count === 0) {
      throw new Error(`No campus resources found with type: ${type}`);
    }

    return resources;
  } catch (error) {
    throw new Error("Error fetching campus resources: " + error.message);
  }
};

// Search campus resources by name or location
export const searchCampusResources = async (searchTerm) => {
  // validate search term
  searchTerm = isValidString(searchTerm, "Search Term");

  try {
    // create a regex pattern for case-insensitive search
    const searchPattern = new RegExp(searchTerm, 'i');

    // find resources matching the search term in name or location
    const resources = await CampusResource.find({
      $or: [
        { resourceName: searchPattern },
        { location: searchPattern }
      ]
    });

    // check if there are matching resources
    if (!resources || resources.length === 0) {
      throw new Error(`No campus resources found matching: ${searchTerm}`);
    }

    return resources;
  } catch (error) {
    throw new Error("Error searching campus resources: " + error.message);
  }
};
// Get campus resources by name 
export const getCampusResourcesByName = async (name) => {
  // validate name
  try {
    name = isValidString(name, "Resource Name");
  }
  catch (error) {
    throw new Error("Invalid resource name: " + error.message);
  }

  try {
    // find resources matching the name
    const resources = await CampusResource.find({ resourceName: name });

    // check if there are matching resources
    if (!resources) {
      throw new Error(`No campus resources found with name: ${name}`);
    }

    return resources;
  } catch (error) {
    throw new Error("Error fetching campus resources: " + error.message);
  }
};