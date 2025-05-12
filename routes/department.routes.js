import  express from 'express';
import {createDepartment,deleteDepartmentById,getAllDepartments,getDepartmentById,updateDepartmentById} from '../data/departmentController.js';
import session from 'express-session';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import xss from 'xss';
import { checkRole } from '../middlewares/roleCheck.middleware.js';
import { isValidString,isValidID } from '../utils/validation.utils.js';
const router = express.Router();
//render department page and print all departments

router.route('/').get(isLoggedIn,checkRole("admin"),async (req, res) => {
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
router.route("/userSideDepartment").get(isLoggedIn,async (req, res) => {
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
//test xss
//testing done working fine
router.route('/addDepartment').get(isLoggedIn,checkRole("admin"),(req, res) => {
    console.log('Rendering create department page');
    res.render('addDepartment', { title: 'Create Department' });
}
).post(isLoggedIn,checkRole("admin"),async (req, res) => {

    let name = xss(req.body.departmentName);
   if (!name) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department name',
        };
        return res.redirect('/departments/addDepartment');
    }
    try {
        name = isValidString(name);
    } catch (error) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department name',
        };
        return res.redirect('/departments/addDepartment');
    }
    if (!name) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department name',
        };
        return res.redirect('/departments/addDepartment');
    }
    try{
        name=isValidString(name);
    }
    catch(error){
        console.log(error);
    }
    try {
        const newDepartment = await createDepartment(name);
        if (!newDepartment) {
            req.session.toast = {
                type: 'error',
                message: 'Failed to create department',
            };
            return res.redirect('/departments/addDepartment');
        }
        req.session.toast = {
            type: 'success',
            message: 'Department created successfully',
        };
        res.redirect('/departments');
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to create department',
        };
        res.redirect('/departments/addDepartment');
    }
    
})
router.route('/deleteDepartment/:id').delete(isLoggedIn,checkRole("admin"),async (req, res) => {
    const departmentId = req.params.id;
    if (!departmentId) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department ID',
        };
        return res.redirect('/departments');
    }
   // Validate the department ID
    try {
          departmentId = isValidID(departmentId);
     } catch (error) {
          console.log(error);
     }
    try {
       let deletedDepartment = await deleteDepartmentById(departmentId);
        if (!deletedDepartment) {
            req.session.toast = {
                type: 'error',
                message: 'Department not found',
            };
            return res.redirect('/departments');
        }
        req.session.toast = {
            type: 'success',
            message: 'Department deleted successfully',
        };
        res.redirect('/departments');
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to delete department',
        };
        res.redirect('/departments');
    }
});
//edit department
//test xss
//testing done working fine
router.route("/editDepartment/:id").get(isLoggedIn,checkRole("admin"),async (req, res) => {
    let departmentId = req.params.id;
    if (!departmentId) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department ID',
        };
        return res.redirect('/departments');
    }
    try {
        departmentId = isValidID(departmentId);
    } catch (error) {
        console.log(error);
    }
    try {
        const department = await getDepartmentById(departmentId);
        if (!department) {
            req.session.toast = {
                type: 'error',
                message: 'Department not found',
            };
            return res.redirect('/departments');
        }
        res.render('editDepartment', { title: 'Edit Department', department });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch department',
        };
        res.redirect('/departments');
    }
}
).put(isLoggedIn,checkRole("admin"),async (req, res) => {
    let departmentId = req.params.id;
    let name = xss(req.body.departmentName);
    if (!departmentId) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department ID',
        };
        return res.redirect('/departments');
    }
    try {
        departmentId = isValidID(departmentId);
    } catch (error) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department ID',
        };
        return res.redirect('/departments');
    }
   
    if (!name) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid department name',
        };
        return res.redirect('/departments');
    }
    try{
        name=isValidString(name);
    }
    catch(error){
        req.session.toast = {
            type: 'error',
            message: 'Invalid department name',
        };
        return res.redirect('/departments');
    }
    try {
        const updatedDepartment = await updateDepartmentById(departmentId, name);
        if (!updatedDepartment) {
            req.session.toast = {
                type: 'error',
                message: 'Department not found',
            };
            return res.redirect('/departments');
        }
        req.session.toast = {
            type: 'success',
            message: 'Department updated successfully',
        };
        res.redirect('/departments');
    } catch (error) {
        error.message = error.message || "Failed to update department";
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: error.message,
        };
        res.redirect('/departments');
    }
});
//search department regex
//test xss
//testing done working fine
router.route('/searchDepartment').post(isLoggedIn,async (req, res) => {
   
    try { let  searchQuery = xss(req.body.search);
        searchQuery = searchQuery.trim();
        console.log('Search query:', searchQuery);
        
        if (!searchQuery) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid search query',
            };
            return res.redirect('/departments');
        }
        console.log('Searching departments with query:', searchQuery);
        const departments = await getAllDepartments();
        if (!departments) {
            req.session.toast = {
                type: 'error',
                message: 'No departments found',
            };
            return res.redirect('/departments');
        }
        const filteredDepartments = departments.filter(department =>
            department.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        res.render('department', { title: 'Department', departments: filteredDepartments, searchQuery,Filtered: true });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch departments',
        };
    }
});
router.route('/searchDepartmentForUser').post(isLoggedIn,async (req, res) => {
   
    try { let  searchQuery = xss(req.body.search);
        searchQuery = searchQuery.trim();
        console.log('Search query:', searchQuery);
        
        if (!searchQuery) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid search query',
            };
            return res.redirect('/departments/userSideDepartment');
        }
        console.log('Searching departments with query:', searchQuery);
        const departments = await getAllDepartments();
        if (!departments) {
            req.session.toast = {
                type: 'error',
                message: 'No departments found',
            };
            return res.redirect('/departments/userSideDepartment');
        }
        const filteredDepartments = departments.filter(department =>
            department.departmentName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        res.render('departmentUserSide', { title: 'Department', departments: filteredDepartments, searchQuery,Filtered: true });
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