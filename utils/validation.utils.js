import { ObjectId } from "mongodb";

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
