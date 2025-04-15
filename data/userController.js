import express from "express";
import User from "../models/user.model.js";
import {
  isValidEmail,
  isValidID,
  isValidPassword,
} from "../utils/validation.utils.js";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

//jusrt create all the functions but don't implement them yet

// Create a new user
//Harshil
export const createUser = async (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  // console.log(req.body);

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }
  if (password.length > 1024) {
    return res
      .status(400)
      .json({ message: "Password must be less than 1024 characters long" });
  }
  if (firstName.length < 2) {
    return res
      .status(400)
      .json({ message: "First name must be at least 2 characters long" });
  }
  if (firstName.length > 50) {
    return res
      .status(400)
      .json({ message: "First name must be less than 50 characters long" });
  }
  if (lastName.length < 2) {
    return res
      .status(400)
      .json({ message: "Last name must be at least 2 characters long" });
  }
  if (lastName.length > 50) {
    return res
      .status(400)
      .json({ message: "Last name must be less than 50 characters long" });
  }
  if (firstName.trim().length === 0 || lastName.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "First name and last name cannot be empty" });
  }
  if (email.trim().length === 0) {
    return res.status(400).json({ message: "Email cannot be empty" });
  }
  if (password.trim().length === 0) {
    return res.status(400).json({ message: "Password cannot be empty" });
  }
  const isUserAlreadyExists = await User.findOne({
    $or: [{ email }, { firstName }, { lastName }],
  });
  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
};
// Get all users
//Harshil
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
// Get a user by ID
//Vamshi
export const getUserById = async (req, res) => {
  let userId;
  try {
    userId = isValidID(req.params.id, "userId");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (e) {
    return res.status(500).json({ error: "Server error: " + e.message });
  }
};
// Update a user by ID
//Vamshi
// TODO: Maybe create a seperate API for password updation.
export const updateUser = async (req, res) => {
  let userId;
  try {
    userId = isValidID(req.params.id, "userId");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (e) {
    return res.status(500).json({ error: "Server error: " + e.message });
  }
};
// Delete a user by ID
//Vamshi
export const deleteUser = async (req, res) => {
  let userId;
  try {
    userId = isValidID(req.params.id, "userId");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // TODO: Need to discuss about self deletion of account. Need to do something with tokens?

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (e) {
    return res.status(500).json({ error: "Server error: " + e.message });
  }
};
// Login a user
//Harshil
export const loginUser = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }
  if (email.trim().length === 0) {
    return res.status(400).json({ message: "Email cannot be empty" });
  }
  if (password.trim().length === 0) {
    return res.status(400).json({ message: "Password cannot be empty" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }
  if (password.length > 1024) {
    return res
      .status(400)
      .json({ message: "Password must be less than 1024 characters long" });
  }
  if (password.trim().length === 0) {
    return res.status(400).json({ message: "Password cannot be empty" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: true });
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  });
};
// Logout a user
//Harshil
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Please provide refresh token" });
    }
    if (refreshToken.trim().length === 0) {
      return res.status(400).json({ message: "Refresh token cannot be empty" });
    }
    await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null },
      { new: true }
    );
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while logging out", error });
  }
};
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
export const updatePassword = async (req, res) => {
  //Assuming it works like forgot password
  try {
    //req.body contains the two new passwords to make sure the password contains no typos
    //and userId
    const userId = req.params.id;
    const { newPassword1, newPassword2 } = req.body;
    //Check if the two passwords are the same
    if (newPassword1 !== newPassword2) {
      return res.status(400).json({ message: "Passwords don't match" });
    }
    //Check for > 8 chars
    if (newPassword1.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    //Check for < 1024 chars
    if (newPassword1.length > 1024) {
      return res
        .status(400)
        .json({ message: "Password must be less than 1024 characters long" });
    }
    //Check for empty passwords
    if (newPassword1.trim().length === 0) {
      return res.status(400).json({ message: "Password cannot be empty" });
    }
    //Regex check
    if (!isValidPassword(newPassword1)) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    //Update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword1, salt);
    const updatePassword = await User.findByIdAndUpdate(
      userId,
      { $set: { password: hashedPassword } },
      { new: true }
    );

    await updatePassword.save();
    //Password update successful
    res.status(200).json({ message: "Password update successful" });
  } catch (error) {
    //Server Error
    res.status(500).json({
      message: "Internal server error while updating passwords",
      error,
    });
  }
};
//Update user Role
//David
export const updateUserRole = async (req, res) => {
  try {
    //req.body contains role and userID
    const userId = req.params.id;
    const { newRole } = req.body;
    //
    const updateRole = await User.findByIdAndUpdate(
      userId,
      { $set: { role: newRole } },
      { new: true }
    );
    await updateRole.save();
    res.status(200).json({ message: "Role update successful" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while updating role",
      error,
    });
  }
};
//Get user by email
//David
export const getUserByEmail = async (req, res) => {
  let email;
  try {
    email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json({ message: "Get User email successful" });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error while getting email",
      error,
    });
  }
};
//Search user by name
//Akbar
export const searchUserByName = async (req, res) => {};
//Get all users by role
//Akbar
export const getUsersByRole = async (req, res) => {};
