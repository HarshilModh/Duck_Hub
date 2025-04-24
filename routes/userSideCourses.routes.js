import express from 'express';
import { createCourse, deleteCourseById, getAllCourses, getCourseById, updateCourseById } from '../data/courseController.js';
import session from 'express-session';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { isValidID } from '../utils/validation.utils.js';
const app = express();
const router = express.Router();
// Middleware to check if user is logged in
router.use(isLoggedIn);


//load course reviews page
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
        
        res.render('userCourse', { title: 'Courses', courses });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch courses',
        };
    }

});
//load course details page with reviews
router.route('/course/:id').get(async (req, res) => {
    let courseId = req.params.id;
    if (!courseId) {
        req.session.toast = {
            type: 'error',
            message: 'Course ID is required',
        };
        return res.redirect('/users/userProfile');
    }
    courseId = courseId.trim();
    // Check if courseId is a valid ObjectId
    try {
        if (!isValidID(courseId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid course ID',
            };
            return res.redirect('/users/userProfile');
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid course ID',
        };
        return res.redirect('/users/userProfile');
    }
    // Fetch course details
    console.log('Fetching course with ID:', courseId);
    try {
        const course = await getCourseById(courseId);
        if (!course) {
            req.session.toast = {
                type: 'error',
                message: 'Course not found',
            };
            return res.redirect('/users/userProfile');
        }
        console.log("rendering course details page");
        console.log("courseName: ", course.courseName);
        console.log("courseCode: ", course.courseCode);
        
        res.render('userCourseDetails', { title: 'Course Details', course:course });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch course details',
        };
    }
});
//load add course review page
router.route('/course/:id/addReview').get(async (req, res) => {
    let courseId = req.params.id;
    if (!courseId) {
        req.session.toast = {
            type: 'error',
            message: 'Course ID is required',
        };
        return res.redirect('/users/userProfile');
    }
    courseId = courseId.trim();
    // Check if courseId is a valid ObjectId
    try {
        if (!isValidID(courseId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid course ID',
            };
            return res.redirect('/users/userProfile');
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid course ID',
        };
        return res.redirect('/users/userProfile');
    }
    // Fetch course details
    console.log('Fetching course with ID:', courseId);
    try {
        const course = await getCourseById(courseId);
        if (!course) {
            req.session.toast = {
                type: 'error',
                message: 'Course not found',
            };
            return res.redirect('/users/userProfile');
        }
        console.log("rendering add review page");
        
        res.render('addCourseReview', { title: 'Add Review', course });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch course details',
        };
    }
});
export default router;