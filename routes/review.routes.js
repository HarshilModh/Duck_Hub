import express from "express";
// import Review from "../models/courseReviews.model";
import {
  createCourseReview,
  getAllReviews,
  getCourseReviewById,
  getCourseReviewsByCourseCode,
  getCourseReviewsByCourseId,
  getCourseReviewsByCourseName,
  getCourseReviewsByUserId,
  getMostReviewedCourses,
  getRecentCourseReviews,
  getTopRatedCourses,
  updateCourseReviewById,
  deleteCourseReviewById,
  filterCourseReviews,
} from "../data/courseReviewController.js";
import xss from "xss";

const router = express.Router();

router.route("/").post(async (req, res) => {
  let userId = xss(req.body.userId);
  let courseId = xss(req.body.courseId);
  let difficultyRating = xss(req.body.difficultyRating);
  let overallRating = xss(req.body.overallRating);
  let review = xss(req.body.review);

    if (
      !userId ||
      !courseId ||
      !difficultyRating ||
      !overallRating ||
      !review
    ) {
      req.session.toast = {
        type: "error",
        message: "Missing the required fields",
      };
      return res.status(400).json({
        error: "Missing the required fields",
      });
    }
  try {
    const savedReview = await createCourseReview(
      userId,
      courseId,
      difficultyRating,
      overallRating,
      review
    );
    req.session.toast = { 
      type: "success",
      message: "Review created successfully",
    };
    return res.status(200).json(savedReview);
  } catch (error) {
    req.session.toast = {
      type: "error",
      message: error.message,
    };
    return res.status(400).json({ error: error.message });
  }
});

router.route("/").get(async (req, res) => {
  try {
    const reviews = await getAllReviews();
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const review = await getCourseReviewById(req.params.id);
    return res.status(200).json(review);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.route("/:id").put(async (req, res) => {
  try {
    const updatedReview = await updateCourseReviewById(req.params.id, req.body);
    return res.status(200).json(updatedReview);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.route("/:id").delete(async (req, res) => {
  try {
    const result = await deleteCourseReviewById(req.params.id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.route("/course/:courseId").get(async (req, res) => {
  try {
    const reviews = await getCourseReviewsByCourseId(req.params.courseId);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.route("/user/:userId").get(async (req, res) => {
  try {
    const reviews = await getCourseReviewsByUserId(req.params.userId);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.route("/code/:courseCode").get(async (req, res) => {
  try {
    const reviews = await getCourseReviewsByCourseCode(req.params.courseCode);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.route("/course/:courseName").get(async (req, res) => {
  try {
    const reviews = await getCourseReviewsByCourseName(req.params.courseName);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.route("/filter").post(async (req, res) => {
  try {
    const filteredReviews = await filterCourseReviews(req.body);
    return res.status(200).json(filteredReviews);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
