import mongoose from "mongoose";
import CourseReview from "../models/courseReviews.model.js";
import Course from "../models/courses.model.js";
import { isValidID } from "../utils/validation.utils.js";

//Create a new course review
export const createCourseReview = async (req, res) => {
};
//Get all course reviews
export const getAllCourseReviews = async (req, res) => {
};
//Get a course review by ID
export const getCourseReviewById = async (req, res) => {
};
//Update a course review by ID
export const updateCourseReviewById = async (req, res) => {
};
//Delete a course review by ID
export const deleteCourseReviewById = async (req, res) => {
};
//Get course reviews by course ID
export const getCourseReviewsByCourseId = async (req, res) => {
};
//Get course reviews by user ID
export const getCourseReviewsByUserId = async (req, res) => {
};
//Get course reviews by rating
export const getCourseReviewsByRating = async (req, res) => {
};
//Get course reviews by difficulty rating
export const getCourseReviewsByDifficultyRating = async (req, res) => {
};

//Get course reviews by average rating
export const getCourseReviewsByAverageRating = async (req, res) => {
};
//Get course reviews by course code
export const getCourseReviewsByCourseCode = async (req, res) => {
};
//Get course reviews by course name
export const getCourseReviewsByCourseName = async (req, res) => {
};
//Get course reviews by course description
export const getCourseReviewsByCourseDescription = async (req, res) => {
};
//Get course reviews by reviews
export const getCourseReviewsByReviews = async (req, res) => {
};
//Filter course reviews
export const filterCourseReviews = async (req, res) => {
};
//Get top-rated courses
export const getTopRatedCourses = async (req, res) => {
};
//Get most reviewed courses
export const getMostReviewedCourses = async (req, res) => {
};
//Get recent course reviews
export const getRecentCourseReviews = async (req, res) => {
};
//Get course reviews by multiple tags
export const getCourseReviewsByMultipleTags = async (req, res) => {
};
