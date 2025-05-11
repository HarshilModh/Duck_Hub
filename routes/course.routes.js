import express from 'express';
import { createCourse, deleteCourseById, getAllCourses, getCourseById, updateCourseById } from '../data/courseController.js';
import { getAllDepartments } from "../data/departmentController.js"
import session from 'express-session';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/roleCheck.middleware.js';
import Department from '../models/department.model.js';
import xss from 'xss';
import { courseValidation } from '../utils/validation.utils.js';
import { deleteReviewByCourseId } from '../data/courseReviewController.js';
import { isCourseCodeExists, isCourseNameExists } from '../data/courseController.js';

import { isValidID, isValidString } from '../utils/validation.utils.js';

const router = express.Router();
// Render course page and print all courses

//load add course page
router.route('/addCourse').get(isLoggedIn,checkRole("admin"),async (req, res) => {
    const departments = await getAllDepartments();
    res.render('addCourse', { title: 'Add Course', departments });
}).post(isLoggedIn,checkRole("admin"),async (req, res) => {

    console.log('Creating course');
    
    console.log(req.body);
    
    let courseName = xss(req.body.courseName);
    let courseCode = xss(req.body.courseCode);
    let courseDescription = xss(req.body.courseDescription);
    let courseDepartment = xss(req.body.departmentId);
    if (!courseName || !courseCode || !courseDescription || !courseDepartment) {
        req.session.toast = {
            type: 'error',
            message: 'Please fill all the fields',
        };
        return res.redirect('/courses/addCourse');
    }
    if (courseCode.trim().length === 0 || courseName.trim().length === 0 || courseDescription.trim().length === 0 || courseDepartment.trim().length === 0) {
        req.session.toast = {
            type: 'error',
            message: 'Please fill all the fields',
        };
        return res.redirect('/courses/addCourse');
    }
    if (typeof courseCode !== "string" || typeof courseName !== "string" || typeof courseDescription !== "string" || typeof courseDepartment !== "string") {
        req.session.toast = {
            type: 'error',
            message: 'Course code, name, description and department ID must be strings',
        };
        return res.redirect('/courses/addCourse');
    }
    courseCode = courseCode.trim()
    courseName = courseName.trim()
    courseDescription = courseDescription.trim();
    courseDepartment = courseDepartment.trim();
    // Validate course data
    try {
        await courseValidation(courseCode, courseName, courseDescription, courseDepartment);
    } catch (error) {
        req.session.toast = {
            type: 'error',
            message: error.message,
        };
        return res.redirect('/courses/addCourse');
    }
    // Check if course already exists with the same code
    try {
        const existingCourse = await isCourseCodeExists(courseCode);
        if (existingCourse) {
            req.session.toast = {
                type: 'error',
                message: 'Course already exists with the same code',
            };
            return res.redirect('/courses/addCourse');
        }
    } catch (error) {
        req.session.toast = {
            type: 'error',
            message: 'Failed to check course code'+error.message,
        };
        return res.redirect('/courses/addCourse');
    }
    
    // Check if department exists
    const existingDepartment = await Department.findById(courseDepartment);
    if (!existingDepartment) {
        req.session.toast = {
            type: 'error',
            message: 'Department does not exist',
        };
        return res.redirect('/courses/addCourse');
    }
    // Check if course already exists with the same name
    

    try {
        const newCourse = await createCourse(courseCode, courseName, courseDescription, courseDepartment);
        console.log(newCourse);
        if (!newCourse) {
            req.session.toast = {
                type: 'error',
                message: 'Failed to create course',
            };
            return res.redirect('/courses/addCourse');
        }
        req.session.toast = {
            type: 'success',
            message: `Course created successfully named ${newCourse.courseName} with code ${newCourse.courseCode}`,
        };
        return res.redirect('/userSideCourses');
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to create course'+error.message,
        };
        return res.redirect('/courses/addCourse');
    }
});
//load course page
router.route('/').get(async (req, res) => {
    console.log('Fetching all courses');
    try {
        const courses = await getAllCourses();
        console.log(courses);
        if (!courses) {
            req.session.toast = {
                type: 'error',
                message: 'No courses found',
            };
            return res.redirect('/users/userProfile');
        }
        console.log("rendering course page");

        res.render('course', { title: 'Course', courses });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch courses',
        };
    }

});
router.route('/:id').get(async (req, res) => {
    console.log('Fetching course by ID');
    let courseId = req.params.id;
    courseId = courseId.trim();
    if (courseId.length === 0) {
        req.session.toast = {
            type: 'error',
            message: 'Please provide a course ID',
        };
        return res.redirect('/userSideCourses');
    }
    if (typeof courseId !== "string") {
        req.session.toast = {
            type: 'error',
            message: 'Course ID must be a string',
        };
        return res.redirect('/userSideCourses');
    }
    // Validate course ID
    try {
        const isIDValid=isValidID(courseId, "Course ID");
        if (!isIDValid) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid course ID',
            };
            return res.redirect('/userSideCourses');
        }
    } catch (error) {
        req.session.toast = {
            type: 'error',
            message: error.message,
        };
        return res.redirect('/userSideCourses');
    }
    try {
        const course = await getCourseById(courseId);
        const departments= await getAllDepartments();
        if (!course) {
            req.session.toast = {
                type: 'error',
                message: 'No course found with the given ID',
            };
            return res.redirect('/userSideCourses');
        }
        console.log("rendering course details page", course);

        
        res.render('editCourse', { 
            title: 'Course Details', 
            courseName: course.courseName, 
            courseCode: course.courseCode, 
            courseDescription: course.courseDescription, 
            departments: departments,
            courseId: courseId 
        });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch course details',
        };
        return res.redirect('/userSideCourses');
    }
}).put(isLoggedIn,checkRole("admin"),async(req,res)=>{
    console.log('Updating course by ID');
    let courseId = xss(req.body.id) || req.params.id;
    console.log(courseId);
    console.log(req.body);
    let courseName = xss(req.body.courseName);
    let courseCode = xss(req.body.courseCode);
    let courseDescription = xss(req.body.courseDescription);
    let courseDepartment = xss(req.body.departmentId);
    if (!courseName || !courseCode || !courseDescription || !courseDepartment) {
        req.session.toast = {
            type: 'error',
            message: 'Please fill all the fields',
        };
        return res.redirect('/userSideCourses');
    }
    if (courseCode.trim().length === 0 || courseName.trim().length === 0 || courseDescription.trim().length === 0 || courseDepartment.trim().length === 0) {
        req.session.toast = {
            type: 'error',
            message: 'Please fill all the fields',
        };
        return res.redirect('/courses/addCourse');
    }
    if (typeof courseCode !== "string" || typeof courseName !== "string" || typeof courseDescription !== "string" || typeof courseDepartment !== "string") {
        req.session.toast = {
            type: 'error',
            message: 'Course code, name, description and department ID must be strings',
        };
        return res.redirect('/userSideCourses');
    }
    courseCode = courseCode.trim()
    courseName = courseName.trim()
    courseDescription = courseDescription.trim();
    courseDepartment = courseDepartment.trim();
    
    // Validate course data
    try {
        await courseValidation(courseCode, courseName, courseDescription, courseDepartment);
    } catch (error) {
        req.session.toast = {
            type: 'error',
            message: error.message,
        };
        return res.redirect('/userSideCourses');
    }
    
    // Check if department exists
    const existingDepartment = await Department.findById(courseDepartment);
    if (!existingDepartment) {
        req.session.toast = {
            type: 'error',
            message: 'Department does not exist',
        };
        return res.redirect('/userSideCourses');
    }
    

    // Update course
    try {
        const updatedCourse = await updateCourseById(courseId, courseCode, courseName, courseDescription, courseDepartment);
        if (!updatedCourse) {
            req.session.toast = {
                type: 'error',
                message: 'Failed to update course',
            };
            return res.redirect('/userSideCourses');
        }
        req.session.toast = {
            type: 'success',
            message: `Course updated successfully`,
        };
        return res.redirect('/userSideCourses');
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to update course',
        };
        return res.redirect('/userSideCourses');
    }
}).delete(async (req, res) => {
    console.log('Deleting course by ID');
    const courseId = req.params.id;
    try {
        const deletedCourse = await deleteCourseById(courseId);
        if (!deletedCourse) {
            req.session.toast = {
                type: 'error',
                message: 'Failed to delete course',
            };
            return res.redirect('/userSideCourses');
        }
        //delete all the reviews related to the course
        const deletedReviews = await deleteReviewByCourseId(courseId);
        req.session.toast = {
            type: 'success',
            message: `Course deleted successfully`,
        };
        return res.redirect('/userSideCourses');
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to delete course',
        };
        return res.redirect('/userSideCourses');
    }
})

export default router;