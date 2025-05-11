import { isNotLoggedIn } from "../middlewares/auth.middleware.js";
import { isValidString } from "../utils/validation.utils.js";
import { forgotPassword } from "../data/userController.js";
import express from "express";
import mongoose from "mongoose";
import Otp from "../models/otp.model.js";
import xss from "xss";
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
    return res.redirect("/forgot-password");
  }

  try {
    const data = await forgotPassword(email);
    req.session.passwordResetEmail = email;
    req.session.userId = data.userId;
    req.session.toast = {
      type: "success",
      message: "OTP sent! Check your email.",
    };
    return res.redirect("/forgot-password/otp");
  } catch (err) {
    console.error("forgotPassword error:", err);
    req.session.toast = {
      type: "error",
      message: err.message || "Failed to send OTP. Please try again.",
    };
    return res.redirect("/forgot-password");
  }
});

router.get("/otp", isNotLoggedIn, (req, res) => {
  const email = req.session.passwordResetEmail;
  const userId = req.session.userId;
  if (!userId) {
    req.session.toast = {
      type: "error",
      message: "Session expired. Please try again.",
    };
    return res.redirect("/forgot-password");
  }
  if (!email) {
    req.session.toast = {
      type: "error",
      message: "Please enter your email first.",
    };
    return res.redirect("/forgot-password");
  }

  res.render("enterOtp", {
    title: "Enter OTP",
    email,
    userId,
    customStyles: '<link rel="stylesheet" href="/public/css/auth.css">',
  });
});

router.post("/verify-otp", async (req, res) => {
  try {
    // 1. Sanitize inputs
    const userId = xss(req.body.userId);
    const code = xss(req.body.otp);

    // 2. Validate userId
    if (!mongoose.isValidObjectId(userId)) {
      req.session.toast = {
        type: "error",
        message: "Invalid request. Please request a new OTP.",
      };
      return res.redirect("/forgot-password");
    }

    // 3. Lookup latest OTP
    const otpDoc = await Otp.findOne({ userId }).sort({ createdAt: -1 }).lean();
    if (!otpDoc) {
      req.session.toast = {
        type: "error",
        message: "No OTP found. Please request a new code.",
      };
      return res.redirect("/forgot-password");
    }

    // 4. Check attempts
    if (otpDoc.attempts <= 0) {
      await Otp.deleteOne({ _id: otpDoc._id });
      req.session.toast = {
        type: "error",
        message: "OTP attempts exhausted. Please request a new code.",
      };
      return res.redirect("/forgot-password");
    }

    // 5. Check expiration
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      req.session.toast = {
        type: "error",
        message: "OTP expired. Please request a new code.",
      };
      return res.redirect("/forgot-password");
    }

    // 6. Validate code
    if (otpDoc.code !== code) {
      // decrement attempts
      otpDoc.attempts -= 1;
      await otpDoc.save();

      if (otpDoc.attempts <= 0) {
        await Otp.deleteOne({ _id: otpDoc._id });
        req.session.toast = {
          type: "error",
          message: "OTP attempts exhausted. Please request a new code.",
        };
        return res.redirect("/forgot-password");
      }

      req.session.toast = {
        type: "error",
        message: `Invalid code. You have ${otpDoc.attempts} attempt${
          otpDoc.attempts > 1 ? "s" : ""
        } remaining.`,
      };
      return res.redirect("back");
    }

    await Otp.deleteOne({ _id: otpDoc._id });
    return res.render("resetPass", {
      userId,
      error: null,
      customStyles: '<link rel="stylesheet" href="/public/css/resetPass.css">',
    });
  } catch (err) {
    console.error("OTP verify error:", err);
    req.session.toast = {
      type: "error",
      message: "Something went wrong. Please try again.",
    };
    return res.redirect("back");
  }
});

export default router;
