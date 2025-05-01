import express from "express";
import User from "../models/user.model.js";
import {
  isValidEmail,
  isValidID,
  isValidPassword,
} from "../utils/validation.utils.js";
import { isValidObjectId, mongo } from "mongoose";
import bcrypt from "bcrypt";
import session from "express-session";

// Create a new user
//Harshil
export const createUser = async (
  firstName,
  lastName,
  email,
  password,
  confirmPassword
) => {
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new Error("Please provide all required fields");
  }
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (password.length > 1024) {
    throw new Error("Password must be less than 1024 characters long");
  }
  if (firstName.length < 2) {
    throw new Error("First name must be at least 2 characters long");
  }
  if (firstName.length > 50) {
    throw new Error("First name must be less than 50 characters long");
  }
  if (lastName.length < 2) {
    throw new Error("Last name must be at least 2 characters long");
  }
  if (lastName.length > 50) {
    throw new Error("Last name must be less than 50 characters long");
  }
  if (firstName.trim().length === 0 || lastName.trim().length === 0) {
    throw new Error("First name and last name cannot be empty");
  }
  if (email.trim().length === 0) {
    throw new Error("Email cannot be empty");
  }
  if (password.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }
  if (confirmPassword.trim().length === 0) {
    throw new Error("Confirm password cannot be empty");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const isUserAlreadyExists = await User.findOne({ email: email });
  if (isUserAlreadyExists) {
    throw new Error("User already exists");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    return user;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Email already exists");
    }
    throw new Error("Internal server error" + error);
  }
};
// Get all users
//Harshil
export const getUsers = async () => {
  try {
    const users = await User.find().select("-password -refreshToken").lean();
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }
    return users;
  } catch (error) {
    throw new Error("Internal server error");
  }
};
// Get a user by ID
// Vamshi
export const getUserById = async (userId) => {
  try {
    userId = isValidID(userId, "userId");

    const user = await User.findById(userId).lean();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (e) {
    throw new Error(e.message);
  }
};
// Update a user by ID
// Vamshi
// TODO: Maybe create a seperate API for password updation.
export const updateUser = async (userId,firstName,lastName,email) => {
  try {
    if(!mongo.ObjectId.isValid(userId)){
      throw new Error("Invalid userId");
    }

  if (!firstName || !lastName || !email) {
    throw new Error("Please provide all required fields");
  }
  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  if (firstName.length < 2) {
    throw new Error("First name must be at least 2 characters long");
  }
  if (firstName.length > 50) {
    throw new Error("First name must be less than 50 characters long");
  }
  if (lastName.length < 2) {
    throw new Error("Last name must be at least 2 characters long");
  }
  if (lastName.length > 50) {
    throw new Error("Last name must be less than 50 characters long");
  }
  if (firstName.trim().length === 0 || lastName.trim().length === 0) {
    throw new Error("First name and last name cannot be empty");
  }
  if (email.trim().length === 0) {
    throw new Error("Email cannot be empty");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (email.length < 5) {
    throw new Error("Email must be at least 5 characters long");
  }
  if (email.length > 50) {
    throw new Error("Email must be less than 50 characters long");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, email },
    { new: true }
  );
  if (!updatedUser) {
    throw new Error("User not found");
  }
  console.log("Updated user: ", updatedUser);
  
  return updatedUser;
  } catch (e) {
    console.log(e);
    
    throw new Error(e.message);
  }
};
// Delete a user by ID
// Vamshi
export const deleteUser = async (userId) => {
  try {
    userId = isValidID(userId, "userId");
  } catch (e) {
    throw new Error(e.message);
  }
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error("User not found");
    }
    return deletedUser;
    // TODO: Need to discuss about self deletion of account. Need to do something with tokens?
  } catch (e) {
    throw new Error(e.message);
  }
};
// Login a user
//Harshil
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Please provide all required fields");
  }
  if (email.trim().length === 0) {
    throw new Error("Email cannot be empty");
  }
  if (password.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  if (password.length > 1024) {
    throw new Error("Password must be less than 1024 characters long");
  }
  if (password.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new Error("Incorrect password or email");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: true });
  return {
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};
// // Logout a user
// //Harshil
// export const logoutUser = async () => {
//  session.destroy();
//  return true;
// };
// Refresh token
//Harshil
export const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while generating tokens",
      error,
    });
  }
};
//update user password
//David
export const updatePassword = async (userId, newPassword1, newPassword2) => {
  //Assuming it works like forgot password
  if (newPassword1 !== newPassword2) {
    throw new Error("Passwords don't match");
  }
  //Check for > 8 chars
  if (newPassword1.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  //Check for < 1024 chars
  if (newPassword1.length > 1024) {
    throw new Error("Password must be less than 1024 characters long");
  }
  //Check for empty passwords
  if (newPassword1.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }
  //Regex check
  if (!isValidPassword(newPassword1)) {
    throw new Error("Invalid Password");
  }
  //Update password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword1, salt);
  const updatePassword = await User.findByIdAndUpdate(
    userId,
    { $set: { password: hashedPassword } },
    { new: true }
  );
  if (!updatePassword) {
    throw new Error("Update password failed");
  }
  await updatePassword.save();
  //Password update successful
  return updatePassword;
};
//Update user Role
//David
export const updateUserRole = async (userId, newRole) => {
  const updateRole = await User.findByIdAndUpdate(
    userId,
    { $set: { role: newRole } },
    { new: true }
  );
  if (!updateRole) {
    throw new Error("Update role failed");
  }
  await updateRole.save();
  return updateRole;
};
//Get user by email
//David
export const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Get user by email failed");
  }
  return user;
};
//Search user by name
//Akbar
export const searchUserByName = async (req, res) => {};
//Get all users by role
//Akbar
export const getUsersByRole = async (req, res) => {};
