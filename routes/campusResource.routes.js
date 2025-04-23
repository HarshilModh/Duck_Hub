import express from 'express';
import { 
  createCampusResource,
  getAllCampusResources,
  getCampusResourceById,
  updateCampusResourceById,
  deleteCampusResourceById,
  getCampusResourcesByStatus,
  getCampusResourcesByType,
  searchCampusResources
} from '../controllers/campusResourcesController.js';

const router = express.Router();

// Route to create a new campus resource
router.post('/', async (req, res) => {
  try {
    const { 
      resourceName, 
      resourceType, 
      location, 
      description, 
      contactDetails, 
      operatingHours, 
      status 
    } = req.body;
    //working more after dinner