import mongoose from "mongoose";
import Department from "../models/department.model.js";
import e from "cors";

// Create a new department
export const createDepartment = async (req, res) => {
    try {
        const departmentName  = req.body.departmentName;
        const newDepartment = new Department({ departmentName });
        await newDepartment.save();
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get all departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get a department by ID
export const getDepartmentById = async (req, res) => {
    try {
        const departmentId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Update a department by ID
export const updateDepartmentById = async (req, res) => {
    try {
        const departmentId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }
        const updatedDepartment = await Department.findByIdAndUpdate(
            departmentId,
            req.body,
            { new: true }
        );
        if (!updatedDepartment) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Delete a department by ID
export const deleteDepartmentById = async (req, res) => {
    try {
        const departmentId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "Invalid department ID" });
        }
        const deletedDepartment = await Department.findByIdAndDelete(departmentId);
        if (!deletedDepartment) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
