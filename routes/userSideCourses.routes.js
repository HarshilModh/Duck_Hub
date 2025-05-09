import express from 'express';
import { createCourse, deleteCourseById, getAllCourses, getCourseById, updateCourseById } from '../data/courseController.js';
import {createCourseReview,deleteCourseReviewById,downVoteReview,upVoteReview,getCourseReviewsByCourseId, getCourseReviewsByUserId, getReviewById, updateCourseReviewById} from "../data/courseReviewController.js"
import session from 'express-session';
import xss from 'xss';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import { isValidID } from '../utils/validation.utils.js';
import xss from 'xss';
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
        let courseReviews = await getCourseReviewsByCourseId(courseId);
        if (!courseReviews || courseReviews.length === 0) {
            courseReviews = [];
        }else{
            courseReviews = courseReviews.filter((review) => review.status === "active");
            courseReviews = courseReviews.map((review) => {
                return {
                    reviewId: review._id,
                    userId: review.userId,
                    courseId: review.courseId,
                    difficultyRating: review.difficultyRating,
                    overallRating: review.overallRating,
                    review: review.review,
                    status: review.status,
                    isEdited: review.isEdited,
                    isAnonymous: review.isAnonymous,
                    upVotes: review.upVotes,
                    downVotes: review.downVotes,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    user: {
                        userId: review?.userId?._id,
                        firstName: review?.userId?.firstName,
                        lastName: review?.userId?.lastName,
                    },
                    
                };                
            });
            for (let i = 0; i < courseReviews.length; i++) {
                //if userid is not there in the review then set the userId to anonymous
                if (!courseReviews[i].user.userId) {
                    courseReviews[i].userId = {
                        _id: null,
                        firstName: "Anonymous",
                        lastName: "",
                    };
                }
            }
            console.log("courseReviews: ", courseReviews);
        }
        
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
        
        res.render('userCourseDetails', { title: 'Course Details', course:course,courseReviews:courseReviews });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch course details',
        };
    }
});
//load add course review page
router.route('/course/addReview/:id').get(async (req, res) => {
    console.log("req.session.user", req.session.user);

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
        console.log("courseName: ", course.courseName);
        console.log("courseCode: ", course.courseCode);
        console.log("courseId: ", course._id);
        
        res.render('addCourseReview', { title: 'Add Review', course ,courseId});
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch course details',
        };
    }
}).post(async (req, res) => {
    console.log("add review post request");
    console.log("req.session.user", req.session.user.user._id);
    
    let courseId = req.params.id;
    let courseCode = xss(req.body.courseCode);
    let courseName = xss(req.body.courseName);
    let review = xss(req.body.review);
    let difficultyRating = xss(req.body.difficultyRating);
    let overallRating = xss(req.body.overallRating);
    let isAnonymous = xss(req.body.isAnonymous);
    if (req.body.isAnonymous === 'true') {
        isAnonymous = true;
    }
    else {
        isAnonymous = false;
    }
    // isAnonymous= req.body.isAnonymous === 'true' ? 'true' : 'false';
    console.log("courseId: ", courseId);
    console.log("courseCode: ", courseCode);
    console.log("courseName: ", courseName);
    console.log("review: ", review);
    console.log("difficultyRating: ", difficultyRating);
    console.log("overallRating: ", overallRating);
    console.log("isAnonymous: ", isAnonymous);

    
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
        
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch course details',
        };
    }
    // Validate input
    if (!review || !difficultyRating || !overallRating) {
        req.session.toast = {
            type: 'error',
            message: 'All fields are required',
        };
        return res.redirect(`/userSideCourses/course/addReview/${courseId}`);
    }
    // Check if difficultyRating and overallRating are numbers
    if (isNaN(difficultyRating) || isNaN(overallRating)) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid rating values',
        };
        return res.redirect(`/userSideCourses/course/addReview/${courseId}`);
    }
    // Check if difficultyRating and overallRating are within valid ranges
    if (difficultyRating < 1 || difficultyRating > 3 || overallRating < 1 || overallRating > 5) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid rating values',
        };
        return res.redirect(`/userSideCourses/course/addReview/${courseId}`);
    }
    // Check if isAnonymous is a boolean
    if (isAnonymous !== true && isAnonymous !== false) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid value for isAnonymous',
        };
        return res.redirect(`/userSideCourses/course/addReview/${courseId}`);
    }
    // Check if user has already reviewed the course

    const userId = (req.session.user.user._id);
    console.log("userId: ", userId);
 
    try {
        const createdReview = await createCourseReview( userId,
            courseId,
            review,
            difficultyRating,
            overallRating,
            isAnonymous);
        if (!createdReview) {
            req.session.toast = {
                type: 'error',
                message: 'Failed to create review',
            };
            return res.redirect(`/userSideCourses/course/addReview/${courseId}`);
        }else{
        req.session.toast = {
            type: 'success',
            message: 'Review added successfully',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: `Failed to create review: ${error.message}`,
        };
        return res.redirect(`/userSideCourses/course/addReview/${courseId}`);
    }
});
router.route("/myReviews").get(async (req, res) => {
    console.log("Fetching all reviews");
    try {
        const userId = req.session.user.user._id;
        let courseReviews = await getCourseReviewsByUserId(userId);
        if (!courseReviews || courseReviews.length === 0) {
            req.session.toast = {
                type: 'error',
                message: 'No reviews found',
            };
            return res.redirect('/users/userProfile');
        }
        //status: "active" or "hidden" only active reviews
        courseReviews = courseReviews.filter((review) => review.status === "active");
        courseReviews.map((review) => {
            return {
                reviewId: review._id,
                userId: review.userId,
                courseId: {
                    courseId: review.courseId._id,
                    courseCode: review.courseId.courseCode,
                    courseName: review.courseId.courseName,
                },
                difficultyRating: review.difficultyRating,
                overallRating: review.overallRating,
                review: review.review,
                status: review.status,
                isEdited: review.isEdited,
                isAnonymous: review.isAnonymous,
                upVotes: review.upVotes,
                downVotes: review.downVotes,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: {
                    userId: review.userId._id,
                    firstName: review.userId.firstName,
                    lastName: review.userId.lastName,
                },
            };
        });
        
        if (!courseReviews || courseReviews.length === 0) {
            req.session.toast = {
                type: 'error',
                message: 'No reviews found',
            };
            return res.redirect('/users/userProfile');
        }
        console.log("rendering my reviews page");
        
        res.render('MyReviews', { title: 'My Reviews', courseReviews });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch reviews',
        };
    }
});
//delete review
router.route('/deleteReview/:id').get(async (req, res) => {
    console.log("delete review request");
    let reviewId = req.params.id;
    if (!reviewId) {
        req.session.toast = {
            type: 'error',
            message: 'Review ID is required',
        };
        return res.redirect('/users/userProfile');
    }
    reviewId = reviewId.trim();
    // Check if reviewId is a valid ObjectId
    try {
        if (!isValidID(reviewId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid review ID',
            };
            return res.redirect('/users/userProfile');
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid review ID',
        };
        return res.redirect('/users/userProfile');
    }
    // Fetch course details
    console.log('Fetching review with ID:', reviewId);
    try {
        const deletedReview = await deleteCourseReviewById(reviewId);
        if (!deletedReview) {
            req.session.toast = {
                type: 'error',
                message: 'Review not found',
            };
            return res.redirect('/users/userProfile');
        }
        req.session.toast = {
            type: 'success',
            message: 'Review deleted successfully',
        };
        return res.redirect('/userSideCourses/myReviews');
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to delete review',
        };
    }
    return res.redirect(`/userSideCourses/course/${courseId}`);
});
// reviews/6811b81134bd42a91111f888/vote
{/* <input type="hidden" name="vote" value="up"> */}

