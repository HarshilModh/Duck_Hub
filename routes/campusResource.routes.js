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
  getCampusResourcesByName,
} from "../data/campusResourcesController.js";
import xss from "xss";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";
import { isValidEmail, isValidID } from "../utils/validation.utils.js";

const router = express.Router();
const app = express();

// Route to create a new campus resource
router.use(isLoggedIn, checkRole('admin')).get("/", async (req, res) => {
  return res.render("addCampusResources", {
    title: "Campus Resource",
  });
}).post("/", async (req, res) => {

    let resourceName = xss(req.body.resourceName);
    let resourceType = xss(req.body.resourceType);
    let longitude = parseFloat(req.body.longitude);
    let latitude = parseFloat(req.body.latitude);
    if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
      throw new Error("Invalid coordinates");
    }
    let description = xss(req.body.description);
    let email = xss(req.body.email);
    let contactNumber = xss(req.body.contactNumber);
    let contactDetails = { email, contactNumber };
    let operatingHours = xss(req.body.operatingHours);
    console.log("resourceName", resourceName);
    console.log("resourceType", resourceType);
    console.log("location", location);
    console.log("description", description);
    console.log("contactDetails", contactDetails);
    console.log("operatingHours", operatingHours);
    // check if all required fields are provided

    if (!resourceName || !resourceType || !location || !description || !contactDetails.email) {

      req.session.toast = {
        type: "error",
        message: "Please fill all the required fields",
      };
       return res.redirect("/campusResources");
    }
    if (!resourceType) {
      req.session.toast = {
        type: "error",
        message: "Please select a resource type",
      };
      return res.redirect("/campusResources");

    }
    if (!location) {
      req.session.toast = {
        type: "error",
        message: "Please select a location",
      };
      return res.redirect("/campusResources");

    }
    if (!description) {
      req.session.toast = {
        type: "error",
        message: "Please enter a description",
      };
      return res.redirect("/campusResources");

    }
    if (!contactDetails.email) {
      req.session.toast = {
        type: "error",
        message: "Please enter a contact email",
      };
      return res.redirect("/campusResources");

    }
    if (!operatingHours) {
      req.session.toast = {
        type: "error",
        message: "Please enter operating hours",
      };
      return res.redirect("/campusResources");

    }//validate everything
    if (typeof resourceName !== "string" || resourceName.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid resource name",
      };
      return res.redirect("/campusResources");

    }
    if (typeof resourceType !== "string" || resourceType.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid resource type",
      };
      return res.redirect("/campusResources");

    }
    if (typeof description !== "string" || description.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid description",
      };
      return res.redirect("/campusResources");

    }
    if (typeof contactDetails.email !== "string" || contactDetails.email.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid contact email",
      };
      return res.redirect("/campusResources");

    }
    if (typeof contactDetails.contactNumber !== "string" || contactDetails.contactNumber.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid contact number",
      };
      return res.redirect("/campusResources");

    }
    if (typeof operatingHours !== "string" || operatingHours.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid operating hours",
      };
      return res.redirect("/campusResources");

    }
    if (typeof location !== "object" || location.coordinates.length !== 2) {
      req.session.toast = {
        type: "error",
        message: "Invalid location",
      };
      return res.redirect("/campusResources");

    }
    if (typeof location.type !== "string" || location.type.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid location type",
      };
      return res.redirect("/campusResources");

    }
    //cordinates are coming as array of numbers
    if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      req.session.toast = {
        type: "error",
        message: "Invalid location coordinates",
      };
      return res.redirect("/campusResources");

    }
    if (typeof location.coordinates[0] !== "string" || typeof location.coordinates[1] !== "string") {
      req.session.toast = {
        type: "error",
        message: "Invalid location coordinates",
      };
      return res.redirect("/campusResources");

    }
    if (typeof contactDetails.contactNumber !== "string" || contactDetails.contactNumber.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid contact number",
      };
      return res.redirect("/campusResources");

    }

    // Validate operating hours as a comma-separated string
    if (typeof operatingHours !== "string" || operatingHours.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid operating hours",
      };
      return res.redirect("/campusResources");

    }

    // Split using comma as the delimiter
    let operatingHoursArray = operatingHours
  .split(",")
  .map(h => h.trim())
  .filter(Boolean);
        
    // Pattern to validate each operating hour string
    // Example: "Mon: 9:00 - 17:00,Tue: 10:00 - 18:00"
    let regexforhours = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun):\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/;

    for (let i = 0; i < operatingHoursArray.length; i++) {
      // Basic checks
      if (typeof operatingHoursArray[i] !== "string" || operatingHoursArray[i] === "") {
        req.session.toast = {
          type: "error",
          message: "Invalid operating hours",
        };
        return res.redirect("/campusResources");

      }
      // Validate format using regex
      if (!regexforhours.test(operatingHoursArray[i])) {
        req.session.toast = {
          type: "error",
          message: `Invalid operating hours format: ${operatingHoursArray[i]}`,
        };
        return res.redirect("/campusResources");

      }
    }
    //check if email is valid
    if (!isValidEmail(contactDetails.email)) {
      req.session.toast = {
        type: "error",
        message: "Invalid email format",
      };
      return res.redirect("/campusResources");

    }
    // check if contact number is valid
    const contactNumberRegex = /^\d{10}$/;
    if (!contactNumberRegex.test(contactDetails.contactNumber)) {
      req.session.toast = {
        type: "error",
        message: "Invalid contact number format",
      };
      return res.redirect("/campusResources");

    }

