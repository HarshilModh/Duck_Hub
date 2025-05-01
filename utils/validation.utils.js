import { ObjectId } from "mongodb";
import { getCourseById } from "../data/courseController.js";

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidID = (id, varName) => {
  console.log("ID", id);

  if (!id) {
    throw new Error(`Error: You must provide a ${varName}`);
  }
  if (typeof id !== "string") {
    throw new Error(`Error: ${varName} must be a string`);
  }
  id = id.trim();
  if (id.length === 0) {
    throw new Error(
      `Error: ${varName} cannot be an empty string or just spaces`
    );
  }
  if (!ObjectId.isValid(id)) {
    throw new Error(`Error: ${varName} invalid object ID`);
  }
  return id;
};

export const isValidString = (strVal, varName) => {
  if (!strVal) {
    throw new Error(`Error: You must supply a ${varName}!`);
  }
  if (typeof strVal !== "string") {
    throw new Error(`Error: ${varName} must be a string!`);
  }
  strVal = strVal.trim();
  if (strVal.length === 0) {
    throw new Error(
      `Error: ${varName} cannot be an empty string or string with just spaces`
    );
  }
  if (!isNaN(strVal)) {
    throw new Error(
      `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
    );
  }
  return strVal;
};

export const isValidArray = async (arr, varName) => {
  if (arr.length === 0) {
    throw new Error(`${varName} cannot be an empty array`);
  }
  if (!arr || !Array.isArray(arr)) {
    throw new Error(`You must provide an array of ${varName}`);
  }
  for (let i in arr) {
    if (typeof arr[i] !== "string" || arr[i].trim().length === 0) {
      throw new Error(
        `One or more elements in ${varName} array is not a string or is an empty string`
      );
    }
    arr[i] = arr[i].trim();
  }

  return arr;
};

export const isValidNumber = async (value, varName) => {
  if (value === undefined || value === null) {
    throw new Error(`${varName} is required.`);
  }

  if (typeof value !== "number" || isNaN(value)) {
    throw new Error(`${varName} must be a valid number.`);
  }

  return value;
};

export const calculateOverallRatings = async (
  courseId,
  newOverallValue,
  newDifficultyValue,
  isDeleting,
  currentTotalRatings
) => {
  if (!ObjectId.isValid(courseId)) {
    throw new Error("Course ID is not a valid ObjectId");
  }
  console.log("isDeleting", isDeleting);
  console.log("courseId", courseId);
  console.log("newOverallValue", newOverallValue);
  console.log("newDifficultyValue", newDifficultyValue);
  console.log("currentTotalRatings", currentTotalRatings);

  //if we are adding a new rating we will be sending the current total ratings+1
  if (!courseId || !newOverallValue || !newDifficultyValue) {
    throw new Error(
      "Course ID, overall value and difficulty value are required"
    );
  }
  if (!currentTotalRatings) {
    throw new Error("Current total ratings are required");
  }
  if (isDeleting === undefined) {
    throw new Error("isDeleting is required");
  }
  if (!ObjectId.isValid(courseId)) {
    throw new Error("Invalid course ID");
  }
  if (
    typeof newOverallValue !== "number" ||
    typeof newDifficultyValue !== "number"
  ) {
    throw new Error("Overall value and difficulty value must be numbers");
  }
  if (isDeleting) {
    console.log("Inside isDeleting");

    currentTotalRatings = currentTotalRatings - 1;
    let course = await getCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    if (currentTotalRatings === 0) {
      return {
        updatedaverageRating: 0,
        updatedDifficulty: 0,
      };
    }
    let updatedaverageRating =
      (course.averageRating * course.reviews.length - newOverallValue) /
      currentTotalRatings;
    let updatedDifficulty =
      (course.difficultyRating * course.reviews.length - newDifficultyValue) /
      currentTotalRatings;
    updatedaverageRating = Math.round(updatedaverageRating * 10) / 10;
    updatedDifficulty = Math.round(updatedDifficulty * 10) / 10;
    console.log("updatedOverall", updatedaverageRating);
    console.log("updatedDifficulty", updatedDifficulty);

    return {
      updatedaverageRating,
      updatedDifficulty,
    };
  } else {
    let course = await getCourseById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    if (course.reviews.length === 0) {
      return {
        updatedDifficulty: newOverallValue,
        updatedaverageRating: newDifficultyValue,
      };
    } else {
      let updatedaverageRating =
        (course.averageRating * course.reviews.length + newOverallValue) /
        currentTotalRatings;
      let updatedDifficulty =
        (course.difficultyRating * course.reviews.length + newDifficultyValue) /
        currentTotalRatings;
      updatedaverageRating = Math.round(updatedaverageRating * 10) / 10;
      updatedDifficulty = Math.round(updatedDifficulty * 10) / 10;
      console.log("updatedOverall", updatedaverageRating);
      console.log("updatedDifficulty", updatedDifficulty);

      return {
        updatedaverageRating,
        updatedDifficulty,
      };
    }
  }
};
export const courseValidation = async (
  courseCode,
  courseName,
  courseDescription,
  departmentId
) => {
  if (!courseCode || !courseName || !courseDescription || !departmentId) {
    throw new Error("Please fill all the fields");
  }
  if (
    courseCode.trim().length === 0 ||
    courseName.trim().length === 0 ||
    courseDescription.trim().length === 0 ||
    departmentId.trim().length === 0
  ) {
    throw new Error("Please fill all the fields");
  }
  if (
    typeof courseCode !== "string" ||
    typeof courseName !== "string" ||
    typeof courseDescription !== "string" ||
    typeof departmentId !== "string"
  ) {
    throw new Error(
      "Course code, name, description and department ID must be strings"
    );
  }

  courseCode = courseCode.trim();
  courseName = courseName.trim();
  courseDescription = courseDescription.trim();
  departmentId = departmentId.trim();
  const courseCodeRegex = /^[A-Za-z]{2}(?:\d{3}|\d{4})$/;
  if (!courseCodeRegex.test(courseCode)) {
    throw new Error(
      "Course code must be in the format of 2-4 uppercase letters followed by 3 digits"
    );
  }
  departmentId = isValidID(departmentId, "Department ID");

  return true;
};

export const reportTypeValidation = async (type) => {
  const validTypes = ["Forum", "Review", "AcademicResource"];
  if (!validTypes.includes(type)) {
    throw new Error("Not a valid report type");
  }
  return type;
};

export const calculateOverallRatingsForAdding = async (
  courseId,
  newOverallValue,
  newDifficultyValue,
  totalNumberOfRatings
) => {
  console.log("courseId", courseId);
  console.log("newOverallValue", newOverallValue);
  console.log("newDifficultyValue", newDifficultyValue);
  console.log("totalNumberOfRatings", totalNumberOfRatings);

  if (!courseId || !newOverallValue || !newDifficultyValue) {
    throw new Error(
      "Course ID, overall value and difficulty value are required"
    );
  }
  if (totalNumberOfRatings === undefined) {
    throw new Error("Total number of ratings are required");
  }
  if (!ObjectId.isValid(courseId)) {
    throw new Error("Invalid course ID");
  }
  if (
    typeof newOverallValue !== "number" ||
    typeof newDifficultyValue !== "number"
  ) {
    throw new Error("Overall value and difficulty value must be numbers");
  }
  if (totalNumberOfRatings === 0) {
    return {
      updatedaverageRating: newOverallValue,
      updatedDifficulty: newDifficultyValue,
    };
  }
  let course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  totalNumberOfRatings = totalNumberOfRatings + 1;
  console.log("totalNumberOfRatings", totalNumberOfRatings);
  let updatedaverageRating =
    (course.averageRating + newOverallValue) / totalNumberOfRatings;
  let updatedDifficulty =
    (course.difficultyRating + newDifficultyValue) / totalNumberOfRatings;
  console.log("updatedOverall", updatedaverageRating);
  console.log("updatedDifficulty", updatedDifficulty);

  updatedaverageRating = parseInt(updatedaverageRating);
  updatedDifficulty = parseInt(updatedDifficulty);

  return {
    updatedaverageRating,
    updatedDifficulty,
  };
};
export const calculateOverallRatingsForDeleting = async (
  courseId,
  newOverallValue,
  newDifficultyValue,
  currentTotalRatings
) => {
  if (!courseId || !newOverallValue || !newDifficultyValue) {
    throw new Error(
      "Course ID, overall value and difficulty value are required"
    );
  }
  if (!currentTotalRatings) {
    throw new Error("Current total ratings are required");
  }
  if (!ObjectId.isValid(courseId)) {
    throw new Error("Invalid course ID");
  }
  if (
    typeof newOverallValue !== "number" ||
    typeof newDifficultyValue !== "number"
  ) {
    throw new Error("Overall value and difficulty value must be numbers");
  }

  let course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }
  currentTotalRatings = currentTotalRatings - 1;
  console.log("currentTotalRatings", currentTotalRatings);
  if (currentTotalRatings === 0) {
    return {
      updatedaverageRating: 0,
      updatedDifficulty: 0,
    };
  }
  console.log("newOverallValue", newOverallValue);
  console.log("newDifficultyValue", newDifficultyValue);
  console.log("currentTotalRatings", currentTotalRatings);

  let updatedaverageRating =
    (course.averageRating * course.reviews.length - newOverallValue) /
    currentTotalRatings;
  let updatedDifficulty =
    (course.difficultyRating * course.reviews.length - newDifficultyValue) /
    currentTotalRatings;
  updatedaverageRating = Math.round(updatedaverageRating * 10) / 10;
  updatedDifficulty = Math.round(updatedDifficulty * 10) / 10;
  console.log("updatedOverall", updatedaverageRating);
  console.log("updatedDifficulty", updatedDifficulty);
  if (updatedaverageRating < 0) {
    updatedaverageRating = 0;
  }
  if (updatedDifficulty < 0) {
    updatedDifficulty = 0;
  }
  updatedaverageRating = parseInt(updatedaverageRating);
  updatedDifficulty = parseInt(updatedDifficulty);
  console.log("updatedOverall", updatedaverageRating);
  console.log("updatedDifficulty", updatedDifficulty);

  return {
    updatedaverageRating,
    updatedDifficulty,
  };
};
export const calculateOverallRatingsForUpdating = async (
  courseId,
  newOverallValue,
  newDifficultyValue,
  currentTotalRatings
) => {
  if (!courseId || !newOverallValue || !newDifficultyValue) {
    throw new Error(
      "Course ID, overall value and difficulty value are required"
    );
  }
  if (!currentTotalRatings) {
    throw new Error("Current total ratings are required");
  }
  if (!ObjectId.isValid(courseId)) {
    throw new Error("Invalid course ID");
  }
  if (
    typeof newOverallValue !== "number" ||
    typeof newDifficultyValue !== "number"
  ) {
    throw new Error("Overall value and difficulty value must be numbers");
  }

  let updatedaverageRating =
    (newOverallValue + currentTotalRatings) / currentTotalRatings;
  let updatedDifficulty =
    (newDifficultyValue + currentTotalRatings) / currentTotalRatings;
  updatedaverageRating = Math.round(updatedaverageRating * 10) / 10;
  updatedDifficulty = Math.round(updatedDifficulty * 10) / 10;

  return {
    updatedaverageRating,
    updatedDifficulty,
  };
};
