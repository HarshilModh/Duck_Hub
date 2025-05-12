import express from "express";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import { randomInt } from "crypto";
import { sendMail } from "./mailTriggerController.js";
import MissingRequest from "../models/MissingRequest.model.js";
import {
  isValidEmail,
  isValidID,
  isValidPassword,
  isValidString,
} from "../utils/validation.utils.js";
import { isValidObjectId, mongo } from "mongoose";
import bcrypt from "bcrypt";
import session from "express-session";
// import Otp from "../models/otp.model.js";

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
  let nameRegex = /^[a-zA-Z]+$/;

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
  if (email.length < 5) {
    throw new Error("Email must be at least 5 characters long");
  }
  if (email.length > 50) {
    throw new Error("Email must be less than 50 characters long");
  }
  if (!nameRegex.test(firstName)) {
    throw new Error("First name can only contain letters");
  } 
  if (!nameRegex.test(lastName)) {  
    throw new Error("Last name can only contain letters");
  }
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (!isValidPassword(password)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }
  if (confirmPassword.trim().length === 0) {
    throw new Error("Confirm password cannot be empty");
  }
  if (!isValidPassword(confirmPassword)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
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
export const updateUser = async (userId, firstName, lastName, email) => {
  try {
    if (!mongo.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    if (!firstName || !lastName || !email) {
      throw new Error("Please provide all required fields");
    }
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    let nameRegex = /^[a-zA-Z]+$/;

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
    if (!nameRegex.test(firstName)) {
      throw new Error("First name can only contain letters");
    }
    if (!nameRegex.test(lastName)) {
      throw new Error("Last name can only contain letters");
    }
    const user = await User.findById(userId);
    if (user.googleId) {
      throw new Error("User is logged in with Google. Cannot update details.");
    }
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
  if (!isValidPassword(password)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
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
export const updatePassword = async (userId, currentPassword, newPassword2) => {
  //Assuming it works like forgot password

  if (!userId || !currentPassword || !newPassword2) {
    throw new Error("Please provide all required fields");
  }
  try {
    userId = isValidID(userId, "userId");
  } catch (e) {
    throw new Error(e.message);
  }

  //Check for > 8 chars
  if (currentPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  //Check for < 1024 chars
  if (currentPassword.length > 1024) {
    throw new Error("Password must be less than 1024 characters long");
  }
  //Check for empty passwords
  if (currentPassword.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }

  //Check for empty passwords
  if (newPassword2.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }
  //Check for > 8 chars
  if (newPassword2.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  //Check for < 1024 chars
  if (newPassword2.length > 1024) {
    throw new Error("Password must be less than 1024 characters long");
  }
  //Check for empty passwords
  if (newPassword2.trim().length === 0) {
    throw new Error("Password cannot be empty");
  }
  //Check for same password
  if (currentPassword === newPassword2) {
    throw new Error("New password cannot be same as current password");
  }
  //Check for valid password
  if (!isValidPassword(newPassword2)) {
    throw new Error(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    throw new Error("Incorrect password");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword2, salt);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("Email already exists");
    }
    throw new Error("Internal server error" + error);
  }
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
export const searchUserByName = async (req, res) => { };
//Get all users by role
//Akbar
export const getUsersByRole = async (req, res) => { };

export const addMissingRequest = async (
  userId,
  itemType,
  itemName,
  description
) => {
  try {
    console.log("userId", userId);
    console.log("itemType", itemType);
    console.log("itemName", itemName);
    console.log("description", description);

    if (!userId || !itemType || !itemName) {
      throw new Error("Please provide all required fields");
    }
    try {
      userId = isValidID(userId, "userId");
    } catch (e) {
      console.log(e);

      throw new Error(e.message);
    }
    try {
      itemType = isValidString(itemType, "itemType");
    } catch (e) {
      console.log(e);

      throw new Error(e.message);
    }
    try {
      itemName = isValidString(itemName, "itemName");
    } catch (e) {
      console.log(e);

      throw new Error(e.message);
    }

    if (typeof itemType !== "string" || typeof itemName !== "string") {
      throw new Error("Item type and item name must be strings");
    }
    if (itemType.trim().length === 0 || itemName.trim().length === 0) {
      throw new Error("Item type and item name cannot be empty");
    }
    itemType = itemType.trim();
    itemName = itemName.trim();

    if (typeof description !== "string") {
      throw new Error("Description must be a string");
    }
    if (description.trim().length === 0) {
      description = null;
    }

    const missingRequest = await MissingRequest.create({
      userId,
      itemType,
      itemName,
      description,
    });
    if (!missingRequest) {
      throw new Error("Missing request not created");
    }
    return missingRequest;
  } catch (e) {
    console.log(e);

    throw new Error(e.message);
  }
};
export const getMissingRequests = async (userId) => {
  try {
    if (!userId) {
      throw new Error("Please provide all required fields");
    }
    try {
      userId = isValidID(userId, "userId");
    } catch (e) {
      throw new Error(e.message);
    }
    const missingRequests = await MissingRequest.find({ userId }).lean();
    if (!missingRequests || missingRequests.length === 0) {
      throw new Error("No missing requests found");
    }
    return missingRequests;
  } catch (e) {
    throw new Error(e.message);
  }
};
export const getAllMissingRequests = async () => {
  try {
    const missingRequests = await MissingRequest.find({})
      .populate("userId", "firstName lastName")
      .lean();
    console.log(missingRequests);

    if (!missingRequests) {
      throw new Error("No missing requests found");
    }
    return missingRequests;
  } catch (e) {
    throw new Error(e.message);
  }
};
export const updateMissingRequest = async (requestId, status) => {
  try {
    if (!requestId || !status) {
      throw new Error("Please provide all required fields");
    }
    try {
      requestId = isValidID(requestId, "requestId");
    } catch (e) {
      throw new Error(e.message);
    }
    if (status !== "Approved" && status !== "Rejected") {
      throw new Error("Invalid status");
    }
    const missingRequest = await MissingRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
    if (!missingRequest) {
      throw new Error("Missing request not found");
    }
    return missingRequest;
  } catch (e) {
    throw new Error(e.message);
  }
};
export const getMissingRequestByUserId = async (userid) => {
  try {
    if (!userid) {
      throw new Error("Please provide all required fields");
    }
    try {
      userid = isValidID(userid, "userId");
    } catch (e) {
      throw new Error(e.message);
    }
    const missingRequest = await MissingRequest.find({ userId: userid })
      .populate("userId", "firstName lastName")
      .lean();

    if (!missingRequest) {
      throw new Error("No missing requests found");
    }
    return missingRequest;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const forgotPassword = async (email) => {
  if (!email) {
    throw new Error("Please provide all required fields");
  }
  email = isValidString(email, "email");
  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const otp = await randomInt(100000, 999999).toString();
  const newOtp = await Otp.create({
    userId: user._id,
    code: otp,
  });
  if (!newOtp) {
    throw new Error("Failed to create OTP");
  }

  const mailOptions = {
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    html: `<p>Your OTP for password reset is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
  };

  try {
    await sendMail(mailOptions);
  } catch (err) {
    throw new Error("Failed to send OTP email:", err);
  }
  return { success: true, userId: user._id };
};

export async function validateOtp(userId, code) {
  if (!userId || !code) {
    throw new Error("Please provide all required fields");
  }
  try {
    userId = isValidID(userId, "userId");
    code = isValidString(code, "code");
  } catch (e) {
    throw new Error(e.message);
  }

  const otpDoc = await Otp.findOne({ userId }).sort({ createdAt: -1 }).lean();

  if (!otpDoc) {
    throw new Error("OTP not found or already expired");
  }

  const now = new Date();
  if (otpDoc.expiresAt < now) {
    await Otp.deleteOne({ _id: otpDoc._id });
    throw new Error("OTP has expired");
  }

  if (otpDoc.attempts <= 0) {
    await Otp.deleteOne({ _id: otpDoc._id });
    throw new Error("No remaining attempts — please request a new OTP");
  }

  if (otpDoc.code === code) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return;
  }

  const updated = await Otp.findByIdAndUpdate(
    otpDoc._id,
    { $inc: { attempts: -1 } },
    { new: true }
  );

  if (updated.attempts <= 0) {
    await Otp.deleteOne({ _id: otpDoc._id });
    throw new Error(
      "Invalid OTP. No attempts left — please request a new one."
    );
  } else {
    throw new Error(
      `Invalid OTP. You have ${updated.attempts} attempt${updated.attempts > 1 ? "s" : ""
      } left.`
    );
  }
}
