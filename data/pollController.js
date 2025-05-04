import Poll from "../models/polls.model.js";
import User from "../models/user.model.js";
import {
  isValidArray,
  isValidString,
  isValidID,
} from "../utils/validation.utils.js";

export async function createPoll({
  question,
  options,
  createdBy,
  imageURLs,
  tags,
}) {
  if (typeof question !== "string" || !question.trim()) {
    throw new Error("Poll question must be a non‑empty string");
  }
  if (!Array.isArray(options) || options.length < 2) {
    throw new Error("You must provide at least two options");
  }
  if (imageURLs) {
    imageURLs = await isValidArray(imageURLs);
    imageURLs = imageURLs.map((url) => isValidString(url, "Image URL"));
  }
  if (tags && tags.length !== 0) {
    tags = await isValidArray(tags, "Tags");
    tags = tags.map((tag) => isValidID(tag, "TagID"));
  }
  const formattedOptions = options.map((optText) => ({
    answer: optText.trim(),
  }));
  const poll = new Poll({
    question: question.trim(),
    options: formattedOptions,
    createdBy,
    imageURLs: imageURLs || [],
    tags: tags || [],
  });
  try {
    const savedPoll = await poll.save();
    if (!savedPoll || !savedPoll._id) {
      throw new Error("Could not create a new Poll");
    }
    return savedPoll;
  } catch (error) {
    throw new Error(error.message);
  }
}
