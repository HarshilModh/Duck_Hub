import express from 'express';
import { getAllCampusResources, getCampusResourceById} from '../data/campusResourcesController.js';
const router = express.Router();
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import xss from 'xss';
import { isValidID,isValidString } from '../utils/validation.utils.js';


router.route('/').get(isLoggedIn, async (req, res) => {
  try {
    const allResources = await getAllCampusResources();
    res.status(200).render('campusResources', { resources: allResources });
  } catch (error) {
    console.error(error);
    req.session.toast = {
      type: 'error',
      message: 'Error fetching campus resources: ' + error.message,
    };
    res.redirect('/campusresources');
  }
}
);
//resource by resourceType
router.route('/type/:resourceType').get(isLoggedIn, async (req, res) => {
  let resourceType = req.params.resourceType;
  let isAdmin = req.session.user.user.role;
  if (isAdmin === 'admin') {
    isAdmin = true;
  }else {
    isAdmin = false;
  }
  if (!resourceType) {
    req.session.toast = {
      type: 'error',
      message: 'Resource type is required',
    };
    return res.redirect('/campusresources');
  }
    // Validate resourceType
  try {
    resourceType=isValidString(resourceType, 'Resource Type');
  } catch (error) {
    req.session.toast = {
      type: 'error',
      message: 'Invalid resource type: ' + error.message,
    };
    return res.redirect('/campusresources');
  }
  // Fetch all resources and filter by resourceType
  try {
    console.log(isAdmin);
    
    const allResources = await getAllCampusResources();
    const filteredResources = allResources.filter(resource => resource.resourceType === resourceType);
    res.render('campusResourcesLanding', { campusResources: filteredResources ,isAdmin});
  } catch (error) {
    console.error(error);
    req.session.toast = {
      type: 'error',
      message: 'Error fetching campus resources: ' + error.message,
    };
    res.redirect('/campusresources');
  }
}
);
//load resources catogories page
router.route('/categories').get(isLoggedIn, async (req, res) => {
    res.status(200).render('campusResourceCatagories', );
}
);
//resource by id
router.route('/getDetails/:id').get(isLoggedIn, async (req, res) => {
  let id = req.params.id;
  // Validate ID
  try {
    id = isValidID(id, 'Resource ID');
  } catch (error) {
    req.session.toast = {
      type: 'error',
      message: 'Invalid resource ID: ' + error.message,
    };
    return res.redirect('/campusresources');
  }
  // Fetch resource by ID
  try {
    const resource = await getCampusResourceById(id);
    res.status(200).render('campusResourceDetails', { resource });
  } catch (error) {
    console.error(error);
    req.session.toast = {
      type: 'error',
      message: 'Error fetching campus resource: ' + error.message,
    };
    res.redirect('/campusresources');
  }
}
);

export default router;