try{
    // call controller function to create resource
    const newResource = await createCampusResource(
      resourceName,
      resourceType,
      location,
      description,
      contactDetails,
      operatingHoursArray  // Changed to use the joined string.
    );
    if (!newResource || !newResource._id) {
      req.session.toast = {
        type: "error",
        message: "Could not create a new campus resource",
      }
      return res.redirect("/campusResources");

    }
    // send success response
    req.session.toast = {
      type: "success",
      message: "Campus resource created successfully",
    };
    res.status(200).redirect("/userSideCampusResources/categories");

  } catch (error) {
    // send error response
    console.log(error);

    req.session.toast = {
      type: "error",
      message: error.message,
    };
    return res.redirect("/campusResources");
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
//load edit campus resource page
router.route("/edit/:id").get(isLoggedIn, checkRole("admin"), async (req, res) => {
  let id = req.params.id;
  if (!id) {
    req.session.toast = {
      type: "error",
      message: "Campus resource ID is required",
    };
    return res.redirect("/userSideCampusResources/categories");
  }
  // Validate ID
  try {
    id = isValidID(id, "Campus Resource ID");
  } catch (error) {
    req.session.toast = {
      type: "error",
      message: "Invalid campus resource ID: " + error.message,
    };
    return res.redirect("/userSideCampusResources/categories");
  }
  try {
    // call controller function to get resource by id
    const resource = await getCampusResourceById(id);
    if (!resource) {
      req.session.toast = {
        type: "error",
        message: "Campus resource not found",
      };
      return res.redirect("/userSideCampusResources/categories");
    }
    res.status(200).render("editCampusResources", {
      title: "Edit Campus Resource",
      resource: resource,
    });
  } catch (error) {
    // send error response
    req.session.toast = {
      type: "error",
      message: error.message,
    };
    res.redirect("/userSideCampusResources/categories");
  }
}).put(isLoggedIn, checkRole("admin"), async (req, res) => {
  try {
    let id = req.params.id;
    console.log("ID", id);

    // Extract fields from the request body
    let resourceName = xss(req.body.resourceName);
    let resourceType = xss(req.body.resourceType);
    let longitude = parseFloat(req.body.longitude);
    let latitude = parseFloat(req.body.latitude);
    if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
      throw new Error("Invalid coordinates");
    }
    let description = xss(req.body.description);
    let email = xss(req.body.email);
    let contactNumber = xss(req.body.contactNumber);
    let contactDetails = { email, contactNumber };
    let operatingHours = xss(req.body.operatingHours);

    // Check if all required fields are provided
    if (!resourceName || !resourceType || !location || !description || !contactDetails.email) {
      req.session.toast = {
        type: "error",
        message: "Please fill all the required fields",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (!resourceType) {
      req.session.toast = {
        type: "error",
        message: "Please select a resource type",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (!location) {
      req.session.toast = {
        type: "error",
        message: "Please select a location",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (!description) {
      req.session.toast = {
        type: "error",
        message: "Please enter a description",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (!contactDetails.email) {
      req.session.toast = {
        type: "error",
        message: "Please enter a contact email",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (!operatingHours) {
      req.session.toast = {
        type: "error",
        message: "Please enter operating hours",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    // Validate text fields
    if (typeof resourceName !== "string" || resourceName.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid resource name",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof resourceType !== "string" || resourceType.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid resource type",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof description !== "string" || description.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid description",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof contactDetails.email !== "string" || contactDetails.email.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid contact email",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof contactDetails.contactNumber !== "string" || contactDetails.contactNumber.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid contact number",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    // Validate email format
    if (!isValidEmail(contactDetails.email)) {
      req.session.toast = {
        type: "error",
        message: "Invalid email format",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    // Validate contact number format
    const contactNumberRegex = /^\d{10}$/;
    if (!contactNumberRegex.test(contactDetails.contactNumber)) {
      req.session.toast = {
        type: "error",
        message: "Invalid contact number format",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof operatingHours !== "string" || operatingHours.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid operating hours",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof location !== "object" || !location.coordinates || location.coordinates.length !== 2) {
      req.session.toast = {
        type: "error",
        message: "Invalid location",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof location.type !== "string" || location.type.trim() === "") {
      req.session.toast = {
        type: "error",
        message: "Invalid location type",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    // Validate coordinates
    if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      req.session.toast = {
        type: "error",
        message: "Invalid location coordinates",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    if (typeof location.coordinates[0] !== "string" || typeof location.coordinates[1] !== "string") {
      req.session.toast = {
        type: "error",
        message: "Invalid location coordinates",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }

    // Validate operating hours as a comma-separated string:
    let operatingHoursArray = operatingHours
      .split(",")
      .map(h => h.trim())
      .filter(Boolean);

    // Regex to validate format, e.g.: "Mon: 9:00 - 17:00"
    let regexforhours = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun):\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/;
    for (let i = 0; i < operatingHoursArray.length; i++) {
      if (typeof operatingHoursArray[i] !== "string" || operatingHoursArray[i] === "") {
        req.session.toast = {
          type: "error",
          message: "Invalid operating hours",
        };
        return res.redirect(`/campusResources/edit/${id}`);
      }
      if (!regexforhours.test(operatingHoursArray[i])) {
        req.session.toast = {
          type: "error",
          message: `Invalid operating hours format: ${operatingHoursArray[i]}`,
        };
        return res.redirect(`/campusResources/edit/${id}`);
      }
    }

    // Optionally, join operatingHoursArray into a comma-separated string if your controller/model expects a string.
    // Let’s assume updateCampusResourceById can work with the array.
    const updatedResource = await updateCampusResourceById(
      id,
      resourceName,
      resourceType,
      location,
      description,
      contactDetails,
      operatingHoursArray
    );
    if (!updatedResource || !updatedResource._id) {
      req.session.toast = {
        type: "error",
        message: "Could not update the campus resource",
      };
      return res.redirect(`/campusResources/edit/${id}`);
    }
    req.session.toast = {
      type: "success",
      message: "Campus resource updated successfully",
    };
    return res.status(200).redirect("/userSideCampusResources/categories");
  } catch (error) {
    console.log(error);
    req.session.toast = {
      type: "error",
      message: error.message,
    };
    return res.redirect("/userSideCampusResources/categories");
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
    const updateData = xss(req.body);

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
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // call controller function to delete resource
    const result = await deleteCampusResourceById(id);
    if (!result) {
      req.session.toast = {
        type: "error",
        message: "Campus resource not found",
      };
      return res.status(404).redirect("/userSideCampusResources/categories");
    }
    req.session.toast = {
      type: "success",
      message: "Campus resource deleted successfully",
    };
    return res.status(200).redirect("/userSideCampusResources/categories");
  } catch (error) {
    // send error response
    req.session.toast = {
      type: "error",
      message: error.message,
    };
    return res.status(400).redirect("/userSideCampusResources/categories");
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