import { isNotLoggedIn } from "../middlewares/auth.middleware.js";
import { isValidString, isValidPassword } from "../utils/validation.utils.js";
import { forgotPassword } from "../data/userController.js";
import express from "express";
import mongoose from "mongoose";
import Otp from "../models/otp.model.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import xss from "xss";
import { type } from "os";
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
    const user = await User.findOne({ email });
    if (user.googleId !== null) {
      throw new Error(
        "Can't change password: This account is associated with SSO"
      );
    }
  } catch (error) {
    req.session.toast = {
      type: "error",
      message: error.message || "Account associated with SSO",
    };
    return res.render("/users/login");
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
    const userId = xss(req.body.userId);
    const code = xss(req.body.otp);

    if (!mongoose.isValidObjectId(userId)) {
      req.session.toast = {
        type: "error",
        message: "Invalid request. Please request a new OTP.",
      };
      return res.redirect("/forgot-password");
    }

    const otpDoc = await Otp.findOne({ userId }).lean();
    if (!otpDoc) {
      req.session.toast = {
        type: "error",
        message: "No OTP found. Please request a new code.",
      };
      return res.redirect("/forgot-password");
    }

    if (otpDoc.attempts <= 0) {
      await Otp.deleteOne({ _id: otpDoc._id });
      req.session.toast = {
        type: "error",
        message: "No more attempts. Please request a new code.",
      };
      return res.redirect("/forgot-password");
    }

    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: otpDoc._id });
      req.session.toast = {
        type: "error",
        message: "OTP expired. Please request a new code.",
      };
      return res.redirect("/forgot-password");
    }

    if (otpDoc.code !== code) {
      otpDoc.attempts -= 1;
      await Otp.updateOne({ _id: otpDoc._id }, { $inc: { attempts: -1 } });

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
      return res.redirect("/forgot-password/otp");
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
    return res.redirect("/forgot-password");
  }
});

router.post("/reset-password", async (req, res) => {
  let userId = xss(req.body.userId);
  let password = xss(req.body.password);
  let confirmPassword = xss(req.body.confirmPassword);

  if (!mongoose.isValidObjectId(userId)) {
    req.session.toast = {
      type: "error",
      message: "Invalid request. Please request a new OTP.",
    };
    return res.render("resetPass", {
      error: null,
      userId,
      customStyles: '<link rel="stylesheet" href="/public/css/resetPass.css">',
    });
  }

  try {
    password = isValidString(password, "password");
    confirmPassword = isValidString(confirmPassword, "confirmPassword");
  } catch (e) {
    req.session.toast = {
      type: "error",
      message: e.message,
    };
    return res.render("resetPass", {
      error: null,
      userId,
      customStyles: '<link rel="stylesheet" href="/public/css/resetPass.css">',
    });
  }

  if (password.length < 8 || password.length > 1024) {
    req.session.toast = {
      type: "error",
      message: "Password must be between 8 and 1024 characters.",
    };
    return res.render("resetPass", {
      error: null,
      userId,
      customStyles: '<link rel="stylesheet" href="/public/css/resetPass.css">',
    });
  }

  if (!isValidPassword(password)) {
    req.session.toast = {
      type: "error",
      message:
        "Password must include at least one uppercase letter, one number, etc.",
    };
    return res.render("resetPass", {
      error: null,
      userId,
      customStyles: '<link rel="stylesheet" href="/public/css/resetPass.css">',
    });
  }

  if (password !== confirmPassword) {
    req.session.toast = {
      type: "error",
      message: "Passwords do not match.",
    };
    return res.render("resetPass", {
      error: null,
      userId,
      customStyles: '<link rel="stylesheet" href="/public/css/resetPass.css">',
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const updated = await User.findByIdAndUpdate(userId, { password: hashed });
    if (!updated) {
      req.session.toast = {
        type: "error",
        message: "Failed to update password. Please try again.",
      };
      return res.render("resetPass", {
        error: null,
        userId,
        customStyles:
          '<link rel="stylesheet" href="/public/css/resetPass.css">',
      });
    }
    req.session.toast = {
      type: "success",
      message: "Password updated! Please log in with your new password.",
    };
    return res.redirect("/users/login");
  } catch (e) {
    console.error(e);
    req.session.toast = {
      type: "error",
      message: "Failed to update password. Please try again.",
    };
    return res.render("resetPass", {
      error: null,
      userId,
      customStyles: '<link rel="stylesheet" href="/public/css/resetPass.css">',
    });
  }
});

export default router;