router.route('/reviews/:id/vote').post(async (req, res) => {

    console.log("vote review request");
    let reviewId = req.params.id;
    let userId = req.session.user.user._id;  
    let courseId = xss(req.body.courseId);
    if (!reviewId) {
        req.session.toast = {
            type: 'error',
            message: 'Review ID is required',
        };
        //redirect to the course details page
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    if (!userId) {
        req.session.toast = {
            type: 'error',
            message: 'User ID is required',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    if (!courseId) {
        req.session.toast = {
            type: 'error',
            message: 'Course ID is required',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    userId = userId.trim();
    courseId = courseId.trim();
    reviewId = reviewId.trim();
    // Check if userId is a valid ObjectId
    try {
        if (!isValidID(userId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid user ID',
            };
            return res.redirect(`/userSideCourses/course/${courseId}`);
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid user ID',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    // Check if reviewId is a valid ObjectId
    try {
        if (!isValidID(reviewId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid review ID',
            };      
            return res.redirect(`/userSideCourses/course/${courseId}`);
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid review ID',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    // Check if courseId is a valid ObjectId
    try {
        if (!isValidID(courseId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid course ID',
            };
            return res.redirect(`users/userProfile`);
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
    console.log('Fetching review with ID:', reviewId);

    const vote = xss(req.body.vote);
    console.log("vote: ", vote);
    if (!vote) {
        req.session.toast = {
            type: 'error',
            message: 'Vote is required',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    if (vote !== 'up' && vote !== 'down') {
        req.session.toast = {
            type: 'error',
            message: 'Invalid vote value',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    // Fetch course details
    try {
        let updatedReview;
        if (vote === 'up') {
            updatedReview = await upVoteReview(reviewId, userId);
        } else {
            updatedReview = await downVoteReview(reviewId, userId);
        }
        if (!updatedReview) {
            req.session.toast = {
                type: 'error',
                message: 'Review not found',
            };
            return res.redirect(`/userSideCourses/course/${courseId}`);
        }
        req.session.toast = {
            type: 'success',
            message: 'Vote added successfully',
        };
        return res.redirect(`/userSideCourses/course/${courseId}`);
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: `Failed to add vote: ${error.message}`,
        };
    return res.redirect(`/userSideCourses/course/${courseId}`);
    }
    
});
router.route('/editReview/:id').get(async (req, res) => {
    console.log("edit review request");
    let reviewId = req.params.id;
    if (!reviewId) {
        req.session.toast = {
            type: 'error',
            message: 'Review ID is required',
        };
        return res.redirect('/users/userProfile');
    }
    reviewId = reviewId.trim();
    // Check if reviewId is a valid ObjectId
    try {
        if (!isValidID(reviewId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid review ID',
            };
            return res.redirect('/users/userProfile');
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid review ID',
        };
        return res.redirect('/users/userProfile');
    }
    // Fetch course details
    console.log('Fetching review with ID:', reviewId);
    try {
        const review = await getReviewById(reviewId);

        if (!review) {
            req.session.toast = {
                type: 'error',
                message: 'Review not found',
            };
            return res.redirect('/users/userProfile');
        }
        console.log("rendering edit review page");
        console.log("review: ", review);
        
        res.render('editReview', { title: 'Edit Review', review });
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Failed to fetch review details',
        };
    }
}).post(async (req, res) => {
    let reviewId = req.params.id;
    let review = xss(req.body.review);
    let difficultyRating = xss(req.body.difficultyRating);
    let overallRating = xss(req.body.overallRating);
    if(!reviewId) {
        req.session.toast = {
            type: 'error',
            message: 'Review ID is required',
        };
        return res.redirect('/users/userProfile');
    }
    reviewId = reviewId.trim();

    // Fetch course details
    if(!difficultyRating || !overallRating ) {
        req.session.toast = {
            type: 'error',
            message: 'All fields are required',
        };
        return res.redirect(`/userSideCourses/editReview/${reviewId}`);
    }   
    if(isNaN(difficultyRating) || isNaN(overallRating)) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid rating values',
        };
        return res.redirect(`/userSideCourses/editReview/${reviewId}`);
    }
    if(difficultyRating < 1 || difficultyRating > 3 || overallRating < 0 || overallRating > 5) {
        req.session.toast = {
            type: 'error',
            message: 'Invalid rating values',
        };
        return res.redirect(`/userSideCourses/editReview/${reviewId}`);
    }
    // Check if reviewId is a valid ObjectId
    try {
        if (!isValidID(reviewId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid review ID',
            };
            return res.redirect('/users/userProfile');
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid review ID',
        };
        return res.redirect('/users/userProfile');
    }
    // Fetch course details
    console.log('Fetching review with ID:', reviewId);
    try {
        const updatedReview = await updateCourseReviewById(reviewId,difficultyRating, overallRating, review);
        if (!updatedReview) {
            req.session.toast = {
                type: 'error',
                message: 'Review not found',
            };
            return res.redirect('/users/userProfile');
        }
        req.session.toast = {
            type: 'success',
            message: 'Review updated successfully',
        };
        return res.redirect('/userSideCourses/myReviews');
    } catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: `Failed to update review: ${error.message}`,
        };
    }
    return res.redirect(`/userSideCourses/editReview/${reviewId}`);
});
//Courses by department
router.route('/departmentCourses/:id').get(async (req, res) => {
    console.log("Fetching all courses by department");
    let departmentId = req.params.id;
    if (!departmentId) {
        req.session.toast = {
            type: 'error',
            message: 'Department ID is required',
        };
        return res.redirect('/users/userProfile');
    }
    departmentId = departmentId.trim();
    // Check if departmentId is a valid ObjectId
    try {
        if (!isValidID(departmentId)) {
            req.session.toast = {
                type: 'error',
                message: 'Invalid department ID',
            };
            return res.redirect('/users/userProfile');
        }
    }
    catch (error) {
        console.error(error);
        req.session.toast = {
            type: 'error',
            message: 'Invalid department ID',
        };
        return res.redirect('/users/userProfile');
    }
    // Fetch course details
    console.log('Fetching course with ID:', departmentId);
    try {
        let courses = await getAllCourses();
        courses= courses.filter((course) => course.departmentId._id.toString() === departmentId);
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

}
);
export default router; 