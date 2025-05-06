import Poll from "../models/polls.model.js";
import mongoose from "mongoose";
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

export async function voteOnPoll(pollId, userId, optionId) {
  if (
    !mongoose.isValidObjectId(pollId) ||
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(optionId)
  ) {
    throw new Error("Invalid poll, user, or option ID");
  }

  const poll = await Poll.findById(pollId);
  if (!poll) throw new Error("Poll not found");

  const prevOpt = poll.options.find((opt) =>
    opt.voterId.some((id) => id.equals(userId))
  );
  const newOpt = poll.options.id(optionId);
  if (!newOpt) throw new Error("Option not found");

  if (prevOpt && prevOpt._id.equals(newOpt._id)) {
    throw new Error("You have already voted for this option");
  }

  if (prevOpt) {
    prevOpt.votes = Math.max(0, prevOpt.votes - 1);
    prevOpt.voterId.pull(userId);
  }

  newOpt.votes = (newOpt.votes || 0) + 1;
  newOpt.voterId.push(userId);

  await poll.save();
  return poll;
}
