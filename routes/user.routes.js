import express from 'express';
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
    getUsersByRole
} from '../data/userController.js';
import {verifyToken} from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/roleCheck.middleware.js';

// Create a new user
router.post('/', createUser);
// Get all users
router.get('/', getUsers);
// Get a user by ID
router.get('/:id', getUserById);
// Update a user by ID
router.put('/:id', updateUser);
// Delete a user by ID
router.delete('/:id', deleteUser);
// Login a user
router.post('/login', loginUser);
// Logout a user
router.post('/logout', logoutUser);
// Refresh token
router.post('/refresh', generateTokens);
// Update user password
router.put('/password', updatePassword);
// Update user role
router.put('/role', updateUserRole);
// Get user by email
router.get('/email/:email', getUserByEmail);
// Search user by name
router.get('/search/:name', searchUserByName);
// Get all users by role
router.get('/role/:role', getUsersByRole);
// Export the router

export default router;