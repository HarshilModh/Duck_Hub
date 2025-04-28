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
} from "../data/userController.js";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";
import session from "express-session";
import { getAllForumPosts } from "../data/forumsController.js";

// Create a new user
// router.post("/signUp", createUser);

router
  //middleware to check if user is logged in
  .route("/signUp")
  .all(isNotLoggedIn)
  // Show the signup form (any pending toast will display here)
  .get((req, res) => {
    res.render("signUp", { title: "Sign Up" });
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
    const userExists = await getUserByEmail(e);
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
// Export the router

export default router;
