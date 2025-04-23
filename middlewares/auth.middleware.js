import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import session from "express-session";
export const verifyToken = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Unauthorized - Token Expired" });
            }
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User Not Found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const isLoggedIn = (req, res, next) => {
    //check if session exists
    if (req.session.user) {
         next();
    } else {
        // If session doesn't exist, redirect to login page
        req.session.toast = {
            type: "error",
            message: "Please log in to access this page.",
        };
        return res.redirect("/users/login");
    }
}
export const isNotLoggedIn = (req, res, next) => {
    //check if session exists
    if (req.session && req.session.user) {
        // If session exists, redirect to user profile page
        return res.redirect("/users/userProfile");
    } else {
         next();
    }
}