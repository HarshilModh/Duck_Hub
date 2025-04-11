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
