import mongoose from "mongoose";
import Course from "../models/courses.model.js";
import { isValidEmail } from "../utils/validation.utils.js";
import { isValidID } from "../utils/validation.utils.js";
import Department from "../models/department.model.js";
// import { courseValidation } from "../utils/validation.utils.js";
//Create a new course
export const createCourse = async (req, res) => {
  const courseCode = req.body.courseCode;
  const courseName = req.body.courseName;
  const courseDescription = req.body.courseDescription;
  const departmentId = req.body.departmentId;

  //    const isCourseCodeValid = courseValidation(courseCode,courseName,courseDescription,departmentId);
  //    if (!isCourseCodeValid) {
  //         return res.status(400).json({ message: "Invalid course code" });
  //     }
  // Create a new course
  const newCourse = new Course({
    courseCode,
    courseName,
    courseDescription,
    departmentId,
  });
  try {
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get a course by ID
export const getCourseById = async (req, res) => {
  const courseId = req.params.id;
  // Validate course ID
  if (!courseId || !isValidID(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Update a course by ID
export const updateCourseById = async (req, res) => {
  const courseId = req.params.id;
  // Validate course ID
  if (!courseId || !isValidID(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  const courseCode = req.body.courseCode;
  const courseName = req.body.courseName;
  const courseDescription = req.body.courseDescription;
  const departmentId = req.body.departmentId;
  // Validate course code
  const isCourseCodeValid = courseValidation(
    courseCode,
    courseName,
    courseDescription,
    departmentId
  );
  if (!isCourseCodeValid) {
    return res.status(400).json({ message: "Invalid course code" });
  }
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        courseCode,
        courseName,
        courseDescription,
        departmentId,
      },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Delete a course by ID
export const deleteCourseById = async (req, res) => {
  const courseId = req.params.id;
  // Validate course ID
  if (!courseId || !isValidID(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }
  try {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get courses by course code
export const getCourseByCourseCode = async (req, res) => {
  const courseCode = req.params.courseCode;
  // Validate course code
  if (!courseCode || typeof courseCode !== "string") {
    return res.status(400).json({ message: "Invalid course code" });
  }
  try {
    const courses = await Course.find({ courseCode });
    if (courses.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get courses by course name
export const getCourseByCourseName = async (req, res) => {
  const courseName = req.params.courseName;
  // Validate course name
  if (!courseName || typeof courseName !== "string") {
    return res.status(400).json({ message: "Invalid course name" });
  }
  try {
    const courses = await Course.find({ courseName });
    if (courses.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get courses by department
export const getCoursesByDepartment = async (req, res) => {
  const departmentId = req.params.departmentId;
  // Validate department ID
  if (!departmentId || !isValidID(departmentId)) {
    return res.status(400).json({ message: "Invalid department ID" });
  }
  try {
    const courses = await Course.find({ departmentId });
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this department" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get courses by professor
// export const getCoursesByProfessorName = async (req, res) => {
//     const professorName = req.params.professorName;
//     // Validate professor name
//     if (!professorName || typeof professorName !== "string") {
//         return res.status(400).json({ message: "Invalid professor name" });
//     }
//     try {
//         const courses = await Course.find({ professorName });
//         if (courses.length === 0) {
//             return res.status(404).json({ message: "No courses found for this professor" });
//         }
//         res.status(200).json(courses);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
//Filter courses
export const filterCourses = async (req, res) => {
  const { difficultyRating, averageRating, departmentId } = req.query;
  const filters = {};
  if (difficultyRating) {
    filters.difficultyRating = difficultyRating;
  }
  if (averageRating) {
    filters.averageRating = averageRating;
  }
  if (departmentId) {
    filters.departmentId = departmentId;
  }
  try {
    const courses = await Course.find(filters);
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get courses with average ratings
export const getCoursesWithAverageRatings = async (req, res) => {
  const { averageRating } = req.query;
  const filters = {};
  if (averageRating) {
    filters.averageRating = { $gte: averageRating };
  }
  try {
    const courses = await Course.find(filters);
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get most reviewed courses
export const getMostReviewedCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ reviews: -1 }).limit(10);
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get top-rated courses
export const getTopRatedCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ averageRating: -1 }).limit(10);
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//search courses on department name
export const searchCoursesByDepartmentName = async (req, res) => {
  const departmentName = req.params.departmentName;
  // Validate department name
  if (!departmentName || typeof departmentName !== "string") {
    return res.status(400).json({ message: "Invalid department name" });
  }
  try {
    const department = await Department.findOne({ name: departmentName });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    const courses = await Course.find({ departmentId: department._id });
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this department" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//search courses on course name with regex if the course name is not exact
export const searchCoursesByCourseName = async (req, res) => {
  const courseName = req.params.courseName;
  // Validate course name
  if (!courseName || typeof courseName !== "string") {
    return res.status(400).json({ message: "Invalid course name" });
  }
  try {
    const courses = await Course.find({
      courseName: { $regex: courseName, $options: "i" },
    });
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//search courses on course code with regex if the course code is not exact
export const searchCoursesByCourseCode = async (req, res) => {
  const courseCode = req.params.courseCode;
  // Validate course code
  if (!courseCode || typeof courseCode !== "string") {
    return res.status(400).json({ message: "Invalid course code" });
  }
  try {
    const courses = await Course.find({
      courseCode: { $regex: courseCode, $options: "i" },
    });
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//search courses on department name with regex if the department name is not exact
export const searchCoursesByDepartmentNameRegex = async (req, res) => {
  const departmentName = req.params.departmentName;
  // Validate department name
  if (!departmentName || typeof departmentName !== "string") {
    return res.status(400).json({ message: "Invalid department name" });
  }
  try {
    const department = await Department.findOne({
      departmentName: { $regex: departmentName, $options: "i" },
    });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    const courses = await Course.find({ departmentId: department._id });
    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for this department" });
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
