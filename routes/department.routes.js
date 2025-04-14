import  express from 'express';
import {createDepartment,deleteDepartmentById,getAllDepartments,getDepartmentById,updateDepartmentById} from '../data/departmentController.js';

const router = express.Router();
// Create a new department
router.post('/', createDepartment);
// Get all departments
router.get('/', getAllDepartments);
// Get a department by ID
router.get('/:id', getDepartmentById);
// Update a department by ID
router.put('/:id', updateDepartmentById);
// Delete a department by ID
router.delete('/:id', deleteDepartmentById);

// Export the router
export default router;