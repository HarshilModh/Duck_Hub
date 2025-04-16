import express from "express";
const router = express.Router();
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  generateTokens,
  updatePassword,
  updateUserRole,
  getUserByEmail,
  searchUserByName,
  getUsersByRole,
} from "../data/userController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/roleCheck.middleware.js";

// Create a new user
router.post("/", createUser);
// Get all users
router.get("/", getUsers);
// Get a user by ID
router.get("/:id", getUserById);
// Update a user by ID
router.put("/:id", updateUser);
// Delete a user by ID
router.delete("/:id", deleteUser);
// Login a user
router.post("/login", loginUser);
// Logout a user
router.post("/logout", logoutUser);
// Refresh token
router.post("/refresh", generateTokens);
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
