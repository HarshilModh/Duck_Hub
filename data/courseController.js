import mongoose from "mongoose";
import Course from "../models/courses.model.js";
import { isValidEmail } from "../utils/validation.utils.js";
import { isValidID } from "../utils/validation.utils.js";

//Create a new course
export const createCourse = async (req, res) => {};
//Get all courses
export const getAllCourses = async (req, res) => {};
//Get a course by ID
export const getCourseById = async (req, res) => {};
//Update a course by ID
export const updateCourseById = async (req, res) => {};
//Delete a course by ID
export const deleteCourseById = async (req, res) => {};
//Get courses by course code
export const getCourseByCourseCode = async (req, res) => {};
//Get courses by course name
export const getCourseByCourseName = async (req, res) => {};
//Get courses by department
export const getCoursesByDepartment = async (req, res) => {};
//Get courses by professor
export const getCoursesByProfessor = async (req, res) => {};
//Filter courses
export const filterCourses = async (req, res) => {};
//Get courses with average ratings
export const getCoursesWithAverageRatings = async (req, res) => {};
//Get most reviewed courses
export const getMostReviewedCourses = async (req, res) => {};
//Get top-rated courses
export const getTopRatedCourses = async (req, res) => {};
//Get courses with review counts
export const getCoursesWithReviewCounts = async (req, res) => {};
//Get courses by multiple tags
export const getCoursesByMultipleTags = async (req, res) => {};
