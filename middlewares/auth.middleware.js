import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

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