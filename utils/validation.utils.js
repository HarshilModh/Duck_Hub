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
  newDifficulty,
  newOverall,
  isDeleted,
  totalRatings
) => {
  courseId = isValidID(courseId, "Course ID");
  let course;
  try {
    course = await getCourseById(courseId);
    if (!course) {
      throw new Error("No course found with the given ID");
    }
    const existingDifficulty = course.difficultyRating;
    const existingAverage = course.averageRating;

    let updatedDifficulty = 0;
    let updatedOverall = 0;
    if (isDeleted) {
      updatedDifficulty =
        (existingDifficulty * (totalRatings + 1) - newDifficulty) /
        totalRatings;
      updatedOverall =
        (existingAverage * (totalRatings + 1) - newOverall) / totalRatings;
    } else {
      updatedDifficulty =
        (existingDifficulty * (totalRatings - 1) + newDifficulty) /
        totalRatings;
      updatedOverall =
        (existingAverage * (totalRatings - 1) + newOverall) / totalRatings;
    }

    const returnObject = { updatedDifficulty, updatedOverall };
    return returnObject;
  } catch (error) {
    throw new Error(error.message);
  }
};
