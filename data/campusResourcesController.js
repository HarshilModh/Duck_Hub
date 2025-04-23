import mongoose from "mongoose";
import CampusResource from "../models/campusResources.model.js";
import { 
  isValidID, 
  isValidString,
  isValidArray 
} from "../utils/validation.utils.js";

// Create a new campus resource
export const createCampusResource = async (
  resourceName,
  resourceType,
  location,
  description,
  contactDetails,
  operatingHours,
  status
) => {
  // checking if required fields are provided
  if (!resourceName || !location || !description) {
    throw new Error("resourceName, location, and description are required.");
  }

  // validating all the fields
  resourceName = isValidString(resourceName, "Resource Name");
  location = isValidString(location, "Location");
  description = isValidString(description, "Description");
  
  // validate resource type if provided
  if (resourceType) {
    resourceType = isValidArray(resourceType);
    for (let i = 0; i < resourceType.length; i++) {
      resourceType[i] = isValidString(resourceType[i], "Resource Type");
    }
  }
  
  // validate operating hours if provided
  if (operatingHours) {
    operatingHours = isValidArray(operatingHours);
    for (let i = 0; i < operatingHours.length; i++) {
      operatingHours[i] = isValidString(operatingHours[i], "Operating Hours");
    }
  }
  
  // validate status if provided
  if (status) {
    status = isValidString(status, "Status");
    // making sure status is either active or inactive
    if (status !== "active" && status !== "inactive") {
      throw new Error("Status must be either 'active' or 'inactive'");
    }
  }
  
  // validate contact details
  if (!contactDetails || !contactDetails.email) {
    throw new Error("Contact email is required");
  }
  
  // console.log("Creating new resource:", resourceName);
  
  // creating a new resource object
  const newResource = new CampusResource({
    resourceName,
    resourceType: resourceType || [],
    location,
    description,
    contactDetails,
    operatingHours: operatingHours || [],
    status: status || "active"
  });
  
  try {
    // save to database
    const savedResource = await newResource.save();
    if (!savedResource || !savedResource._id) {
      throw new Error("Could not create a new campus resource");
    }
    return savedResource;
  } catch (error) {
    throw new Error("Error saving campus resource: " + error.message);
  }
};

// Get all campus resources
export const getAllCampusResources = async () => {
  try {
    const allResources = await CampusResource.find();
    
    // check if there are any resources
    if (!allResources || allResources.length === 0) {
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
  id = isValidID(id, "Resource ID");
  
  try {
    const resource = await CampusResource.findById(id);
    
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
  updateData
) => {
  // validate id
  id = isValidID(id, "Resource ID");
  
  // check if update data exists
  if (!updateData || Object.keys(updateData).length === 0) {
    throw new Error("No update data provided");
  }
  
  // validate fields if they exist in updateData
  if (updateData.resourceName) {
    updateData.resourceName = isValidString(updateData.resourceName, "Resource Name");
  }
  
  if (updateData.location) {
    updateData.location = isValidString(updateData.location, "Location");
  }
  
  if (updateData.description) {
    updateData.description = isValidString(updateData.description, "Description");
  }
  
  // validate resource type if provided
  if (updateData.resourceType) {
    updateData.resourceType = isValidArray(updateData.resourceType);
    for (let i = 0; i < updateData.resourceType.length; i++) {
      updateData.resourceType[i] = isValidString(updateData.resourceType[i], "Resource Type");
    }
  }
  
  try {
    // update the resource
    const updatedResource = await CampusResource.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
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