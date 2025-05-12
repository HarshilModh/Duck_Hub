import mongoose from "mongoose";
import Announcement from "../models/adminAnnouncements.model.js";
import { isValidString } from "../utils/validation.utils.js";
// Create a new announcement
export const createAnnouncement = async (title, content) => {
    // Validate input
    if (!title || !content) {
        throw new Error("Title and content are required");
    }
    // Check if the title already exists
   
    try{
        title = isValidString(title,"title");
        content = isValidString(content,"content");
        content=content.trim();
    }
    catch (error) {
        throw new Error("Invalid input: " + error.message);
    }
    const existingAnnouncement = await Announcement.findOne({ title });
    if (existingAnnouncement) {
        throw new Error("Announcement with this title already exists");
    }
    // Create a new announcement
    try {
        const newAnnouncement = new Announcement({
        title,
        content,
        });
        await newAnnouncement.save();
        return newAnnouncement;
    } catch (error) {
        throw new Error("Error creating announcement: " + error.message);
    }
    }

// Get all announcements
export const getAllAnnouncements = async () => {
    try {
        const announcements = await Announcement.find().lean();
        return announcements;
    } catch (error) {
        throw new Error("Error fetching announcements: " + error.message);
    }
}
// Get a single announcement by ID
export const getAnnouncementById = async (id) => {
    // Validate input
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid announcement ID");
    }
    try {
        const announcement = await Announcement.findById(id).lean();
        if (!announcement) {
            throw new Error("Announcement not found");
        }
        return announcement;
    } catch (error) {
        throw new Error("Error fetching announcement: " + error.message);
    }
}
// Update an announcement by ID
export const updateAnnouncement = async (id, title, content) => {
    // Validate input
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid announcement ID");
    }
    if (!title || !content) {
        throw new Error("Title and content are required");
    }
    try{
        title = isValidString(title,"title");
        content = isValidString(content,"content");
    }
    catch (error) {
        throw new Error("Invalid input: " + error.message);
    }
    // Check if the announcement exists
    const existingAnnouncement = await Announcement.findById(id);
    if (!existingAnnouncement) {
        throw new Error("Announcement not found");
    }
    // Check if the title already exists
    const duplicateAnnouncement = await Announcement.findOne({ title });
    if (duplicateAnnouncement && duplicateAnnouncement._id.toString() !== id) {
        throw new Error("Announcement with this title already exists");
    }
    // Update the announcement
    try {
        existingAnnouncement.title = title;
        existingAnnouncement.content = content;
        await existingAnnouncement.save();
        return existingAnnouncement;
    } catch (error) {
        throw new Error("Error updating announcement: " + error.message);
    }
}
// Delete an announcement by ID
export const deleteAnnouncement = async (id) => {
    // Validate input
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid announcement ID");
    }
    // Check if the announcement exists
    const existingAnnouncement = await Announcement.findById(id);
    if (!existingAnnouncement) {
        throw new Error("Announcement not found");
    }
    // Delete the announcement  
    try {
        await Announcement.findByIdAndDelete(id);
        return { message: "Announcement deleted successfully" };
    } catch (error) {
        throw new Error("Error deleting announcement: " + error.message);
    }
}