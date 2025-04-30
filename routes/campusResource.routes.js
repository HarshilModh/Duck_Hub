import express from "express";
import {
  createCampusResource,
  getAllCampusResources,
  getCampusResourceById,
  updateCampusResourceById,
  deleteCampusResourceById,
  getCampusResourcesByStatus,
  getCampusResourcesByType,
  searchCampusResources,
} from "../data/campusResourcesController.js";

const router = express.Router();

// Route to create a new campus resource
router.post("/", async (req, res) => {
  try {
    const {
      resourceName,
      resourceType,
      location,
      description,
      contactDetails,
      operatingHours,
      status,
    } = req.body;

    // call controller function to create resource
    const newResource = await createCampusResource(
      resourceName,
      resourceType,
      location,
      description,
      contactDetails,
      operatingHours,
      status
    );

    res.status(201).json({
      success: true,
      message: "Campus resource created successfully",
      resource: newResource,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get all campus resources
router.get("/", async (req, res) => {
  try {
    // call controller function to get all resources
    const resources = await getAllCampusResources();

    res.status(200).json({
      success: true,
      count: resources.length,
      resources: resources,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get a campus resource by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // call controller function to get resource by id
    const resource = await getCampusResourceById(id);

    res.status(200).json({
      success: true,
      resource: resource,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to update a campus resource
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // call controller function to update resource
    const updatedResource = await updateCampusResourceById(id, updateData);

    res.status(200).json({
      success: true,
      message: "Campus resource updated successfully",
      resource: updatedResource,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to delete a campus resource
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // call controller function to delete resource
    const result = await deleteCampusResourceById(id);

    res.status(200).json({
      success: true,
      message: result.message,
      resource: result.deletedResource,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get campus resources by status
router.get("/status/:status", async (req, res) => {
  try {
    const status = req.params.status;

    // call controller function to get resources by status
    const resources = await getCampusResourcesByStatus(status);

    res.status(200).json({
      success: true,
      count: resources.length,
      resources: resources,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to get campus resources by type
router.get("/type/:type", async (req, res) => {
  try {
    const type = req.params.type;

    // call controller function to get resources by type
    const resources = await getCampusResourcesByType(type);

    res.status(200).json({
      success: true,
      count: resources.length,
      resources: resources,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Route to search campus resources
router.get("/search/:term", async (req, res) => {
  try {
    const searchTerm = req.params.term;

    // call controller function to search resources
    const resources = await searchCampusResources(searchTerm);

    res.status(200).json({
      success: true,
      count: resources.length,
      resources: resources,
    });
  } catch (error) {
    // send error response
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
