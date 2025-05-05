import express from "express";
const router = express.Router();
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  updatePassword,
  updateUserRole,
  getUserByEmail,
  searchUserByName,
  getUsersByRole,
  addMissingRequest,
  getAllMissingRequests,
  updateMissingRequest,
  getMissingRequestByUserId,
} from "../data/userController.js";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";
import session from "express-session";
import { getAllForumPosts } from "../data/forumsController.js";
import User from "../models/user.model.js";
import { isValidID, isValidString } from "../utils/validation.utils.js";

// Create a new user
// router.post("/signUp", createUser);

router
  //middleware to check if user is logged in
  .route("/signUp")
  .all(isNotLoggedIn)
  // Show the signup form (any pending toast will display here)
  .get((req, res) => {
    res.render("signUp", { title: "Sign Up" ,isLoggedIn:false});
  })
  // Handle signup submissions
  .post(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Basic presence check
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      req.session.toast = {
        type: "error",
        message: "Please fill all the fields",
      };
      return res.redirect("/users/signUp");
    }

    //  Trimmed validations
    const f = firstName.trim();
    const l = lastName.trim();
    const e = email.trim();
    const p = password.trim();
    const cp = confirmPassword.trim();

    if (p.length < 6) {
      req.session.toast = {
        type: "error",
        message: "Password must be at least 6 characters long",
      };
      return res.redirect("/users/signUp");
    }
    if (p.length > 1024) {
      req.session.toast = {
        type: "error",
        message: "Password must be less than 1024 characters",
      };
      return res.redirect("/users/signUp");
    }
    if (f.length < 2 || f.length > 50) {
      req.session.toast = {
        type: "error",
        message: "First name must be between 2 and 50 characters",
      };
      return res.redirect("/users/signUp");
    }
    if (l.length < 2 || l.length > 50) {
      req.session.toast = {
        type: "error",
        message: "Last name must be between 2 and 50 characters",
      };
      return res.redirect("/users/signUp");
    }
    if (p === "" || cp === "") {
      req.session.toast = {
        type: "error",
        message: "Password fields cannot be empty",
      };
      return res.redirect("/users/signUp");
    }
    if (p !== cp) {
      req.session.toast = {
        type: "error",
        message: "Passwords do not match",
      };
      return res.redirect("/users/signUp");
    }
    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.session.toast = {
        type: "error",
        message: "User already exists",
      };
      return res.redirect("/users/signUp");
    }
    // All validations passed — attempt to create user
    try {
      const newUser = await createUser(f, l, e, p, cp);
      if (newUser) {
        req.session.toast = {
          type: "success",
          message: "Account created! Please log in.",
        };
        return res.redirect("/users/login");
      } else {
        req.session.toast = {
          type: "error",
          message: "Error creating user. Please try again.",
        };
        return res.redirect("/users/signUp");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      req.session.toast = {
        type: "error",
        message: "Server error. Please try again later.",
      };
      return res.redirect("/users/signUp");
    }
  });
// Login a user
router
  .route("/login")
  // Show the login form (any toast will display here)
  .all(isNotLoggedIn)
  .get(async (req, res) => {
    res.render("login", { title: "Login" });
  })

  // Handle login submissions
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await loginUser(email, password);

      if (user) {
        // Save user in session and show a welcome toast
        console.log("User logged in:", user);

        req.session.user = user;

        
        req.session.toast = {
          type: "success",
          message: `Welcome back, ${user.user.firstName}!`,
        };
        //Fix why is it always redirected to forums?
        return res.redirect("/forums/");
      } else {
        // Invalid credentials: show error toast and reload login
        req.session.toast = {
          type: "error",
          message: "Invalid email or password.",
        };
        return res.redirect("/users/login");
      }
    } catch (e) {
      console.error("Error logging in:", e);
      // Unexpected error: show generic error toast
      req.session.toast = {
        type: "error",
        message: `${e}`,
      };
      return res.redirect("/users/login");
    }
  });
