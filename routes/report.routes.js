import express from "express";
import { createReport, getAllReports } from "../data/reportsController.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const reports = await getAllReports();
    const loggedUserId = req.session.user?.user?._id || null;
    res.render("reportLanding", {
      reports,
      loggedUserId,
      layout: "dashboard",
      customStyles:
        '<link rel="stylesheet" href="/public/css/reportLanding.css">',
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Error loading academic resource landing page");
  }
});

router
  .route("/create/:contentId")
  .get(isLoggedIn, async (req, res) => {
    try {
      const loggedUserId = req.session.user?.user?._id || null;
      const contentId = req.params.contentId;
      res.render("createReport", {
        loggedUserId,
        contentId,
        layout: "dashboard",
        customStyles:
          '<link rel="stylesheet" href="/public/css/createReport.css">',
      });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error loading create academic resource page");
    }
  })
  .post(isLoggedIn, async (req, res) => {
    try {
      const { contentId, type, userId, reason } = req.body;
      const report = createReport(type, userId, reason, contentId);
      if (!report) {
        return res.status(500).json({ error: "Create Report Failed" });
      }
      return res.status(201).redirect("/report");
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

export default router;
