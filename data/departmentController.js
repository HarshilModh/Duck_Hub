import mongoose from "mongoose";
import Department from "../models/department.model.js";
import { isValidString } from "../utils/validation.utils.js";

// Create a new department
export const createDepartment = async (departmentName) => {
    try {
        if (!departmentName) {
            throw new Error("Department name is required");
        }
        // Check if the department already exists
        const existingDepartment = await Department.findOne({ departmentName });
        if (existingDepartment) {
            throw new Error("Department already exists");
        }
       try{
        departmentName = isValidString(departmentName);
       }
         catch(error){
            throw new Error("Invalid department name");
         }
          const newDepartment = new Department({ departmentName });
          await newDepartment.save();
          return newDepartment;
    } catch (error) {
        console.error("Error creating department:", error);
        throw new Error("Failed to create department");
    }
};
// Get all departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find().lean();
        return departments
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get a department by ID
export const getDepartmentById = async (departmentId) => {
    try {
        if (!departmentId) {
            throw new Error("Department ID is required");
        }
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            throw new Error("Invalid department ID");
        }
        const department = await Department.findById(departmentId).lean();
        if (!department) {
            throw new Error("Department not found");
        }
        return department;
    } catch (error) {
        console.error("Error getting department:", error);
        throw new Error("Failed to get department");
    }
};
// Update a department by ID
export const updateDepartmentById = async (departmentId,departmentName) => {
    if (!departmentName) {
        throw new Error("Department name is required");
    }
    // Check if the department already exists
    const existingDepartment = await Department.findOne({ departmentName });
    if (existingDepartment) {
        throw  new Error("Department already exists");
    }
    try {
       
        // Validate the department name
        try {
            departmentName = isValidString(departmentName);
        } catch (error) {
            throw new Error("Invalid department name");
        }
        // Validate the department ID
        if (!departmentId) {
            throw new Error("Department ID is required");
        }
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            throw new Error("Invalid department ID");
        }
        const updatedDepartment = await Department.findByIdAndUpdate(
            departmentId,
            { $set: { departmentName } },
            { new: true }
        );
        if (!updatedDepartment) {
            throw new Error("Department not found");
        }
        return updatedDepartment;
    } catch (error) {
        console.error("Error updating department:", error);
        throw new Error("Failed to update department");
    }
}
// Delete a department by ID
export const deleteDepartmentById = async (departmentId) => {
    try {
        
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            throw new Error("Invalid department ID");
        }
        const deletedDepartment = await Department.findByIdAndDelete(departmentId);
        if (!deletedDepartment) {
            throw new Error("Department not found");
        }
        return deletedDepartment;
    } catch (error) {
        console.error("Error deleting department:", error);
        throw new Error("Failed to delete department");
    }
}
//seaarch department by name even if it is not exact
export const searchDepartmentByName = async (req, res) => {
     const departmentName = req.params.departmentName;
    try {
        const departments = await Department.find({
            departmentName: { $regex: departmentName, $options: "i" },
        });
        if (departments.length === 0) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
