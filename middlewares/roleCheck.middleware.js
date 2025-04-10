import express from 'express';
import jwt from 'jsonwebtoken';

export const checkRole = (roles) => {return (req, res, next) => {
    if(!req.user || !req.user.role) {
        return res.status(403).json({ message: "Forbidden - No Role Provided" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden - Insufficient Role" });
    }
    next();
}
}
