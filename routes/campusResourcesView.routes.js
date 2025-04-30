import express from 'express';
import { 
  createCampusResource,
  getAllCampusResources,
  getCampusResourceById,
  updateCampusResourceById,
  deleteCampusResourceById,
  getCampusResourcesByType
} from '../controllers/campusResourcesController.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// Setup Cloudinary (if you're using it for image uploads)
// if you don't have these values yet, ask your team for the credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
});

// setup storage for multer with cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus-resources',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
  },
});

// setup multer with the storage
const upload = multer({ storage: storage });

// Route to display all campus resources
router.get('/', async (req, res) => {
  try {
    // get all resources using the controller function
    const campusResources = await getAllCampusResources();
    
    // render the handlebars template
    res.render('campusResourcesLanding', {
      title: 'Campus Resources',
      campusResources: campusResources,
      loggedUserId: req.session ? req.session.userId : null
    });
  } catch (error) {
    // if something goes wrong, render an error page or redirect
    // console.log("Error getting all resources:", error);
    res.status(400).render('error', { 
      error: error.message || 'Failed to load campus resources'
    });
  }
});

// Route to display form for creating a new resource
router.get('/create', (req, res) => {
  // check if user is logged in
  if (!req.session || !req.session.userId) {
    return res.redirect('/users/login?redirect=/campus-resources/create');
  }
  
  res.render('createCampusResource', {
    title: 'Add Campus Resource',
    loggedUserId: req.session.userId
  });
});

// Route to handle creation of a new resource
router.post('/create', upload.single('resourceImage'), async (req, res) => {
  try {
    // make sure user is logged in
    if (!req.session || !req.session.userId) {
      return res.redirect('/users/login');
    }
    
    const { 
      resourceName, 
      resourceType, 
      location, 
      description, 
      contactDetails,
      operatingHours
    } = req.body;
    
    // prepare the data
    let resourceTypeArray = [];
    if (resourceType) {
      // split the comma-separated string into array
      resourceTypeArray = resourceType.split(',').map(type => type.trim());
    }
    
    let operatingHoursArray = [];
    if (operatingHours) {
      // split into array by new lines
      operatingHoursArray = operatingHours.split('\n')
                                       .map(line => line.trim())
                                       .filter(line => line.length > 0);
    }
    
    // handle contact details
    const contactDetailsObj = {
      email: contactDetails?.email || req.body['contactDetails[email]'],
      contactNumber: contactDetails?.contactNumber || req.body['contactDetails[contactNumber]']
    };
    
    // handle image upload if there's a file
    let imageURL = null;
    if (req.file) {
      imageURL = req.file.path;
    }
    
    // create the resource
    const newResource = await createCampusResource(
      resourceName,
      resourceTypeArray,
      location,
      description,
      contactDetailsObj,
      operatingHoursArray,
      'active' // default status
    );
    
    // redirect to the all resources page after creation
    res.redirect('/campus-resources');
  } catch (error) {
    // if there's an error, re-render the form with error message
    res.render('createCampusResource', {
      title: 'Add Campus Resource',
      error: error.message,
      formData: req.body, // to preserve form data
      loggedUserId: req.session ? req.session.userId : null
    });
  }
});

// Route to display details of a single resource
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // get the resource details
    const resource = await getCampusResourceById(id);
    
    // check if user is admin for edit/delete permissions
    const isAdmin = req.session && req.session.userRole === 'admin';
    
    // render the template
    res.render('campusResourceDetails', {
      title: resource.resourceName,
      resource: resource,
      isAdmin: isAdmin,
      loggedUserId: req.session ? req.session.userId : null
    });
  } catch (error) {
    res.status(400).render('error', { 
      error: error.message || 'Resource not found'
    });
  }
});

// Route to filter resources by type
router.get('/type/:type', async (req, res) => {
  try {
    const type = req.params.type;
    
    // get resources of this type
    const resources = await getCampusResourcesByType(type);
    
    res.render('campusResourcesLanding', {
      title: `${type} Resources`,
      campusResources: resources,
      filterType: type, // to show what filter is active
      loggedUserId: req.session ? req.session.userId : null
    });
  } catch (error) {
    res.status(400).render('error', { 
      error: error.message
    });
  }
});

export default router;