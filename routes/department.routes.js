import  express from 'express';
import {createDepartment,deleteDepartmentById,getAllDepartments,getDepartmentById,updateDepartmentById} from '../data/departmentController.js';
import session from 'express-session';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/roleCheck.middleware.js';
const router = express.Router();
//render department page and print all departments
router.use(isLoggedIn,checkRole('admin'));
router.route('/').get(async (req, res) => {
    console.log('Fetching all departments');
    
    try {
        const departments = await getAllDepartments();
        console.log(departments);
        if (!departments) {
            req.session.toast = {
                type: 'error',
                message: 'No departments found',
            };
            return res.redirect('/users/userProfile');
        }
        
        res.render('department', { title: 'Department', departments });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch departments',
        };
    }
});
router.route("/userSideDepartment").get(async (req, res) => {
    console.log('Fetching all departments');
    
    try {
        const departments = await getAllDepartments();
        console.log(departments);
        if (!departments) {
            req.session.toast = {
                type: 'error',
                message: 'No departments found',
            };
            return res.redirect('/users/userProfile');
        }
        
        res.render('departmentUserSide', { title: 'Department', departments });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch departments',
        };
    }
});
// Export the router
export default router;