//Missing request Dashboard
router.route("/missingRequestDashboard").get(async (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    req.session.toast = {
      type: "error",
      message: "Please log in to access this page",
    };
    return res.redirect("/users/login");
  }
  // Check if user is admin
  if (req.session.user.user.role !== "admin") {
    req.session.toast = {
      type: "error",
      message: "You are not authorized to access this page",
    };
    return res.redirect("/users/userProfile");
  }
  // Get all missing requests
  try {
    const missingRequests = await getAllMissingRequests();
    if (missingRequests) {
      res.render("missingRequestDashboard", {
        title: "Missing Request Dashboard",
        missingRequests,
      });
    } else {
      req.session.toast = {
        type: "error",
        message: "No missing requests found",
      };
      return res.redirect("/users/userProfile");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: `Error fetching missing requests ${e.message}`,
    };
    return res.redirect("/users/userProfile");
  }
}
);
// Middleware to check if user is logged in
router.use(isLoggedIn);
// Get all users
router.route("/getAllUsers").get(async (req, res) => {
  try {
    const users = await getUsers();
    if (users) {
      res.status(200).json(users);
    } else {
      res.status(404).json({ error: "No users found" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.use(isLoggedIn).get("/userProfile", async (req, res) => {
  //redirect to login page
  console.log("User profile route");

  let user = req.session.user;
  console.log("userprofile route", user);

  let firstName = user.user.firstName;
  let lastName = user.user.lastName;
  let email = user.user.email;
  let role = user.user.role;

  res.render("userProfile", {
    title: "User Profile",
    firstName,
    lastName,
    email,
    role,
    error: null,
  });
});
// Get a user by ID
router
  .route("/user/:id")
  .get(async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await getUserById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // Update a user by ID
  .put(async (req, res) => {
    const userId = req.params.id;
    try {
      const updatedUser = await updateUser(userId, req.body);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  // Delete a user by ID
  .delete(async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await deleteUser(userId);
      if (deletedUser) {
        res.status(200).json(deletedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
// Logout a user
// This route handles the logout process
router.route("/logout").get((req, res) => {
  // If they’re not logged in, redirect to login with an error toast
  if (!req.session.user) {
    req.session.toast = {
      type: "error",
      message: "Please log in to access this page",
    };
    return res.redirect("/users/login");
  }

  // Regenerate the session (clearing all data) and then set a success toast
  req.session.regenerate((err) => {
    if (err) {
      console.error("Error logging out:", err);
      // On regenerate failure, we can still set a toast on the fresh session
      req.session.toast = {
        type: "error",
        message: "Error logging out: " + err.message,
      };
      return res.redirect("/users/login");
    }

    // New, empty session—now tell them they logged out
    req.session.toast = {
      type: "success",
      message: "Logged out successfully",
    };
    res.redirect("/users/login");
  });
});

// Update user password
router.route("/password/:id").put(async (req, res) => {
  const userId = req.params.id;
  const { newPassword1, newPassword2 } = req.body;
  try {
    const updatedPassword = await updatePassword(
      userId,
      newPassword1,
      newPassword2
    );
    return res.status(201).json(updatedPassword);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
// Update user role
router.route("/role/:id").put(async (req, res) => {
  const userId = req.params.id;
  const { newRole } = req.body;
  try {
    const updatedRole = await updateUserRole(userId, newRole);
    return res.status(201).json(updatedRole);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
// Get user by email
router.route("/email/:email").get(async (req, res) => {
  const email = req.params.email;
  try {
    const findUser = await getUserByEmail(email);
    return res.status(201).json(findUser);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});
// Search user by name
router.get("/search/:name", searchUserByName);
// Get all users by role
router.get("/role/:role", getUsersByRole);

//Update user profile
router.route("/editProfile").get(async (req, res) => {
  const userId = req.session.user.user._id;
  try {
    const user = await getUserById(userId);
    if (user) {
      console.log("user", user);
      
      res.render("editUserProfie", { title: "Edit Profile", user });
    } else {
      req.session.toast = {
        type: "error",
        message: "User not found",
      };
      return res.redirect("/users/userProfile");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error fetching user",
    };
    return res.redirect("/users/userProfile");
  }
}).put(async (req, res) => {
  const userId = req.session.user.user._id;
  const { firstName, lastName, email } = req.body;
  try {
    const updatedUser = await updateUser(userId,firstName, lastName, email);
    console.log(updatedUser);
    
    req.session.user.user.firstName = updatedUser.firstName;
    req.session.user.user.lastName = updatedUser.lastName;
    req.session.user.user.email = updatedUser.email;
    if (updatedUser) {
      req.session.toast = {
        type: "success",
        message: "Profile updated successfully",
      };
      return res.redirect("/users/userProfile");
    } else {
      req.session.toast = {
        type: "error",
        message: "Error updating profile",
      };
      return res.redirect("/users/editProfile");
    }
    
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error updating profile",
    };
    return res.redirect("/users/editProfile");
  }
}
);
//Admin dashboard for user management
router
  .route("/adminDashboard")
  .all(isLoggedIn, checkRole("admin"))
  .get(async (req, res) => {
    try {
      let users = await getUsers();
      let userId = req.session.user.user._id;
      users= users.filter((user) => user._id.toString() !== userId.toString());
     
      if (users) {
        res.render("userDashboard", { title: "Admin Dashboard", users });
      } else {
        req.session.toast = {
          type: "error",
          message: "No users found",
        };
        return res.redirect("/users/userProfile");
      }
    } catch (e) {
      console.error(e);
      req.session.toast = {
        type: "error",
        message: "Error fetching users",
      };
      return res.redirect("/users/userProfile");
    }
  }).get(async (req, res) => {
    try {
      const users = await getUsers();
      if (!users || users.length === 0) {
        req.session.toast = {
          type: "error",
          message: "No users found",
        };
        return res.redirect("/users/userProfile");
      }
      res.render("userDashboard", { title: "Admin Dashboard", users });
    } catch (error) {
      console.error(error);
      req.session.toast = {
        type: "error",
        message: "Failed to fetch users",
      };
    }
  });
//Delete user
router.
route("/deleteUser/:id").all(isLoggedIn, checkRole("admin"))
.delete(async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await deleteUser(userId);
    if (deletedUser) {
      req.session.toast = {
        type: "success",
        message: "User deleted successfully",
      };
      return res.redirect("/users/adminDashboard");
    } else {
      req.session.toast = {
        type: "error",
        message: "Error deleting user",
      };
      return res.redirect("/users/adminDashboard");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error deleting user",
    };
    return res.redirect("/users/adminDashboard");
  }
});
//missing request
router.route("/missingRequest").get(async (req, res) => {
    return res.render("missingRequest", {
      title: "Missing Request",
      error: null,
    });
}).post(async (req, res) => {
    let itemType = req.body.itemType;
    let itemName = req.body.itemName;
    let description = req.body.description;
    let userId = req.session.user.user._id;
    if (!itemType || !itemName || !description) {
      req.session.toast = {
        type: "error",
        message: "Please fill all the fields",
      };
      return res.redirect("/users/missingRequest");
    }
    try{
      userId = isValidID(userId, "userId");
    }
    catch (e) {
      req.session.toast = {
        type: "error",
        message: "Invalid user ID",
      };
      return res.redirect("/users/missingRequest");
    }
    try{
      itemType = isValidString(itemType, "itemType");
    }
    catch (e) {
      req.session.toast = {
        type: "error",
        message: "Invalid item type",
      };
      return res.redirect("/users/missingRequest");
    }
    try{
      itemName = isValidString(itemName, "itemName");
    }
    catch (e) {
      req.session.toast = {
        type: "error",
        message: "Invalid item name",
      };
      return res.redirect("/users/missingRequest");
    }
    try{
      description = isValidString(description, "description");
    }
    catch (e) {
      req.session.toast = {
        type: "error",
        message: "Invalid description",
      };
      return res.redirect("/users/missingRequest");
    }
    try {
      const missingRequest = await addMissingRequest(
        userId,
        itemType,
        itemName,
        description
      );
      if (missingRequest) {
        req.session.toast = {
          type: "success",
          message: "Missing request created successfully",
        };
        return res.redirect("/users/userProfile");
      } else {
        req.session.toast = {
          type: "error",
          message: "Error creating missing request",
        };
        return res.redirect("/users/missingRequest");
      }
    } catch (e) {
      console.error(e);
      req.session.toast = {
        type: "error",
        message: "Error creating missing request",
      };
      return res.redirect("/users/missingRequest");
    }
  }
);
router.route("/missingRequest/:id").all(isLoggedIn, checkRole("admin"))
.get(async (req, res) => {
  const missingRequestId = req.params.id;
  try {
    const missingRequest = await getAllMissingRequests(missingRequestId);
    if (missingRequest) {
      res.render("missingRequestDetails", {
        title: "Missing Request Details",
        missingRequest,
      });
    } else {
      req.session.toast = {
        type: "error",
        message: "Missing request not found",
      };
      return res.redirect("/users/missingRequestDashboard");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error fetching missing request",
    };
    return res.redirect("/users/missingRequestDashboard");
  }
});
router.route("/missingRequest/update/:id").all(isLoggedIn, checkRole("admin"))
.put(async (req, res) => {
  const missingRequestId = req.params.id;
  const { status } = req.body;
  try {
    const updatedMissingRequest = await updateMissingRequest(
      missingRequestId,
      status
    );
    if (updatedMissingRequest) {
      req.session.toast = {
        type: "success",
        message: "Missing request updated successfully",
      };
      return res.redirect("/users/missingRequestDashboard");
    } else {
      req.session.toast = {
        type: "error",
        message: "Error updating missing request",
      };
      return res.redirect("/users/missingRequestDashboard");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error updating missing request",
    };
    return res.redirect("/users/missingRequestDashboard");
  }
});
//get request by user id
router.route("/missingRequestuser").all(isLoggedIn)
.get(async (req, res) => {
  const userId = req.session.user.user._id;
  try {
    const missingRequests = await getMissingRequestByUserId(userId);
    if (missingRequests) {
      res.render("missingRequestUser", {
        title: "User Missing Requests",
        missingRequests,
      });
    } else {
      req.session.toast = {
        type: "error",
        message: "No missing requests found",
      };
      return res.redirect("/users/userProfile");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error fetching missing requests",
    };
    return res.redirect("/users/userProfile");
  }
});
//delete account if user is logged in and it's their own account
router.route("/deleteAccount").all(isLoggedIn).delete(async (req, res) => {
  const userId = req.session.user.user._id;
  try {
    const deletedUser = await deleteUser(userId);
    if (deletedUser) {
      req.session.toast = {
        type: "success",
        message: "Account deleted successfully",
      };
      return res.redirect("/users/logout");
    } else {
      req.session.toast = {
        type: "error",
        message: "Error deleting account",
      };
      return res.redirect("/users/userProfile");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error deleting account",
    };
    return res.redirect("/users/userProfile");
  }
});
//changePassword
router.route("/changePassword").all(isLoggedIn).get(async (req, res) => {
  res.render("changePassword", { title: "Change Password" });
}).put(async (req, res) => {
  let userId = req.session.user.user._id;
  let oldPassword = req.body.currentPassword;
  let newPassword1 = req.body.newPassword;
  let newPassword2 = req.body.confirmPassword;
  if (!oldPassword || !newPassword1 || !newPassword2) {
    req.session.toast = {
      type: "error",
      message: "Please fill all the fields",
    };
    return res.redirect("/users/changePassword");
  }
  // Trimmed validations
  oldPassword = oldPassword.trim();
  newPassword1 = newPassword1.trim();
  newPassword2 = newPassword2.trim();
  if(oldPassword === "" || newPassword1 === "" || newPassword2 === "") {
    req.session.toast = {
      type: "error",
      message: "Password fields cannot be empty",
    };
    return res.redirect("/users/changePassword");
  }
  if (oldPassword.length==0) {
    req.session.toast = {
      type: "error",
      message: "Old password cannot be empty",
    };
    return res.redirect("/users/changePassword");
  }
  if (newPassword1.length==0) {
    req.session.toast = {
      type: "error",
      message: "New password cannot be empty",
    };
    return res.redirect("/users/changePassword");
  }
  if (newPassword2.length==0) {
    req.session.toast = {
      type: "error",
      message: "Confirm password cannot be empty",
    };
    return res.redirect("/users/changePassword");
  }


  try{
    userId = isValidID(userId, "userId");
  }
  catch (e) {
    req.session.toast = {
      type: "error",
      message: "Invalid user ID",
    };
    return res.redirect("/users/changePassword");
  }
  try{
    oldPassword = isValidString(oldPassword, "oldPassword");
  }
  catch (e) {
    req.session.toast = {
      type: "error",
      message: "Invalid old password",
    };
    return res.redirect("/users/changePassword");
  }
  try{
    newPassword1 = isValidString(newPassword1, "newPassword1");
  }
  catch (e) {
    req.session.toast = {
      type: "error",
      message: "Invalid new password",
    };
    return res.redirect("/users/changePassword");
  }
  if (newPassword1.length < 8) {
    req.session.toast = {
      type: "error",
      message: "Password must be at least 6 characters long",
    };
    return res.redirect("/users/changePassword");
  }
  if (newPassword1.length > 1024) {
    req.session.toast = {
      type: "error",
      message: "Password must be less than 1024 characters",
    };
    return res.redirect("/users/changePassword");
  }
  if(newPassword1 !== newPassword2){
    req.session.toast = {
      type: "error",
      message: "New passwords do not match",
    };
    return res.redirect("/users/changePassword");
  }

  try {
    const updatedPassword = await updatePassword(
      userId,
      oldPassword,
      newPassword1,
      newPassword2
    );
    if (updatedPassword) {
      req.session.toast = {
        type: "success",
        message: "Password changed successfully",
      };
      return res.redirect("/users/userProfile");
    } else {
      req.session.toast = {
        type: "error",
        message: "Error changing password",
      };
      return res.redirect("/users/changePassword");
    }
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Error changing password",
    };
    return res.redirect("/users/changePassword");
  }
});
// Export the router


export default router;
