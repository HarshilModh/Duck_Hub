import { isNotLoggedIn } from "../middlewares/auth.middleware.js";
import { isValidString } from "../utils/validation.utils.js";
import { forgotPassword } from "../data/userController.js";
import express from "express";
const router = express.Router();

router.route("/").get(isNotLoggedIn, async (req, res) => {
  res.render("forgotPassword", {
    title: "Forgot Password",
    customStyles: '<link rel="stylesheet" href="/public/css/auth.css">',
  });
});

router.post("/otp", isNotLoggedIn, async (req, res) => {
  let { email } = req.body;
  if (!email || typeof email !== "string" || !(email = email.trim())) {
    req.session.toast = {
      type: "error",
      message: "Please provide a valid email.",
    };
    return res.redirect("/users/forgot-password");
  }

  try {
    //  ➤ Generate & send OTP
    await forgotPassword(email);

    //  ➤ Save email in session for the next step
    req.session.passwordResetEmail = email;

    //  ➤ Notify and go to OTP‐entry page
    req.session.toast = {
      type: "success",
      message: "OTP sent! Check your email.",
    };
    return res.redirect("/users/forgot-password/otp");
  } catch (err) {
    console.error("forgotPassword error:", err);
    req.session.toast = {
      type: "error",
      message: err.message || "Failed to send OTP. Please try again.",
    };
    return res.redirect("/users/forgot-password");
  }
});

// 2️⃣ GET: render the OTP entry form
router.get("/otp", isNotLoggedIn, (req, res) => {
  const email = req.session.passwordResetEmail;
  if (!email) {
    // No email on file? start over
    req.session.toast = {
      type: "error",
      message: "Please enter your email first.",
    };
    return res.redirect("/users/forgot-password");
  }

  res.render("enterOtp", {
    title: "Enter OTP",
    email,
    customStyles: '<link rel="stylesheet" href="/public/css/auth.css">',
  });
});

export default router;
